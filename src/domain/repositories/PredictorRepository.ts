import { TableSorting } from "@eyeseetea/d2-ui-components";
import { Pager } from "../../webapp/components/objects-list/objects-list-hooks";
import { NamedRef } from "../entities/DHIS2";
import { FutureData } from "../entities/Future";
import { MetadataResponse } from "../entities/Metadata";
import { Predictor } from "../entities/Predictor";

export interface PredictorRepository {
    get(ids: string[]): FutureData<Predictor[]>;

    list(
        filters?: ListPredictorsFilters,
        paging?: { page: number; pageSize: number },
        sorting?: TableSorting<Predictor>
    ): FutureData<{ pager: Pager; objects: Predictor[] }>;

    getGroups(): FutureData<NamedRef[]>;

    getOutputDataElements(): FutureData<NamedRef[]>;

    run(ids: string[], startDate: Date, endDate: Date): FutureData<any>;

    save(predictors: Predictor[]): FutureData<MetadataResponse>;

    delete(ids: string[]): FutureData<void>;

    validateExpression(type: ExpressionType, expression: string): FutureData<ExpressionValidation>;
}

export type ExpressionType = "predictor-formula" | "predictor-skip-test";

export interface ExpressionValidation {
    message: string;
    description: string;
    status: "OK" | "ERROR";
}

export interface ListPredictorsFilters {
    search?: string;
    predictorGroups?: string[];
    dataElements?: string[];
    lastUpdated?: string;
}
