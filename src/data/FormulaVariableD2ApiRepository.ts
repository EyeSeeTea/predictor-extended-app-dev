import _ from "lodash";
import { FormulaVariable } from "../domain/entities/FormulaVariable";
import { FutureData } from "../domain/entities/Future";
import { FormulaVariableRepository } from "../domain/repositories/FormulaVariableRepository";
import i18n from "../locales";
import { D2Api } from "../types/d2-api";
import { getD2APiFromUrl } from "./utils/d2-api";
import { toFuture } from "./utils/futures";

export class FormulaVariableD2ApiRepository implements FormulaVariableRepository {
    private api: D2Api;

    constructor(baseUrl: string) {
        this.api = getD2APiFromUrl(baseUrl);
    }

    public get(): FutureData<FormulaVariable[]> {
        return toFuture(
            this.api.metadata.get({
                dataElements: {
                    fields: {
                        ...baseFields,
                        aggregationType: true,
                        domainType: true,
                        valueType: true,
                        zeroIsSignificant: true,
                        categoryCombo: {
                            name: true,
                            categoryOptionCombos: { id: true, name: true, description: true },
                        },
                    },
                },
            })
        ).map(({ dataElements = [] }) => {
            const dataElementVariables = dataElements.map(({ id, name, description, categoryCombo, ...rest }) => ({
                id,
                label: name,
                filterText: name,
                insertText: id,
                description,
                autocomplete: true,
                type: i18n.t("Data element"),
                options: categoryCombo.categoryOptionCombos.map(({ id, name, description }) => ({
                    id,
                    label: name,
                    filterText: name,
                    insertText: id,
                    description,
                    autocomplete: false,
                    type: i18n.t("Category option combo"),
                })),
                properties: _(rest)
                    .mapValues((value, key) => ({
                        property: key,
                        label: buildLabel(key),
                        value: buildValue(value),
                    }))
                    .values()
                    .value(),
            }));

            return [...dataElementVariables, ..._.flatMap(dataElementVariables, "options")];
        });
    }
}

const baseFields = { id: true, name: true, code: true, description: true };

function buildLabel(key: string): string {
    switch (key) {
        case "aggregationType":
            return i18n.t("Aggregation Type");
        case "aggregationLevels":
            return i18n.t("Aggregation Levels");
        case "domainType":
            return i18n.t("Domain Type");
        case "valueType":
            return i18n.t("Value Type");
        case "zeroIsSignificant":
            return i18n.t("Zero Is Significant");
        case "categoryCombo":
            return i18n.t("Category Combo");
        case "code":
            return i18n.t("Code");
        default:
            return key;
    }
}

function buildValue(value: unknown): string {
    if (Array.isArray(value)) return value.map(item => buildValue(item)).join(", ");
    if (value === true) return "Yes";
    if (value === false) return "No";
    if (_.has(value, "name")) return (value as any).name;
    if (_.has(value, "id")) return (value as any).id;
    if (typeof value === "string") return _.trim(value);
    return "";
}
