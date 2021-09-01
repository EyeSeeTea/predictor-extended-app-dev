import { SchedulingSettings, Settings } from "../../domain/entities/Settings";
import { Codec, Schema } from "../utils/codec";
import { PeriodObjectModel } from "./SchedulerPeriodModel";

export const SchedulingSettingsModel: Codec<SchedulingSettings> = Schema.oneOf([
    Schema.object({ enabled: Schema.false }),
    Schema.object({
        enabled: Schema.true,
        period: PeriodObjectModel,
    }),
]);

export const SettingsModel: Codec<Settings> = Schema.object({
    scheduling: Schema.optionalSafe(SchedulingSettingsModel, { enabled: false }),
});
