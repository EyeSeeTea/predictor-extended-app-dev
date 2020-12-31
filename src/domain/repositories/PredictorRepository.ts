import { Pager } from "../../webapp/components/objects-list/objects-list-hooks";
import { Predictor } from "../entities/Predictor";

export interface PredictorRepository {
    get(): Promise<{ pager: Pager; objects: Predictor[] }>;
}
