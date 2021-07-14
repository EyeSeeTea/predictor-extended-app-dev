import React from "react";
import styled from "styled-components";
import { getPredictorFieldName, PredictorFormField, RenderPredictorWizardField } from "../predictor-form/PredictorForm";

export const PredictorEditWizardStep: React.FC<PredictorEditWizardStepProps> = ({ fields }) => {
    return (
        <React.Fragment>
            {fields.map(field => (
                <Row key={`wizard-row-${field}`}>
                    <b>{getPredictorFieldName(field)}</b>
                    <RenderPredictorWizardField row={0} field={field} />
                </Row>
            ))}
        </React.Fragment>
    );
};

const Row = styled.div`
    margin: 20px 0;
`;

export interface PredictorEditWizardStepProps {
    fields: PredictorFormField[];
}
