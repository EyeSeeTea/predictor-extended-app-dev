import _ from "lodash";
import { Future, FutureData } from "../domain/entities/Future";
import { Metadata, MetadataPackage, MetadataType } from "../domain/entities/Metadata";
import { MetadataRepository } from "../domain/repositories/MetadataRepository";
import { D2Api } from "../types/d2-api";
import { cache } from "../utils/cache";
import { getD2APiFromUrl, getFieldsAsString, getFilterAsString } from "./utils/d2-api";
import { toFuture } from "./utils/futures";

export class MetadataD2ApiRepository implements MetadataRepository {
    private api: D2Api;

    constructor(baseUrl: string) {
        this.api = getD2APiFromUrl(baseUrl);
    }

    public list(types: MetadataType[]): FutureData<MetadataPackage> {
        const params = _.zipObject(
            types,
            types.map(() => ({ fields: { id: true, name: true, code: true } }))
        );

        return toFuture(this.api.metadata.get(params));
    }

    @cache()
    public async search(type: MetadataType, query: string): Promise<Metadata | undefined> {
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

    public lookup(queries: string[]): FutureData<MetadataPackage> {
        const metadataByCode = toFuture(
            this.api.get<MetadataPackage>("/metadata", {
                fields: getFieldsAsString({ id: true, name: true }),
                filter: getFilterAsString({ code: { in: queries } }),
                paging: false,
            })
        );

        const metadataByName = toFuture(
            this.api.get<MetadataPackage>("/metadata", {
                fields: getFieldsAsString({ id: true, name: true }),
                filter: getFilterAsString({ name: { in: queries } }),
                paging: false,
            })
        );

        return Future.joinObj({ metadataByCode, metadataByName }).map(({ metadataByCode, metadataByName }) => {
            const candidates = [metadataByCode, metadataByName];

            const listItems = (key: MetadataType) =>
                _(candidates)
                    .flatMap(item => item[key])
                    .compact()
                    .uniqBy(item => item.id)
                    .value();

            return _(candidates)
                .flatMap(item => _.keys(item))
                .filter(key => key !== "system")
                .compact()
                .uniq()
                .map((key: MetadataType) => [key, listItems(key)])
                .fromPairs()
                .value() as MetadataPackage;
        });
    }
}
