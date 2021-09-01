import { RunPredictorsResponse } from "../repositories/PredictorRepository";

export interface SchedulerExecution {
    duration: number;
    lastExecuted: Date;
    nextExecution: Date;
    results: RunPredictorsResponse[];
}
