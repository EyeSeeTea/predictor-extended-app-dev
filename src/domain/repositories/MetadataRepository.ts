import { Pager } from "../../types/d2-api";
import { FutureData } from "../entities/Future";
import { Metadata, MetadataPackage, MetadataType } from "../entities/Metadata";

export interface MetadataRepository {
    list(
        type: MetadataType,
        options: { pageSize?: number; page?: number },
        fieldOptions: {}
    ): FutureData<{ pager: Pager; objects: Metadata[] }>;
    listAll(types: MetadataType[]): FutureData<MetadataPackage>;
    search(type: MetadataType, query: string): Promise<Metadata | undefined>;
    lookup(queries: string[]): FutureData<MetadataPackage>;
}
