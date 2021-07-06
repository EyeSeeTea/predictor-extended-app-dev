import { InputFieldFF, NoticeBox, SingleSelectFieldFF } from "@dhis2/ui";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { ExpressionValidation } from "../../../../domain/repositories/PredictorRepository";
import i18n from "../../../../locales";
import { useAppContext } from "../../../contexts/app-context";
import { ExpressionDialog } from "../../expression-dialog/ExpressionDialog";
import { FormField } from "../../form/fields/FormField";

export const GeneratorStep: React.FC = () => {
    const { compositionRoot } = useAppContext();

    const [validation, setValidation] = useState<ExpressionValidation>();

    const validateExpression = useCallback(
        (formula: string) => {
            if (!formula.trim()) {
                setValidation(undefined);
                return;
            }

            compositionRoot.usecases.validateExpression("predictor-formula", formula).run(setValidation, error =>
                setValidation({
                    status: "ERROR",
                    message: i18n.t("Unable to validate expression"),
                    description: error,
                })
            );
        },
        [compositionRoot]
    );

    return (
        <React.Fragment>
            <Row>
                <label>{i18n.t("Generator description (*)")}</label>
                <FormField
                    name="generator.description"
                    component={InputFieldFF}
                    placeholder={i18n.t("Generator description")}
                />
            </Row>

            <Row>
                <label>{i18n.t("Generator (*)")}</label>
                <ExpressionDialog expressionChanged={validateExpression} expressionType="predictor" />
            </Row>

            <Row>
                {!!validation && (
                    <NoticeBox error={validation.status === "ERROR"} title={validation.message}>
                        {validation.description}
                    </NoticeBox>
                )}
            </Row>

            <Row>
                <label>{i18n.t("Missing value strategy (*)")}</label>
                <FormField
                    name="generator.missingValueStrategy"
                    component={SingleSelectFieldFF}
                    options={missingValueStrategy}
                />
            </Row>
        </React.Fragment>
    );
};

const Row = styled.div`
    margin: 20px 0;
`;

const missingValueStrategy = [
    { value: "SKIP_IF_ANY_VALUE_MISSING", label: i18n.t("Skip if any value is missing") },
    { value: "SKIP_IF_ALL_VALUES_MISSING", label: i18n.t("Skip if all values are missing") },
    { value: "NEVER_SKIP", label: i18n.t("Never skip") },
];
