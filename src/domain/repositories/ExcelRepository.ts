import { ExcelModel } from "../entities/Excel";

export interface ExcelRepository {
    createFile(): Promise<Buffer>;
    readFile(buffer: Buffer, options?: ReadOptions): Promise<ExcelModel>;
    writeFile(input: Buffer, file: ExcelModel, options?: WriteOptions): Promise<Buffer>;
}

export interface ReadOptions {}
export interface WriteOptions {}
