import { Codec, Schema } from "../../data/utils/codec";

export const ConfigModel: Codec<SchedulerConfig> = Schema.object({
    instances: Schema.array(
        Schema.object({
            url: Schema.string,
            username: Schema.string,
            password: Schema.string,
        })
    ),
});

export interface SchedulerInstance {
    url: string;
    username: string;
    password: string;
}

export interface SchedulerConfig {
    instances: SchedulerInstance[];
}
