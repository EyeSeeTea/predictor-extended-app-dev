import { UseCase } from "../../compositionRoot";
import { FutureData } from "../entities/Future";
import { PredictorRepository, RunPredictorsResponse } from "../repositories/PredictorRepository";

export class RunPredictorsUseCase implements UseCase {
    constructor(private predictorRepository: PredictorRepository) {}

    public execute(predictors: string[]): FutureData<RunPredictorsResponse[]> {
        // TODO: FIXME real dates
        return this.predictorRepository.run(predictors, new Date("2020-01-01"), new Date("2021-01-01"));
    }
}
