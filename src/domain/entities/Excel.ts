export interface Address {
    row: number;
    column: number;
}

export interface CellRef {
    type: "cell";
    sheet: string;
    address: Address;
}

export interface RangeRef {
    type: "range";
    sheet: string;
    start: Address;
    end: Address;
}

export interface RowRef {
    type: "row";
    sheet: string;
    row: number;
}

export interface ColumnRef {
    type: "column";
    sheet: string;
    column: number;
}

export interface CellTextContent {
    type: "text";
    value: string | number | boolean;
}

export interface CellFormulaContent {
    type: "formula";
    value: string;
}

export type CellContents = CellTextContent | CellFormulaContent;

export interface ExcelCell {
    ref: CellRef | RangeRef;
    contents: CellContents;
}

export interface ExcelSheet {
    data: ExcelCell[];
}

export interface ExcelModel {
    sheets: Record<string, ExcelSheet>;
    definedNames: Record<string, ExcelCell>;
}
