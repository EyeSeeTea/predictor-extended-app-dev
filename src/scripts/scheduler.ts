import { ArgumentParser } from "argparse";
import fs from "fs";
import _ from "lodash";
import { PredictorD2ApiRepository } from "../data/PredictorD2ApiRepository";
import { SettingsD2ApiRepository } from "../data/SettingsD2ApiRepository";
import { StorageDataStoreRepository } from "../data/StorageDataStoreRepository";
import { Future, FutureData } from "../domain/entities/Future";
import { PredictorDetails } from "../domain/entities/Predictor";
import { Settings } from "../domain/entities/Settings";
import { GetSettingsUseCase } from "../domain/usecases/GetSettingsUseCase";
import { ListPredictorsUseCase } from "../domain/usecases/ListPredictorsUseCase";
import { ConfigModel, SchedulerConfig, SchedulerInstance } from "./entities/SchedulerConfig";

function runPredictors(settings: Settings, predictors: PredictorDetails[]) {
    const orderedPredictors = _.sortBy(predictors, ["scheduling.sequence", "scheduling.variable", "id"]);
    console.log(settings, orderedPredictors);
}

// Tried to use the composition root here, but it was importing React components and failed to compile
function getPredictors(instance: SchedulerInstance): FutureData<{ objects: PredictorDetails[] }> {
    const storageRepository = new StorageDataStoreRepository(instance);
    const predictorRepository = new PredictorD2ApiRepository(instance, storageRepository);
    return new ListPredictorsUseCase(predictorRepository).execute(undefined, { paging: false });
}

// Tried to use the composition root here, but it was importing React components and failed to compile
function getSettings(instance: SchedulerInstance): FutureData<Settings> {
    const storageRepository = new StorageDataStoreRepository(instance);
    const settingsRepository = new SettingsD2ApiRepository(storageRepository);
    return new GetSettingsUseCase(settingsRepository).execute();
}

function parseConfig(config: SchedulerConfig) {
    Future.futureMap(config.instances, instance => {
        const settings$ = getSettings(instance);
        const predictors$ = getPredictors(instance);

        return Future.join2(settings$, predictors$).map(([settings, { objects: predictors }]) =>
            runPredictors(settings, predictors)
        );
    }).run(
        result => console.log({ result }),
        error => console.error(error)
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
        parseConfig(config);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

main();
