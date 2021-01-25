import { UseCase } from "../../compositionRoot";
import { ExcelRepository } from "../repositories/ExcelRepository";
import { PredictorRepository } from "../repositories/PredictorRepository";

export class ImportPredictorsUseCase implements UseCase {
    constructor(
        private predictorRepository: PredictorRepository,
        private excelRepository: ExcelRepository
    ) {}

    public async execute() {
        console.log(this.predictorRepository, this.excelRepository);
    }
}
