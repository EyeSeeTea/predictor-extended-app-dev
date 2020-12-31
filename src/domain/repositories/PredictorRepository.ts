import { Predictor } from "../entities/Predictor";

export interface PredictorRepository {
    get(): Promise<Predictor[]>;
}
