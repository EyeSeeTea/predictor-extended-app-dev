import { SchedulingSettings, Settings } from "../../domain/entities/Settings";
import { Codec, Schema } from "../utils/codec";

export const SchedulingSettingsModel: Codec<SchedulingSettings> = Schema.oneOf([
    Schema.object({ enabled: Schema.false }),
    Schema.object({
        enabled: Schema.true,
        recurrence: Schema.string,
        delay: Schema.number,
        startDate: Schema.date,
        endDate: Schema.date,
    }),
]);

export const SettingsModel: Codec<Settings> = Schema.object({
    scheduling: Schema.optionalSafe(SchedulingSettingsModel, { enabled: false }),
});
