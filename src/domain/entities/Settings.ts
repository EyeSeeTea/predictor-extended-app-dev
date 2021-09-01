import { PeriodObject } from "./SchedulerPeriod";

export type SchedulingSettings =
    | { enabled: false }
    | {
          enabled: true;
          period: PeriodObject;
      };

export interface Settings {
    scheduling: SchedulingSettings;
}
