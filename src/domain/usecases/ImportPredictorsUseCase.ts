import { UseCase } from "../../compositionRoot";
import { Predictor } from "../entities/Predictor";
import { PredictorRepository } from "../repositories/PredictorRepository";

export class ImportPredictorsUseCase implements UseCase {
    constructor(private predictorRepository: PredictorRepository) {}

    public async execute(predictors: Predictor[]): Promise<void> {
        this.predictorRepository.save(predictors);
    }
}
