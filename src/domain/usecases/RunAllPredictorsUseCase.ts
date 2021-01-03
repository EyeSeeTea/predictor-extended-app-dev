import { UseCase } from "../../compositionRoot";
import { PredictorRepository } from "../repositories/PredictorRepository";

export class RunAllPredictorsUseCase implements UseCase {
    constructor(private predictorRepository: PredictorRepository) {}

    public execute() {
        return this.predictorRepository.runAll();
    }
}
