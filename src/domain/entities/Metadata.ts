import { D2ModelSchemas } from "../../types/d2-api";

export type MetadataType = keyof D2ModelSchemas;

export type MetadataPackage = Record<MetadataType, Metadata[]>;

export type Metadata = { id: string; name: string; code?: string };

export type { MetadataResponse, Stats as MetadataResponseStats } from "../../types/d2-api";
