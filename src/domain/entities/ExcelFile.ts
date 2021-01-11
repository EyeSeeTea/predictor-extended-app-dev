export interface ExcelCell {
    value: string;
    formula: string;
}

export interface ExcelFile {
    data: ExcelCell[][];
}
