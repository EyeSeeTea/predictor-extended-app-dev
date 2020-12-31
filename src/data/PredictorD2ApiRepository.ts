import { Predictor } from "../domain/entities/Predictor";
import { PredictorRepository } from "../domain/repositories/PredictorRepository";

export class PredictorD2ApiRepository implements PredictorRepository {
    async get(): Promise<Predictor[]> {
        throw new Error("Not implemented");
    }
}
