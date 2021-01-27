import { D2Api } from "d2-api/2.32";
import { Metadata, MetadataType } from "../domain/entities/Metadata";
import { MetadataRepository } from "../domain/repositories/MetadataRepository";
import { cache } from "../utils/cache";
import { getD2APiFromUrl } from "./utils/d2-api";

export class MetadataD2ApiRepository implements MetadataRepository {
    private api: D2Api;

    constructor(baseUrl: string) {
        this.api = getD2APiFromUrl(baseUrl);
    }

    @cache()
    public async lookup(type: MetadataType, query: string): Promise<Metadata | undefined> {
        const { objects: exact } = await this.api.models[type]
            //@ts-ignore D2-api index bug
            .get({
                fields: { id: true, name: true },
                filter: { identifiable: { eq: query } },
                paging: false,
            })
            .getData();

        if (exact.length === 1) return exact[0];

        const { objects: similar } = await this.api.models[type]
            //@ts-ignore D2-api index bug
            .get({
                filter: { identifiable: { token: query } },
                paging: false,
            })
            .getData();

        return similar[0];
    }
}
