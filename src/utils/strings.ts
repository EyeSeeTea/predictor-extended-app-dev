import _ from "lodash";

export const RegularExpression = {
    // Match group between brackets {template}
    BRACKET: /\{([^{].*?)\}/g,
};

export function interpolate(string: string, dictionary: Record<string, unknown>): string {
    return string.replace(RegularExpression.BRACKET, (_, key) => toBrackedString(dictionary[key] ?? key));
}

export function getTemplates(string: string): string[] {
    const match = string.matchAll(RegularExpression.BRACKET);
    return _.compact(Array.from(match).map(item => item[1]));
}

function toBrackedString(value: unknown): string {
    if (Array.isArray(value)) return value.map(toBrackedString).join(", ");
    return `{${value}}`;
}
