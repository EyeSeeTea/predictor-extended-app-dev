import { TableSorting } from "d2-ui-components";
import { format } from "date-fns";
import { Predictor } from "../domain/entities/Predictor";
import { PredictorRepository } from "../domain/repositories/PredictorRepository";
import { D2Api } from "../types/d2-api";
import { getD2APiFromInstance } from "../utils/d2-api";
import { promiseMap } from "../utils/promises";
import { Pager } from "../webapp/components/objects-list/objects-list-hooks";

export class PredictorD2ApiRepository implements PredictorRepository {
    private api: D2Api;

    constructor(baseUrl: string) {
        this.api = getD2APiFromInstance(baseUrl);
    }

    public async get(
        search?: string,
        paging?: { page: number; pageSize: number },
        sorting?: TableSorting<Predictor>
    ): Promise<{ pager: Pager; objects: Predictor[] }> {
        return this.api.models.predictors
            .get({
                filter: { name: { token: search } },
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

    // TODO: Not tested, will likely require startDate and endDate
    public async runAll(): Promise<void> {
        await this.api.post(`/predictors/run`).getData();
    }
}

function formatDate(date: Date): string {
    return format(date, "yyyy-MM-dd");
}
