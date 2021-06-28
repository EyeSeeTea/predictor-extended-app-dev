import { UseCase } from "../../compositionRoot";
import { Metadata } from "../entities/Metadata";
import { MetadataRepository } from "../repositories/MetadataRepository";

export class GetExpressionSuggestionsUseCase implements UseCase {
    constructor(private metadataRepository: MetadataRepository) {}

    public async execute(): Promise<Metadata[]> {
        const metadata = await this.metadataRepository.list(["dataElements"]);

        return metadata.dataElements ?? [];
    }
}
