import { PredictorRepository } from "../repositories/PredictorRepository";

export class GetPredictorsUseCase {
    constructor(private predictorRepository: PredictorRepository) {}

    execute() {
        return this.predictorRepository.get();
    }
}
