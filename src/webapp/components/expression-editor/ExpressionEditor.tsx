import Editor, { useMonaco } from "@monaco-editor/react";
import React, { useEffect } from "react";
import { buildPredictorsCompletionProvider } from "./completion/predictors";
import { PredictorsLanguageConfiguration } from "./language/predictors";
import { ValidationMarker, Variable } from "./types";

export const ExpressionEditor: React.FC<ExpressionEditorProps> = ({
    className,
    variables,
    onValidate,
    includeNameAndCodeSuggestions,
}) => {
    const monaco = useMonaco();

    useEffect(() => {
        if (!monaco) return;

        monaco.languages.register({ id: "dhis" });
        monaco.languages.setLanguageConfiguration("dhis", PredictorsLanguageConfiguration);
        monaco.languages.registerCompletionItemProvider(
            "dhis",
            buildPredictorsCompletionProvider({ variables, onValidate, includeNameAndCodeSuggestions })
        );
    }, [monaco, variables, onValidate, includeNameAndCodeSuggestions]);

    return (
        <Editor
            className={className}
            height="15vh"
            defaultLanguage="dhis"
            options={{
                minimap: { enabled: false },
                lineNumbers: "off",
                renderLineHighlight: "none",
                scrollbar: { useShadows: false, vertical: "hidden" },
                suggest: { snippetsPreventQuickSuggestions: false },
            }}
        />
    );
};

export interface ExpressionEditorProps {
    className?: string;
    type: "predictor-generator" | "predictor-sample-skip";
    variables?: Variable[];
    includeNameAndCodeSuggestions?: boolean;
    onValidate?: (expression: string) => Promise<ValidationMarker[] | undefined>;
}
