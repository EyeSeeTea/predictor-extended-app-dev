import { UseCase } from "../../compositionRoot";
import { Pager } from "../../types/d2-api";
import { FutureData } from "../entities/Future";
import { Metadata, MetadataType } from "../entities/Metadata";
import { MetadataRepository } from "../repositories/MetadataRepository";

export class ListMetadataUseCase implements UseCase {
    constructor(private metadataRepository: MetadataRepository) {}

    public execute(
        type: MetadataType,
        options: { pageSize?: number; page?: number } = {},
        fieldOptions: {} = {}
    ): FutureData<{ pager: Pager; objects: Metadata[] }> {
        return this.metadataRepository.list(type, options, fieldOptions);
    }
}
