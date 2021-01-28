import { UseCase } from "../../compositionRoot";
import { PredictorRepository } from "../repositories/PredictorRepository";

export class DeletePredictorsUseCase implements UseCase{

    constructor(private predictorRepository: PredictorRepository){}

    public async execute(id: string): Promise<void>{
        return this.predictorRepository.delete(id);
    }
}