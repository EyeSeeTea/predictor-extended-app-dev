import { UseCase } from "../../compositionRoot";
import { FutureData } from "../entities/Future";
import { Predictor } from "../entities/Predictor";
import { PredictorRepository } from "../repositories/PredictorRepository";

export class GetPredictorsUseCase implements UseCase {
    constructor(private predictorRepository: PredictorRepository) {}

    public execute(ids: string[]): FutureData<Predictor[]> {
        return this.predictorRepository.get(ids);
    }
}
