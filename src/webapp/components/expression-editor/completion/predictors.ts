import { languages, editor, Position, CancellationToken, MarkerSeverity } from "monaco-editor";
import { PredictorSuggestions } from "../suggestions/predictors";

export const buildPredictorsCompletionProvider = (): languages.CompletionItemProvider => ({
    provideCompletionItems: async (
        model: editor.ITextModel,
        position: Position,
        context: languages.CompletionContext,
        token: CancellationToken
    ): Promise<languages.CompletionList | null | undefined> => {
        console.log({ model, position, context, token });

        const item = model.getWordUntilPosition(position);
        const { dataElements = [] } = {};

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
                ...dataElements.map(({ name }) => ({
                    label: name,
                    kind: languages.CompletionItemKind.Constant,
                    insertText: name,
                    range,
                })),
            ],
        };
    },
});
