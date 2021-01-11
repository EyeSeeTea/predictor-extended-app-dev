import { UseCase } from "../../../compositionRoot";
import { ExcelRepository } from "../../repositories/ExcelRepository";

export class ExportExcelUseCase implements UseCase {
    constructor(private excelRepository: ExcelRepository) {}

    public execute() {
        console.log(this.excelRepository);
    }
}
