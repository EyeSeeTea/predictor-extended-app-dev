import _ from "lodash";

// Match group between brackets {template}
const bracketRegex = /\{([^{].*?)\}/g;

export function interpolate(string: string, dictionary: Record<string, unknown>, regex = bracketRegex): string {
    return string.replace(regex, (_, key) => toString(dictionary[key]) ?? key);
}

export function getTemplates(string: string, regex = bracketRegex): string[] {
    const match = string.matchAll(regex);
    return _.compact(Array.from(match).map(item => item[1]));
}

function toString(value: unknown): string {
    if (Array.isArray(value)) return value.map(toString).join(", ");
    return String(value);
}
