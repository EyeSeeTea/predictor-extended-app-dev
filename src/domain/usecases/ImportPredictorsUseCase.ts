import { UseCase } from "../../compositionRoot";
import { ExcelRepository } from "../repositories/ExcelRepository";
import { PredictorRepository } from "../repositories/PredictorRepository";

export class ImportPredictorsUseCase implements UseCase {
    constructor(
        private predictorRepository: PredictorRepository,
        private excelRepository: ExcelRepository
    ) {}

    public async execute(files: File[]) {
        for (const file of files) {
            const buffer = await file.arrayBuffer();
            const excelFile = await this.excelRepository.readFile(buffer);
            console.log({ file, excelFile, predictors: this.predictorRepository });
        }
    }
}
