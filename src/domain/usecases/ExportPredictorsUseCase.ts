import { UseCase } from "../../compositionRoot";
import { ExcelRepository } from "../repositories/ExcelRepository";
import { PredictorRepository } from "../repositories/PredictorRepository";

export class ExportPredictorsUseCase implements UseCase {
    constructor(
        private predictorRepository: PredictorRepository,
        private excelRepository: ExcelRepository
    ) {}

    public async execute(ids: string[]) {
        const buffer = await this.excelRepository.createFile();

        const predictors = await this.predictorRepository.get(ids);
        console.log({ predictors, buffer });
    }
}
