import { TableSorting } from "d2-ui-components";
import { format } from "date-fns";
import { NamedRef } from "../domain/entities/DHIS2";
import { Predictor } from "../domain/entities/Predictor";
import { PredictorRepository } from "../domain/repositories/PredictorRepository";
import { D2Api } from "../types/d2-api";
import { getD2APiFromUrl } from "../utils/d2-api";
import { promiseMap } from "../utils/promises";
import { Pager } from "../webapp/components/objects-list/objects-list-hooks";

export class PredictorD2ApiRepository implements PredictorRepository {
    private api: D2Api;

    constructor(baseUrl: string) {
        this.api = getD2APiFromUrl(baseUrl);
    }

    public async get(
        filters?: { search?: string; predictorGroups?: string[] },
        paging?: { page: number; pageSize: number },
        sorting?: TableSorting<Predictor>
    ): Promise<{ pager: Pager; objects: Predictor[] }> {
        const { search, predictorGroups = [] } = filters ?? {};

        return this.api.models.predictors
            .get({
                filter: {
                    name: search ? { token: search } : undefined,
                    "predictorGroups.id": predictorGroups.length > 0 ? { in: predictorGroups } : undefined,
                },
                page: paging?.page,
                pageSize: paging?.pageSize,
                order: sorting ? `${sorting.field}:${sorting.order}` : undefined,
                fields: {
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
                },
            })
            .getData();
    }

    public async getGroups(): Promise<NamedRef[]> {
        const { objects } = await this.api.models.predictorGroups
            .get({ paging: false, fields: { id: true, displayName: true } })
            .getData();

        return objects.map(({ id, displayName }) => ({ id, name: displayName }));
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
}

function formatDate(date: Date): string {
    return format(date, "yyyy-MM-dd");
}
