import { TablePagination, TableSorting } from "@eyeseetea/d2-ui-components";
import { UseCase } from "../../compositionRoot";
import { Pager } from "../../types/d2-api";
import { FutureData } from "../entities/Future";
import { Predictor } from "../entities/Predictor";
import { ListPredictorsFilters, PredictorRepository } from "../repositories/PredictorRepository";

export class ListPredictorsUseCase implements UseCase {
    constructor(private predictorRepository: PredictorRepository) {}

    public execute(
        filters: ListPredictorsFilters,
        paging: TablePagination,
        sorting: TableSorting<Predictor>
    ): FutureData<{
        pager: Pager;
        objects: Predictor[];
    }> {
        return this.predictorRepository.list(filters, paging, sorting);
    }
}
