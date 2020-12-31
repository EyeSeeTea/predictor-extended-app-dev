import { AttributeValue, Ref, SharingSetting } from "./DHIS2";

export interface Predictor {
    annualSampleCount: number;
    attributeValues: AttributeValue[];
    code: string;
    created: string;
    description: string;
    displayDescription: string;
    displayFormName: string;
    displayName: string;
    displayShortName: string;
    externalAccess: boolean;
    favorite: boolean;
    favorites: string[];
    formName: string;
    generator: Expression;
    href: string;
    id: string;
    lastUpdated: string;
    lastUpdatedBy: Ref;
    name: string;
    organisationUnitLevels: Ref[];
    output: Ref;
    outputCombo: Ref;
    periodType: string;
    predictorGroups: PredictorGroup[];
    publicAccess: string;
    sampleSkipTest: Expression;
    sequentialSampleCount: number;
    sequentialSkipCount: number;
    shortName: string;
    user: Ref;
    userAccesses: SharingSetting[];
    userGroupAccesses: SharingSetting[];
}

export interface PredictorGroup {
    attributeValues: AttributeValue[];
    code: string;
    created: string;
    description: string;
    displayName: string;
    externalAccess: boolean;
    favorite: boolean;
    favorites: string[];
    href: string;
    id: string;
    lastUpdated: string;
    lastUpdatedBy: Ref;
    name: string;
    predictors: Predictor[];
    publicAccess: string;
    user: Ref;
    userAccesses: SharingSetting[];
    userGroupAccesses: SharingSetting[];
}

export interface Expression {
    expression: string;
    description: string;
    missingValueStrategy: "NEVER_SKIP" | "SKIP_IF_ANY_VALUE_MISSING" | "SKIP_IF_ALL_VALUES_MISSING";
    slidingWindow: boolean;
}
