import { CancellationToken, editor, IRange, languages, Position } from "monaco-editor";
import { FormulaVariable } from "../../../../domain/entities/FormulaVariable";
import { PredictorSuggestions } from "../suggestions/predictors";
import { ValidationMarker } from "../types";

export interface CompletionProviderOptions {
    variables?: FormulaVariable[];
    includeNameAndCodeSuggestions?: boolean;
    onValidate?: (expression: string) => Promise<ValidationMarker[] | undefined>;
}

export const buildPredictorsCompletionProvider = ({
    variables = [],
}: CompletionProviderOptions): languages.CompletionItemProvider => ({
    triggerCharacters: ["."],
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

        const prevWord = model.getWordAtPosition({ ...position, column: item.startColumn - 1 });
        const prevWordVariable = variables.find(v => v.id === prevWord?.word);
        if (prevWordVariable) {
            return { suggestions: prevWordVariable.options?.map(variable => formatVariable(range, variable)) ?? [] };
        } else if (model.getValue().endsWith(".")) {
            return { suggestions: [] };
        }

        return {
            suggestions: [
                ...PredictorSuggestions.map(item => ({ ...item, range })),
                ...variables
                    .filter(({ autocomplete }) => autocomplete)
                    .map(variable => formatVariable(range, variable)),
            ],
        };
    },
});

function formatVariable(range: IRange, { filterText, insertText, label }: FormulaVariable): languages.CompletionItem {
    return {
        label,
        filterText,
        kind: languages.CompletionItemKind.Constant,
        insertText,
        range,
    };
}
