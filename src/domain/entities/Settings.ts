export type SchedulingSettings =
    | { enabled: false }
    | {
          enabled: true;
          recurrence: string;
          delay: number;
          startDate: Date;
          endDate: Date;
      };

export interface Settings {
    scheduling: SchedulingSettings;
}
