import { UseCase } from "../../compositionRoot";
import { FutureData } from "../entities/Future";
import { PredictorRepository } from "../repositories/PredictorRepository";

export class DeletePredictorsUseCase implements UseCase {
    constructor(private predictorRepository: PredictorRepository) {}

    public execute(ids: string[]): FutureData<void> {
        return this.predictorRepository.delete(ids);
    }
}
