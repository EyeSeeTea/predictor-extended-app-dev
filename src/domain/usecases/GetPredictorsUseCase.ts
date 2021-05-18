import { TablePagination, TableSorting } from "@eyeseetea/d2-ui-components";
import { UseCase } from "../../compositionRoot";
import { Predictor } from "../entities/Predictor";
import { ListPredictorsFilters, PredictorRepository } from "../repositories/PredictorRepository";

export class ListPredictorsUseCase implements UseCase {
    constructor(private predictorRepository: PredictorRepository) {}

    public execute(
        filters: ListPredictorsFilters,
        paging: TablePagination,
        sorting: TableSorting<Predictor>
    ) {
        return this.predictorRepository.list(filters, paging, sorting);
    }
}
