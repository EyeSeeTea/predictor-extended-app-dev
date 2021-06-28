import { languages, editor, Position, CancellationToken, MarkerSeverity } from "monaco-editor";
import { PredictorSuggestions } from "../suggestions/predictors";
import { ValidationMarker, Variable } from "../types";

export interface CompletionProviderOptions {
    variables?: Variable[];
    includeNameAndCodeSuggestions?: boolean;
    onValidate?: (expression: string) => Promise<ValidationMarker[] | undefined>;
}

export const buildPredictorsCompletionProvider = ({
    variables = [],
}: CompletionProviderOptions): languages.CompletionItemProvider => ({
    provideCompletionItems: async (
        model: editor.ITextModel,
        position: Position,
        _context: languages.CompletionContext,
        _token: CancellationToken
    ): Promise<languages.CompletionList | null | undefined> => {
        const item = model.getWordUntilPosition(position);

        const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: item.startColumn,
            endColumn: item.endColumn,
        };

        editor.setModelMarkers(model, "predictors", [
            {
                severity: MarkerSeverity.Error,
                startLineNumber: 1,
                startColumn: 2,
                endLineNumber: 1,
                endColumn: 5,
                message: "hi there",
            },
        ]);

        return {
            suggestions: [
                ...PredictorSuggestions.map(item => ({ ...item, range })),
                ...variables.map(({ name }) => ({
                    label: name,
                    kind: languages.CompletionItemKind.Constant,
                    insertText: name,
                    range,
                })),
                ...variables
                    .filter(item => item.code !== undefined)
                    .map(({ name, code = "" }) => ({
                        label: name,
                        filterText: code,
                        kind: languages.CompletionItemKind.Constant,
                        insertText: code,
                        range,
                    })),
            ],
        };
    },
});
