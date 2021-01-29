import { UseCase } from "../../compositionRoot";
import { MetadataResponse } from "../entities/Metadata";
import { Predictor } from "../entities/Predictor";
import { PredictorRepository } from "../repositories/PredictorRepository";

export class ImportPredictorsUseCase implements UseCase {
    constructor(private predictorRepository: PredictorRepository) {}

    public async execute(predictors: Predictor[]): Promise<MetadataResponse> {
        return this.predictorRepository.save(predictors);
    }
}
