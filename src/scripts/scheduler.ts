import { ArgumentParser } from "argparse";
import fs from "fs";
import _ from "lodash";
import { configure, getLogger } from "log4js";
import { CompositionRoot, getCompositionRoot } from "../compositionRoot";
import { Future, FutureData } from "../domain/entities/Future";
import { PredictorDetails } from "../domain/entities/Predictor";
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
    predictors: PredictorDetails[]
): FutureData<RunPredictorsResponse[]> {
    const ids = predictors.map(({ id }) => id);

    return compositionRoot.predictors.run(ids).map(results => {
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
                return Future.error<string, boolean>("There are pending migrations, unableto continue");
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
                        settings: compositionRoot.settings.get(), // TODO
                    })
                )
                .flatMap(({ predictors: { objects } }) => runPredictors(compositionRoot, name, objects))
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
    const parser = new ArgumentParser({
        description: "Scheduler to execute predictors on multiple DHIS2 instances",
    });

    parser.add_argument("-c", "--config", {
        required: true,
        help: "Configuration file",
    });

    try {
        const args = parser.parse_args();
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
}

main();
