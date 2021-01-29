import { TableSorting } from "@eyeseetea/d2-ui-components";
import { Pager } from "../../webapp/components/objects-list/objects-list-hooks";
import { NamedRef } from "../entities/DHIS2";
import { MetadataResponse } from "../entities/Metadata";
import { Predictor } from "../entities/Predictor";

export interface PredictorRepository {
    get(ids: string[]): Promise<Predictor[]>;

    list(
        filters: ListPredictorsFilters,
        paging: { page: number; pageSize: number },
        sorting: TableSorting<Predictor>
    ): Promise<{ pager: Pager; objects: Predictor[] }>;

    getGroups(): Promise<NamedRef[]>;

    getDataElements(): Promise<NamedRef[]>;

    run(ids: string[], startDate: Date, endDate: Date): Promise<void>;

    save(predictors: Predictor[]): Promise<MetadataResponse>;
}

export interface ListPredictorsFilters {
    search?: string;
    predictorGroups?: string[];
    dataElements?: string[];
    lastUpdated?: string;
}
