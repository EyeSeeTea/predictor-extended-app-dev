import { TablePagination, TableSorting } from "d2-ui-components";
import { UseCase } from "../../compositionRoot";
import { Predictor } from "../entities/Predictor";
import { PredictorRepository } from "../repositories/PredictorRepository";

export class GetPredictorsUseCase implements UseCase {
    constructor(private predictorRepository: PredictorRepository) {}

    public execute(search: string, paging: TablePagination, sorting: TableSorting<Predictor>) {
        return this.predictorRepository.get(search, paging, sorting);
    }
}
