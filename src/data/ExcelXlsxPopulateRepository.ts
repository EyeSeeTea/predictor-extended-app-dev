import XLSX from "xlsx-populate";
import { ExcelFile } from "../domain/entities/ExcelFile";
import { ExcelRepository } from "../domain/repositories/ExcelRepository";

export class ExcelXlsxPopulateRepository implements ExcelRepository {
    public async createFile(): Promise<Buffer> {
        const file = await XLSX.fromBlankAsync();
        const buffer = (file.outputAsync() as unknown) as Buffer;
        return buffer;
    }

    public async readFile(): Promise<ExcelFile> {
        return { sheets: {}, definedNames: {} };
    }
}
