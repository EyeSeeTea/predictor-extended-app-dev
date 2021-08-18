import { Codec, Schema } from "../../data/utils/codec";

export const ConfigModel: Codec<SchedulerConfig> = Schema.object({
    instances: Schema.array(
        Schema.object({
            name: Schema.string,
            url: Schema.string,
            username: Schema.string,
            password: Schema.string,
        })
    ),
});

export interface SchedulerInstance {
    name: string;
    url: string;
    username: string;
    password: string;
}

export interface SchedulerConfig {
    instances: SchedulerInstance[];
}
