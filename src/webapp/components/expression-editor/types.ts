import { editor, languages } from "monaco-editor";

export type Suggestion = Omit<languages.CompletionItem, "range">;
export type ValidationMarker = Omit<editor.IMarkerData, "relatedInformation">;

export interface Variable {
    id: string;
    name: string;
    code?: string;
    description?: string;
    label?: string;
}
