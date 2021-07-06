import { languages } from "monaco-editor";
import { Suggestion } from "../types";

export const PredictorSuggestions: Suggestion[] = [
    {
        label: {
            name: "[days]",
            qualifier: "Keyword",
        },
        kind: languages.CompletionItemKind.Keyword,
        insertText: "[days]",
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        detail: "The number of days in the current period.",
    },
    {
        label: {
            name: "if(",
            parameters: "test, valueIfTrue, valueIfFalse)",
            qualifier: "Function",
        },
        kind: languages.CompletionItemKind.Function,
        insertText: "if(${1:test}, ${2:valueIfTrue}, ${3:valueIfFalse})",
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        detail: "Evaluates test which is an expression that evaluates to a boolean value. If the test is true, returns the valueIfTrue expression. If it is false, returns the valueIfFalse expression.",
    },
    {
        label: {
            name: "isNull(",
            parameters: "item)",
            qualifier: "Function",
        },
        kind: languages.CompletionItemKind.Function,
        insertText: "isNull(${1:item})",
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        detail: "Returns the boolean value true if the item is null (missing), otherwise returns false. The item can be any selected item from the right (data element, program data element, etc.).",
    },
    {
        label: {
            name: "isNotNull(",
            parameters: "item)",
            qualifier: "Function",
        },
        kind: languages.CompletionItemKind.Function,
        insertText: "isNotNull(${1:item})",
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        detail: "Returns true if the item value is not missing (not null), otherwise false.",
    },
    {
        label: {
            name: "firstNonNull(",
            parameters: "item1, item2 [, ...])",
            qualifier: "Function",
        },
        kind: languages.CompletionItemKind.Function,
        insertText: "firstNonNull(${1:item1}, ${2:item2})",
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        detail: "Returns the value of the first item that is not missing (not null). Can be provided any number of arguments. Any argument may also be a numeric or string literal, which will be returned if all the previous items have missing values.",
    },
    {
        label: {
            name: "greatest(",
            parameters: "item1, item2 [, ...])",
            qualifier: "Function",
        },
        kind: languages.CompletionItemKind.Function,
        insertText: "greatest(${1:item1}, ${2:item2})",
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        detail: "Returns the greatest (highest) value of the expressions given. Can be provided any number of arguments.",
    },
    {
        label: {
            name: "least(",
            parameters: "item1, item2 [, ...])",
            qualifier: "Function",
        },
        kind: languages.CompletionItemKind.Function,
        insertText: "least(${1:item1}, ${2:item2})",
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        detail: "Returns the least (lowest) value of the expressions given. Can be provided any number of arguments.",
    },
    {
        label: {
            name: "avg(",
            parameters: "x)",
            qualifier: "Aggregation",
        },
        kind: languages.CompletionItemKind.Function,
        insertText: "avg(${1:x})",
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        detail: "Average (mean) value of x",
    },
    {
        label: {
            name: "count(",
            parameters: "x)",
            qualifier: "Aggregation",
        },
        kind: languages.CompletionItemKind.Function,
        insertText: "count(${1:x})",
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        detail: "Count of the values of x",
    },
    {
        label: {
            name: "max(",
            parameters: "x)",
            qualifier: "Aggregation",
        },
        kind: languages.CompletionItemKind.Function,
        insertText: "max(${1:x})",
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        detail: "Maximum value of x",
    },
    {
        label: {
            name: "median(",
            parameters: "x)",
            qualifier: "Aggregation",
        },
        kind: languages.CompletionItemKind.Function,
        insertText: "median(${1:x})",
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        detail: "Median value of x",
    },
    {
        label: {
            name: "min(",
            parameters: "x)",
            qualifier: "Aggregation",
        },
        kind: languages.CompletionItemKind.Function,
        insertText: "min(${1:x})",
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        detail: "Minimum value of x",
    },
    {
        label: {
            name: "percentileCont(",
            parameters: "p, x)",
            qualifier: "Aggregation",
        },
        kind: languages.CompletionItemKind.Function,
        insertText: "percentileCont(${1:p}, ${1:x})",
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        detail: "Continuous percentile of x, where p is the percentile as a floating point number between 0 and 1. For example, p = 0 will return the lowest value, p = 0.5 will return the median, p = 0.75 will return the 75th percentile, p = 1 will return the highest value, etc. Continuous means that the value will be interpolated if necessary. For example, percentileCont( 0.5, #{FTRrcoaog83} ) will return 2.5 if the sampled values of data element FTRrcoaog83 are 1, 2, 3, and 4.",
    },
    {
        label: {
            name: "stddev(",
            parameters: "x)",
            qualifier: "Aggregation",
        },
        kind: languages.CompletionItemKind.Function,
        insertText: "stddev(${1:x})",
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        detail: "Standard deviation of x. This function is eqivalent to stddevSamp. It's suggested that you use the function stddevSamp instead for greater clarity.",
    },
    {
        label: {
            name: "stddevPop(",
            parameters: "x)",
            qualifier: "Aggregation",
        },
        kind: languages.CompletionItemKind.Function,
        insertText: "stddevPop(${1:x})",
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        detail: "Population standard deviation of x: sqrt( sum( (x - avg(x))^2 ) / n )",
    },
    {
        label: {
            name: "stddevSamp(",
            parameters: "x)",
            qualifier: "Aggregation",
        },
        kind: languages.CompletionItemKind.Function,
        insertText: "stddevSamp(${1:x})",
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        detail: "Sample standard deviation of x: sqrt( sum( (x - avg(x))^2 ) / ( n - 1 ) ). Note that this value is not computed when there is only one sample.",
    },
    {
        label: {
            name: "sum(",
            parameters: "x)",
            qualifier: "Aggregation",
        },
        kind: languages.CompletionItemKind.Function,
        insertText: "sum(${1:x})",
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        detail: "Sum of the values of x",
    },
];