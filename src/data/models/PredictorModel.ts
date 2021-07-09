import { Formula, PeriodType, Predictor } from "../../domain/entities/Predictor";
import { Codec, Schema } from "../utils/codec";
import { NamedRefModel } from "./DHIS2Model";

export const FormulaModel: Codec<Formula> = Schema.object({
    expression: Schema.string,
    description: Schema.string,
    slidingWindow: Schema.optionalSafe(Schema.boolean, false),
    missingValueStrategy: Schema.oneOf([
        Schema.exact("NEVER_SKIP"),
        Schema.exact("SKIP_IF_ANY_VALUE_MISSING"),
        Schema.exact("SKIP_IF_ALL_VALUES_MISSING"),
    ]),
});

export const PeriodTypeModel: Codec<PeriodType> = Schema.oneOf([
    Schema.exact("Daily"),
    Schema.exact("Weekly"),
    Schema.exact("WeeklyWednesday"),
    Schema.exact("WeeklyThursday"),
    Schema.exact("WeeklySaturday"),
    Schema.exact("WeeklySunday"),
    Schema.exact("BiWeekly"),
    Schema.exact("Monthly"),
    Schema.exact("BiMonthly"),
    Schema.exact("Quarterly"),
    Schema.exact("SixMonthly"),
    Schema.exact("SixMonthlyApril"),
    Schema.exact("SixMonthlyNov"),
    Schema.exact("Yearly"),
    Schema.exact("FinancialApril"),
    Schema.exact("FinancialJuly"),
    Schema.exact("FinancialOct"),
    Schema.exact("FinancialNov"),
]);

export const PredictorModel: Codec<Predictor> = Schema.object({
    id: Schema.string,
    code: Schema.optional(Schema.string),
    name: Schema.string,
    description: Schema.optional(Schema.string),
    output: NamedRefModel,
    outputCombo: Schema.optional(NamedRefModel),
    periodType: PeriodTypeModel,
    organisationUnitLevels: Schema.optionalSafe(Schema.array(NamedRefModel), []),
    generator: FormulaModel,
    sampleSkipTest: Schema.optional(FormulaModel),
    sequentialSampleCount: Schema.number,
    annualSampleCount: Schema.number,
    sequentialSkipCount: Schema.optional(Schema.number),
    predictorGroups: Schema.optionalSafe(Schema.array(NamedRefModel), []),
    lastUpdated: Schema.string,
    lastUpdatedBy: NamedRefModel,
    created: Schema.string,
    user: NamedRefModel,
});
