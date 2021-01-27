import { Metadata, MetadataType } from "../entities/Metadata";

export interface MetadataRepository {
    lookup(type: MetadataType, query: string): Promise<Metadata | undefined>;
}
