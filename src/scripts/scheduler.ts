import _ from "lodash";
import { getLogger } from "log4js";
import moment from "moment";
import schedule from "node-schedule";
import { CompositionRoot } from "../compositionRoot";
import { SchedulerInstance } from "./entities/SchedulerConfig";

const DEFAULT_CODE = "__default__";

export default class Scheduler {
    constructor(private instance: SchedulerInstance, private compositionRoot: CompositionRoot) {}

    private synchronizationTask = async (): Promise<void> => {
        try {
            const settings = await this.compositionRoot.settings.get().toPromise();
            if (!settings.scheduling.enabled) return;

            const { objects } = await this.compositionRoot.predictors.list(undefined, { paging: false }).toPromise();
            const { period } = settings.scheduling;
            const ids = objects.map(({ id }) => id);

            getLogger("execution").info(`Running predictions for ${ids.length} items with period ${period.type}`);

            const results = await this.compositionRoot.predictors.run(ids, period).toPromise();
            results.forEach(({ id, status, message }) =>
                getLogger("execution").info(`Executed ${id} ${status}: ${message}`)
            );
        } catch (error) {
            getLogger("execution").error(`Failed to run predictions`);
        }
    };

    private fetchTask = async (): Promise<void> => {
        try {
            const settings = await this.compositionRoot.settings.get().toPromise();
            if (!settings.scheduling.enabled) return;

            const { frequency } = settings.scheduling;
            const existingJob = schedule.scheduledJobs[frequency];
            if (existingJob) return;

            const currentJobIds = _.keys(schedule.scheduledJobs);
            const idsToCancel = _.difference(currentJobIds, [DEFAULT_CODE]);
            idsToCancel.forEach((id: string) => {
                getLogger("scheduler").info(`Detected configuration changes. Cancelling old job (${id})`);
                schedule.scheduledJobs[id]?.cancel();
            });

            const job = schedule.scheduleJob(frequency, frequency, this.synchronizationTask);
            const nextDate = moment(job.nextInvocation().toISOString()).toISOString(true);
            getLogger("scheduler").info(`Scheduling job at ${nextDate} (${frequency})`);
        } catch (error) {
            getLogger("scheduler").error(error);
        }
    };

    public initialize(): void {
        // Execute fetch task immediately
        this.fetchTask();

        // Schedule periodic fetch task every minute
        schedule.scheduleJob(DEFAULT_CODE, "0 * * * * *", this.fetchTask);

        getLogger("main").info(`Loading configuration for ${this.instance.name} (${this.instance.url}) with user ${this.instance.username}`);
    }
}
