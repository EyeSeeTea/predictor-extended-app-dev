import { command, option, run, string } from "cmd-ts";
import fs from "fs";
import { configure, getLogger } from "log4js";
import path from "path";
import { CompositionRoot, getCompositionRoot } from "../compositionRoot";
import { Future, FutureData } from "../domain/entities/Future";
import { PredictorDetails } from "../domain/entities/Predictor";
import { SchedulingSettings } from "../domain/entities/Settings";
import { RunPredictorsResponse } from "../domain/repositories/PredictorRepository";
import { ConfigModel, SchedulerConfig } from "./entities/SchedulerConfig";

const development = process.env.NODE_ENV === "development";

configure({
    appenders: {
        out: { type: "stdout" },
        file: { type: "file", filename: "debug.log" },
    },
    categories: { default: { appenders: ["file", "out"], level: development ? "all" : "debug" } },
});

function runPredictors(
    compositionRoot: CompositionRoot,
    instance: string,
    predictors: PredictorDetails[],
    scheduling: SchedulingSettings
): FutureData<RunPredictorsResponse[]> {
    if (!scheduling.enabled) {
        getLogger(instance).info("Scheduling is disabled");
        return Future.success([]);
    }

    const ids = predictors.map(({ id }) => id);

    return compositionRoot.predictors.run(ids, scheduling.period).map(results => {
        results.forEach(({ id, status, message }) => getLogger(instance).info(`Executed ${id} ${status}: ${message}`));
        return results;
    });
}

const checkMigrations = (compositionRoot: CompositionRoot): FutureData<boolean> => {
    return Future.fromPromise(compositionRoot.migrations.hasPending())
        .mapError(() => {
            return "Unable to connect with remote instance";
        })
        .flatMap(pendingMigrations => {
            if (pendingMigrations) {
                return Future.error<string, boolean>("There are pending migrations, unable to continue");
            }

            return Future.success(pendingMigrations);
        });
};

function parseConfig(config: SchedulerConfig) {
    return Future.futureMap(
        config.instances,
        instance => {
            const compositionRoot = getCompositionRoot(instance);
            const { name, url } = instance;
            getLogger(name).info(`Loaded instance at ${url}`);

            return checkMigrations(compositionRoot)
                .flatMap(() =>
                    Future.joinObj({
                        predictors: compositionRoot.predictors.list(undefined, { paging: false }),
                        settings: compositionRoot.settings.get(),
                    })
                )
                .flatMap(({ predictors: { objects }, settings: { scheduling } }) =>
                    runPredictors(compositionRoot, name, objects, scheduling)
                )
                .mapError(error => `[${name}] ${error}`);
        },
        {
            catchErrors: error => {
                getLogger("main").error(error);
                return [];
            },
        }
    );
}

async function main() {
    const cmd = command({
        name: path.basename(__filename),
        description: "Scheduler to execute predictors on multiple DHIS2 instances",
        args: {
            config: option({
                type: string,
                long: "config",
                short: "c",
                description: "Configuration file",
            }),
        },
        handler: async args => {
            try {
                const text = fs.readFileSync(args.config, "utf8");
                const contents = JSON.parse(text);
                const config = ConfigModel.unsafeDecode(contents);
                parseConfig(config).run(
                    () => process.exit(0),
                    error => getLogger("main").error(error)
                );
            } catch (err) {
                getLogger("main").fatal(err);
                process.exit(1);
            }
        },
    });

    run(cmd, process.argv.slice(2));
}

main();
