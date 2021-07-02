import { FutureData } from "../entities/Future";
import { Metadata, MetadataPackage, MetadataType } from "../entities/Metadata";

export interface MetadataRepository {
    list(types: MetadataType[]): FutureData<MetadataPackage>;
    search(type: MetadataType, query: string): Promise<Metadata | undefined>;
    lookup(queries: string[]): FutureData<MetadataPackage>;
}
