import {
    array,
    boolean,
    Codec,
    exactly,
    GetType,
    number,
    oneOf,
    optional,
    string,
} from "purify-ts";

const Ref = Codec.interface({
    id: string,
    name: optional(string),
});

const PeriodType = oneOf([
    exactly("Daily"),
    exactly("Weekly"),
    exactly("WeeklyWednesday"),
    exactly("WeeklyThursday"),
    exactly("WeeklySaturday"),
    exactly("WeeklySunday"),
    exactly("BiWeekly"),
    exactly("Monthly"),
    exactly("BiMonthly"),
    exactly("Quarterly"),
    exactly("SixMonthly"),
    exactly("SixMonthlyApril"),
    exactly("SixMonthlyNov"),
    exactly("Yearly"),
    exactly("FinancialApril"),
    exactly("FinancialJuly"),
    exactly("FinancialOct"),
    exactly("FinancialNov"),
]);

export const FormulaModel = Codec.interface({
    expression: string,
    description: optional(string),
    slidingWindow: optional(boolean),
    missingValueStrategy: optional(
        oneOf([
            exactly("NEVER_SKIP"),
            exactly("SKIP_IF_ANY_VALUE_MISSING"),
            exactly("SKIP_IF_ALL_VALUES_MISSING"),
        ])
    ),
});

const SharingSetting = Codec.interface({
    access: string,
    displayName: optional(string),
    id: optional(string),
});

export const PredictorModel = Codec.interface({
    id: string,
    code: optional(string),
    name: string,
    description: optional(string),
    output: Ref,
    outputCombo: optional(Ref),
    periodType: PeriodType,
    organisationUnitLevels: optional(array(Ref)),
    generator: FormulaModel,
    sampleSkipTest: optional(FormulaModel),
    sequentialSampleCount: number,
    annualSampleCount: number,
    sequentialSkipCount: number,
    predictorGroups: optional(array(Ref)),
    lastUpdated: optional(string),
    lastUpdatedBy: optional(Ref),
    created: optional(string),
    user: optional(Ref),
    publicAccess: optional(string),
    userAccesses: optional(array(SharingSetting)),
    userGroupAccesses: optional(array(SharingSetting)),
});

export const predictorColumns: Array<keyof Predictor> = [
    "id",
    "code",
    "name",
    "description",
    "output",
    "outputCombo",
    "periodType",
    "annualSampleCount",
    "generator",
    "organisationUnitLevels",
    "predictorGroups",
    "sampleSkipTest",
    "sequentialSampleCount",
    "sequentialSkipCount",
    "created",
    "lastUpdated",
];

export type Formula = GetType<typeof FormulaModel>;
export type Predictor = GetType<typeof PredictorModel>;
