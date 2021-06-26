import Editor, { useMonaco } from "@monaco-editor/react";
import React, { useEffect } from "react";
import { buildPredictorsCompletionProvider } from "./completion/predictors";
import { PredictorsLanguageConfiguration } from "./language/predictors";
import { ValidationMarker, Variable } from "./types";

export const ExpressionEditor: React.FC<ExpressionEditorProps> = () => {
    const monaco = useMonaco();

    useEffect(() => {
        if (!monaco) return;

        monaco.languages.register({ id: "dhis" });
        monaco.languages.registerCompletionItemProvider("dhis", buildPredictorsCompletionProvider());
        monaco.languages.setLanguageConfiguration("dhis", PredictorsLanguageConfiguration);
    }, [monaco]);

    return <Editor height="90vh" defaultLanguage="dhis" />;
};

export interface ExpressionEditorProps {
    type: "predictor-generator" | "predictor-sample-skip";
    variables?: Variable[];
    includeNameAndCodeSuggestions?: boolean;
    onValidate?: (expression: string) => Promise<ValidationMarker[]>;
}
