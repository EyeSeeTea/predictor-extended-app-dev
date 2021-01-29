import { TableSorting } from "@eyeseetea/d2-ui-components";
import _ from "lodash";
import { NamedRef } from "../domain/entities/DHIS2";
import { Predictor } from "../domain/entities/Predictor";
import {
    ListPredictorsFilters,
    PredictorRepository,
} from "../domain/repositories/PredictorRepository";
import { D2Api, MetadataResponse } from "../types/d2-api";
import { formatDate } from "../utils/dates";
import { promiseMap } from "../utils/promises";
import { Pager } from "../webapp/components/objects-list/objects-list-hooks";
import { getD2APiFromUrl } from "./utils/d2-api";

export class PredictorD2ApiRepository implements PredictorRepository {
    private api: D2Api;

    constructor(baseUrl: string) {
        this.api = getD2APiFromUrl(baseUrl);
    }

    public async get(ids: string[]): Promise<Predictor[]> {
        const { objects } = await this.api.models.predictors
            .get({
                filter: { id: { in: ids } },
                paging: false,
                fields: predictorFields,
            })
            .getData();

        return objects;
    }

    public async list(
        filters?: ListPredictorsFilters,
        paging?: { page: number; pageSize: number },
        sorting?: TableSorting<Predictor>
    ): Promise<{ pager: Pager; objects: Predictor[] }> {
        const { search, predictorGroups = [], dataElements = [], lastUpdated } = filters ?? {};

        return this.api.models.predictors
            .get({
                filter: {
                    name: search ? { token: search } : undefined,
                    "predictorGroups.id":
                        predictorGroups.length > 0 ? { in: predictorGroups } : undefined,
                    "output.id": dataElements.length > 0 ? { in: dataElements } : undefined,
                    lastUpdated: lastUpdated ? { ge: lastUpdated } : undefined,
                },
                page: paging?.page,
                pageSize: paging?.pageSize,
                order: sorting ? `${sorting.field}:${sorting.order}` : undefined,
                fields: predictorFields,
            })
            .getData();
    }

    public async getGroups(): Promise<NamedRef[]> {
        const { objects } = await this.api.models.predictorGroups
            .get({ paging: false, fields: { id: true, displayName: true } })
            .getData();

        return objects.map(({ id, displayName }) => ({ id, name: displayName }));
    }

    public async getDataElements(): Promise<NamedRef[]> {
        const { objects } = await this.api.models.predictors
            .get({ paging: false, fields: { output: { id: true, displayName: true } } })
            .getData();

        return _.uniqBy(objects.map(({ output }) => ({ id: output.id, name: output.displayName })), "id");
    }

    // TODO: Response {"httpStatus":"OK","httpStatusCode":200,"status":"OK","message":"Generated 0 predictions"}
    public async run(ids: string[], startDate: Date, endDate: Date): Promise<void> {
        await promiseMap(ids, id =>
            this.api
                .post(`/predictors/${id}/run`, {
                    startDate: formatDate(startDate),
                    endDate: formatDate(endDate),
                })
                .getData()
        );
    }

    public async save(predictors: Predictor[]): Promise<MetadataResponse> {
        // TODO FIXME: Predictor groups need to be updated with predictors to be included
        return this.api.metadata.post({ predictors }).getData();
    }
}

const predictorFields = {
    id: true,
    code: true,
    name: true,
    description: true,
    output: { id: true, name: true },
    outputCombo: { id: true, name: true },
    periodType: true,
    annualSampleCount: true,
    generator: {
        expression: true,
        description: true,
        missingValueStrategy: true,
        slidingWindow: true,
    },
    organisationUnitLevels: true,
    predictorGroups: { id: true, name: true },
    sampleSkipTest: {
        expression: true,
        description: true,
        missingValueStrategy: true,
        slidingWindow: true,
    },
    sequentialSampleCount: true,
    sequentialSkipCount: true,
    lastUpdated: true,
    lastUpdatedBy: { id: true, name: true },
    created: true,
    user: { id: true, name: true },
    publicAccess: true,
    userAccesses: { id: true, access: true, displayName: true },
    userGroupAccesses: { id: true, access: true, displayName: true },
};
