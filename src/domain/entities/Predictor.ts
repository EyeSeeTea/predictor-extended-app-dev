import { NamedRef, Ref, SharingSetting } from "./DHIS2";

export interface Predictor {
    id: string;
    code: string;
    name: string;
    description: string;
    output: NamedRef;
    outputCombo: NamedRef;
    periodType: string;
    annualSampleCount: number;
    generator: Expression;
    organisationUnitLevels: Ref[];
    predictorGroups: NamedRef[];
    sampleSkipTest: Expression;
    sequentialSampleCount: number;
    sequentialSkipCount: number;
    lastUpdated: string;
    lastUpdatedBy: NamedRef;
    created: string;
    user: NamedRef;
    publicAccess: string;
    userAccesses: SharingSetting[];
    userGroupAccesses: SharingSetting[];
    sectionSequence?: string;
    variableSequence?: string;
}

export interface Expression {
    expression: string;
    description?: string;
    slidingWindow?: boolean;
    missingValueStrategy?:
        | "NEVER_SKIP"
        | "SKIP_IF_ANY_VALUE_MISSING"
        | "SKIP_IF_ALL_VALUES_MISSING";
}

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
