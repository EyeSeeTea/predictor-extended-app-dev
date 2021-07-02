import { UseCase } from "../../compositionRoot";
import { FutureData } from "../entities/Future";
import { Metadata } from "../entities/Metadata";
import { MetadataRepository } from "../repositories/MetadataRepository";

export class GetExpressionSuggestionsUseCase implements UseCase {
    constructor(private metadataRepository: MetadataRepository) {}

    public execute(): FutureData<Metadata[]> {
        return this.metadataRepository.list(["dataElements"]).map(({ dataElements }) => dataElements ?? []);
    }
}
