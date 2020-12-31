import { PredictorD2ApiRepository } from "./data/PredictorD2ApiRepository";
import { GetPredictorsUseCase } from "./domain/usecases/GetPredictorsUseCase";

export function getCompositionRoot() {
    const dataValueRepository = new PredictorD2ApiRepository();

    return {
        predictors: {
            get: new GetPredictorsUseCase(dataValueRepository),
        },
    };
}

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;
