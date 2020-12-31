import { PredictorRepository } from "../repositories/PredictorRepository";
import { Predictor } from "../entities/Predictor";

export class GetPredictorsUseCase {
    constructor(private predictorRepository: PredictorRepository) {}

    execute(): Promise<Predictor[]> {
        return this.predictorRepository.get();
    }
}
