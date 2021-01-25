import { UseCase } from "../../compositionRoot";
import { ExcelRepository } from "../repositories/ExcelRepository";
import { PredictorRepository } from "../repositories/PredictorRepository";

export class ImportPredictorsUseCase implements UseCase {
    constructor(
        private predictorRepository: PredictorRepository,
        private excelRepository: ExcelRepository
    ) {}

    public async execute(files: File[]) {
        console.log(files, this.predictorRepository, this.excelRepository);
    }
}
