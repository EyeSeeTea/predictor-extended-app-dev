import { TablePagination, TableSorting } from "d2-ui-components";
import { UseCase } from "../../compositionRoot";
import { Predictor } from "../entities/Predictor";
import { PredictorRepository } from "../repositories/PredictorRepository";

interface GetPredictorsFilters {
    search?: string;
    predictorGroups?: string[];
}

export class GetPredictorsUseCase implements UseCase {
    constructor(private predictorRepository: PredictorRepository) {}

    public execute(
        filters: GetPredictorsFilters,
        paging: TablePagination,
        sorting: TableSorting<Predictor>
    ) {
        return this.predictorRepository.get(filters, paging, sorting);
    }
}
