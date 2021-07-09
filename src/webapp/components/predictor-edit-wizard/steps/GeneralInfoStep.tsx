import React from "react";
import styled from "styled-components";
import {
    getPredictorFieldName,
    PredictorFormField,
    RenderPredictorWizardField,
} from "../../predictor-form/PredictorForm";

export const GeneralInfoStep: React.FC = () => {
    return (
        <React.Fragment>
            {generalInfoFields.map(field => (
                <Row key={`wizard-row-${field}`}>
                    <label>{getPredictorFieldName(field)}</label>
                    <RenderPredictorWizardField row={0} field={field} />
                </Row>
            ))}
        </React.Fragment>
    );
};

const Row = styled.div`
    margin: 20px 0;
`;

const generalInfoFields: PredictorFormField[] = [
    "name",
    "code",
    "description",
    "periodType",
    "organisationUnitLevels",
    "predictorGroups",
];
