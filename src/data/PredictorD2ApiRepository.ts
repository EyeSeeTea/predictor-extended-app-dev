import { Predictor } from "../domain/entities/Predictor";
import { PredictorRepository } from "../domain/repositories/PredictorRepository";
import { D2Api } from "../types/d2-api";
import { getD2APiFromInstance } from "../utils/d2-api";
import { Pager } from "../webapp/components/objects-list/objects-list-hooks";

export class PredictorD2ApiRepository implements PredictorRepository {
    private api: D2Api;

    constructor(baseUrl: string) {
        this.api = getD2APiFromInstance(baseUrl);
    }

    async get(): Promise<{ pager: Pager; objects: Predictor[] }> {
        return this.api.models.predictors
            .get({
                fields: { $owner: true },
            })
            .getData() as any;
    }
}
