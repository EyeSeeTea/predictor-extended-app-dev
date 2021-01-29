import { UseCase } from "../../../compositionRoot";
import { PredictorRepository } from "../../repositories/PredictorRepository";

export class RunPredictorsUseCase implements UseCase {
    constructor(private predictorRepository: PredictorRepository) {}

    public execute(predictors: string[]) {
        // TODO: FIXME real dates from UI
        return this.predictorRepository.run(predictors, new Date(), new Date());
    }
}
