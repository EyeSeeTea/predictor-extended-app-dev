import { UseCase } from "../../../compositionRoot";
import { NamedRef } from "../../entities/DHIS2";
import { PredictorRepository } from "../../repositories/PredictorRepository";

export class GetPredictorGroupsUseCase implements UseCase {
    constructor(private predictorRepository: PredictorRepository) {}

    public execute(): Promise<NamedRef[]> {
        return this.predictorRepository.getGroups();
    }
}
