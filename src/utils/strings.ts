import _ from "lodash";

export const RegularExpression = {
    // Match group between brackets {template}
    BRACKET: /\{([^{].*?)\}/g,
    // Match group for words
    WORD: /\w+/g,
};

export function interpolate(string: string, dictionary: Record<string, unknown>, regex = RegularExpression.BRACKET): string {
    return string.replace(regex, (_, key) => toString(dictionary[key]) ?? key);
}

export function getTemplates(string: string, regex = RegularExpression.BRACKET): string[] {
    const match = string.matchAll(regex);
    return _.compact(Array.from(match).map(item => item[1]));
}

function toString(value: unknown): string {
    if (Array.isArray(value)) return value.map(toString).join(", ");
    return String(value);
}
