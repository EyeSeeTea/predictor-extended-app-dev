import { NamedRef, SharingSetting } from "./DHIS2";

export type PeriodType =
    | "Daily"
    | "Weekly"
    | "WeeklyWednesday"
    | "WeeklyThursday"
    | "WeeklySaturday"
    | "WeeklySunday"
    | "BiWeekly"
    | "Monthly"
    | "BiMonthly"
    | "Quarterly"
    | "SixMonthly"
    | "SixMonthlyApril"
    | "SixMonthlyNov"
    | "Yearly"
    | "FinancialApril"
    | "FinancialJuly"
    | "FinancialOct"
    | "FinancialNov";

export type FormulaMissingValueStrategy = "NEVER_SKIP" | "SKIP_IF_ANY_VALUE_MISSING" | "SKIP_IF_ALL_VALUES_MISSING";

export interface Formula {
    expression: string;
    description: string;
    slidingWindow: boolean;
    missingValueStrategy: FormulaMissingValueStrategy;
}

export interface Predictor {
    id: string;
    code?: string | undefined;
    name: string;
    description?: string | undefined;
    output: NamedRef;
    outputCombo?: NamedRef | undefined;
    periodType: PeriodType;
    organisationUnitLevels: NamedRef[];
    generator: Formula;
    sampleSkipTest?: Formula | undefined;
    sequentialSampleCount: number;
    annualSampleCount: number;
    sequentialSkipCount?: number | undefined;
    predictorGroups: NamedRef[];
    lastUpdated: string; // TODO: Convert to date
    lastUpdatedBy: NamedRef;
    created: string; // TODO: Convert to date
    user: NamedRef;
    publicAccess: string;
    userAccesses: SharingSetting[];
    userGroupAccesses: SharingSetting[];
}

export const defaultPredictor: Predictor = {
    id: "",
    name: "",
    output: { id: "", name: "" },
    periodType: "Daily",
    organisationUnitLevels: [],
    generator: { expression: "", description: "", slidingWindow: false, missingValueStrategy: "NEVER_SKIP" },
    sequentialSampleCount: 0,
    annualSampleCount: 0,
    predictorGroups: [],
    lastUpdated: "",
    lastUpdatedBy: { id: "", name: "" },
    created: "",
    user: { id: "", name: "" },
    publicAccess: "",
    userAccesses: [],
    userGroupAccesses: [],
};

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
