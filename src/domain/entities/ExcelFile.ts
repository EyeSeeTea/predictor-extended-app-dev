export interface CellRef {
    type: "cell";
    cell: string;
}

export interface RangeRef {
    type: "range";
    start: string;
    end: string;
}

export interface ExcelCell {
    ref: CellRef | RangeRef;
    value: string;
    formula: string;
}

export interface ExcelSheet {
    data: ExcelCell[];
}

export interface ExcelFile {
    sheets: Record<string, ExcelSheet>;
    definedNames: Record<string, unknown>;
}
