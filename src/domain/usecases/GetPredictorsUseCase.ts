import { TablePagination, TableSorting } from "@eyeseetea/d2-ui-components";
import { UseCase } from "../../compositionRoot";
import { Predictor } from "../entities/Predictor";
import { PredictorRepository } from "../repositories/PredictorRepository";

interface GetPredictorsFilters {
    search?: string;
    predictorGroups?: string[];
    dataElements?: string[];
}

export class ListPredictorsUseCase implements UseCase {
    constructor(private predictorRepository: PredictorRepository) {}

    public execute(
        filters: GetPredictorsFilters,
        paging: TablePagination,
        sorting: TableSorting<Predictor>
    ) {
        return this.predictorRepository.list(filters, paging, sorting);
    }
}
