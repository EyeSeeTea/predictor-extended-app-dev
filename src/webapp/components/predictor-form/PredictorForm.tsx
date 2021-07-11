import {
    composeValidators,
    createMinNumber,
    createPattern,
    FieldState,
    hasValue,
    InputFieldFF,
    integer,
    SingleSelectFieldFF,
} from "@dhis2/ui";
import _ from "lodash";
import React from "react";
import { ExpressionValidation } from "../../../domain/repositories/PredictorRepository";
import i18n from "../../../locales";
import { fullUidRegex } from "../../../utils/uid";
import { useAppContext } from "../../contexts/app-context";
import { FormField } from "../form/fields/FormField";
import { NumberInputFF } from "../form/fields/NumberInputFF";
import { PreviewInputFF } from "../form/fields/PreviewInputFF";
import { hasItems } from "../form/validators/hasItems";
import { ExpressionBoxFF } from "./components/ExpressionBoxFF";
import { OrgUnitLevelsFF } from "./components/OrgUnitLevelsFF";
import { PredictorGroupsFF } from "./components/PredictorGroupsFF";

const useValidations = (
    field: PredictorFormField,
    name: string
): { validation?: (...args: any[]) => any; props?: object } => {
    const { compositionRoot } = useAppContext();

    const [expressionValidation, setExpressionValidation] = React.useState<Record<string, ExpressionValidation>>({});

    const validateExpression = (formula: string, _allValues: object, meta?: FieldState<string>) => {
        if (!meta || !formula || !formula.trim()) return undefined;
        const type = field === "generator.expression" ? "predictor-formula" : "predictor-skip-test";

        return new Promise(resolve => {
            compositionRoot.usecases.validateExpression(type, formula).run(
                validation => {
                    setExpressionValidation(validations => ({ ...validations, [meta.name]: validation }));
                    resolve(validation.status === "ERROR" ? validation.message : undefined);
                },
                error => resolve(error)
            );
        });
    };

    switch (field) {
        case "id":
            return { validation: createPattern(fullUidRegex, i18n.t("Please provide a valid identifier")) };
        case "organisationUnitLevels":
            return { validation: hasItems };
        case "sequentialSampleCount":
        case "annualSampleCount":
        case "sequentialSkipCount":
            return { validation: composeValidators(integer, createMinNumber(0)) };
        case "generator.expression":
        case "sampleSkipTest.expression":
            return { validation: validateExpression, props: { expressionValidation: expressionValidation[name] } };
        default: {
            const required = predictorRequiredFields.includes(field);
            return { validation: required ? hasValue : undefined };
        }
    }
};

export const RenderPredictorWizardField: React.FC<{ row: number; field: PredictorFormField }> = ({ row, field }) => {
    const name = `predictors[${row}.${field}]`;
    const { validation, props: validationProps = {} } = useValidations(field, name);

    const props = {
        name,
        placeholder: getPredictorFieldName(field),
        validate: validation,
        ...validationProps,
    };

    switch (field) {
        case "id":
        case "code":
        case "description":
        case "name":
        case "generator.description":
        case "sampleSkipTest.description":
            return <FormField {...props} component={InputFieldFF} />;
        case "periodType":
            return <FormField {...props} component={SingleSelectFieldFF} options={periodTypes} />;
        case "organisationUnitLevels":
            return <FormField {...props} component={OrgUnitLevelsFF} />;
        case "predictorGroups":
            return <FormField {...props} component={PredictorGroupsFF} />;
        case "generator.missingValueStrategy":
            return <FormField {...props} component={SingleSelectFieldFF} options={missingValueStrategy} />;
        case "sequentialSampleCount":
        case "annualSampleCount":
        case "sequentialSkipCount":
            return <FormField {...props} component={NumberInputFF} defaultValue="0" min="0" />;
        case "generator.expression":
        case "sampleSkipTest.expression":
            return <FormField {...props} component={ExpressionBoxFF} expressionType="predictor" />;
        default:
            return null;
    }
};

export const RenderPredictorImportField: React.FC<{ row: number; field: PredictorFormField }> = ({ row, field }) => {
    const name = `predictors[${row}.${field}]`;
    const { validation, props: validationProps = {} } = useValidations(field, name);

    const props = {
        name,
        placeholder: getPredictorFieldName(field),
        validate: validation,
        ...validationProps,
    };

    switch (field) {
        case "organisationUnitLevels":
        case "predictorGroups":
        case "generator.expression":
        case "sampleSkipTest.expression":
            return (
                <PreviewInputFF {...props}>
                    <RenderPredictorWizardField row={row} field={field} />
                </PreviewInputFF>
            );
        default:
            return <RenderPredictorWizardField row={row} field={field} />;
    }
};

export type PredictorFormField = typeof predictorFormFields[number];

export const predictorFormFields = [
    "id",
    "code",
    "name",
    "description",
    "output",
    "outputCombo",
    "periodType",
    "annualSampleCount",
    "sequentialSampleCount",
    "organisationUnitLevels",
    "predictorGroups",
    "sequentialSkipCount",
    "generator.description",
    "generator.expression",
    "generator.missingValueStrategy",
    "sampleSkipTest.description",
    "sampleSkipTest.expression",
];

const predictorRequiredFields: PredictorFormField[] = [
    "name",
    "generator.description",
    "generator.expression",
    "organisationUnitLevels",
];

const getPredictorFieldBaseName = (field: PredictorFormField) => {
    switch (field) {
        case "id":
            return i18n.t("Identifier");
        case "code":
            return i18n.t("Code");
        case "name":
            return i18n.t("Name");
        case "description":
            return i18n.t("Description");
        case "output":
            return i18n.t("Output data element");
        case "outputCombo":
            return i18n.t("Output category combo");
        case "periodType":
            return i18n.t("Period type");
        case "annualSampleCount":
            return i18n.t("Annual sample count");
        case "sequentialSampleCount":
            return i18n.t("Sequential sample count");
        case "sequentialSkipCount":
            return i18n.t("Sequential skip count");
        case "organisationUnitLevels":
            return i18n.t("Organisation unit levels");
        case "predictorGroups":
            return i18n.t("Predictor groups");
        case "generator.description":
            return i18n.t("Generator description");
        case "generator.missingValueStrategy":
            return i18n.t("Missing value strategy");
        case "generator.expression":
            return i18n.t("Generator formula");
        case "sampleSkipTest.description":
            return i18n.t("Sample skip test description");
        case "sampleSkipTest.expression":
            return i18n.t("Sample skip test formula");
    }
};

export const getPredictorFieldName = (field: PredictorFormField) => {
    const name = getPredictorFieldBaseName(field);
    const required = predictorRequiredFields.includes(field);
    return _.compact([name, required ? "(*)" : undefined]).join(" ");
};

const periodTypes = [
    { value: "Daily", label: "Daily" },
    { value: "Weekly", label: "Weekly" },
    { value: "WeeklyWednesday", label: "Weekly starting Wednesday" },
    { value: "WeeklyThursday", label: "Weekly starting Thursday" },
    { value: "WeeklySaturday", label: "Weekly starting Saturday" },
    { value: "WeeklySunday", label: "Weekly starting Sunday" },
    { value: "BiWeekly", label: "Biweekly" },
    { value: "Monthly", label: "Monthly" },
    { value: "BiMonthly", label: "Bi-monthly" },
    { value: "Quarterly", label: "Quarterly" },
    { value: "SixMonthly", label: "Six-monthly" },
    { value: "SixMonthlyApril", label: "Six-monthly starting April" },
    { value: "SixMonthlyNov", label: "Six-monthly starting November" },
    { value: "Yearly", label: "Yearly" },
    { value: "FinancialApril", label: "Financial year starting April" },
    { value: "FinancialJuly", label: "Financial year starting July" },
    { value: "FinancialOct", label: "Financial year starting October" },
    { value: "FinancialNov", label: "Financial year starting November" },
];

const missingValueStrategy = [
    { value: "SKIP_IF_ANY_VALUE_MISSING", label: i18n.t("Skip if any value is missing") },
    { value: "SKIP_IF_ALL_VALUES_MISSING", label: i18n.t("Skip if all values are missing") },
    { value: "NEVER_SKIP", label: i18n.t("Never skip") },
];
