import { Metadata, MetadataPackage, MetadataType } from "../entities/Metadata";

export interface MetadataRepository {
    list(types: MetadataType[]): Promise<MetadataPackage>;
    search(type: MetadataType, query: string): Promise<Metadata | undefined>;
    lookup(queries: string[]): Promise<MetadataPackage>;
}
