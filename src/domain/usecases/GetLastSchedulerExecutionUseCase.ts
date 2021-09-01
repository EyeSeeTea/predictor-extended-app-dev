import { UseCase } from "../../compositionRoot";
import { FutureData } from "../entities/Future";
import { SchedulerExecution } from "../entities/SchedulerExecution";
import { SchedulerRepository } from "../repositories/SchedulerRepository";

export class GetLastSchedulerExecutionUseCase implements UseCase {
    constructor(private userRepository: SchedulerRepository) {}

    public execute(): FutureData<SchedulerExecution | undefined> {
        return this.userRepository.getLastExecution();
    }
}
