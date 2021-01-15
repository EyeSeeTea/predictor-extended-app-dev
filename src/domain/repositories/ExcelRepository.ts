import { ExcelFile } from "../entities/ExcelFile";

export interface ExcelRepository {
    createFile(): Promise<Buffer>;
    readFile(buffer: Buffer): Promise<ExcelFile>;
}
