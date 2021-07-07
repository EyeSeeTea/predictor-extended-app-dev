import { CheckboxField, composeValidators, createMinNumber, InputFieldFF, integer, NoticeBox } from "@dhis2/ui";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { ExpressionValidation } from "../../../../domain/repositories/PredictorRepository";
import i18n from "../../../../locales";
import { FormField } from "../../../components/form/fields/FormField";
import { NumberInputFF } from "../../../components/form/fields/NumberInputFF";
import { useAppContext } from "../../../contexts/app-context";
import { ExpressionDialog } from "../../expression-dialog/ExpressionDialog";

export const SampleStep: React.FC = () => {
    const { compositionRoot } = useAppContext();

    const [validation, setValidation] = useState<ExpressionValidation>();
    const [showSkipTest, setShowSkipTest] = useState<boolean>(false);

    const validateExpression = useCallback(
        (formula: string) => {
            if (!formula.trim()) {
                setValidation(undefined);
                return;
            }

            compositionRoot.usecases.validateExpression("predictor-skip-test", formula).run(setValidation, error =>
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
            <Checkbox
                label={i18n.t("Sample skip test")}
                onChange={({ checked }) => setShowSkipTest(checked)}
                checked={showSkipTest}
            />

            {showSkipTest && (
                <React.Fragment>
                    <Row>
                        <label>{i18n.t("Generator description (*)")}</label>
                        <FormField
                            name="sampleSkipTest.description"
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
                </React.Fragment>
            )}

            <Row>
                <label>{i18n.t("Sequential sample count")}</label>
                <FormField
                    name="sequentialSampleCount"
                    component={NumberInputFF}
                    validate={composeValidators(integer, createMinNumber(0))}
                    defaultValue="0"
                    min="0"
                />
            </Row>

            <Row>
                <label>{i18n.t("Annual sample count")}</label>
                <FormField
                    name="annualSampleCount"
                    component={NumberInputFF}
                    validate={composeValidators(integer, createMinNumber(0))}
                    defaultValue="0"
                    min="0"
                />
            </Row>

            <Row>
                <label>{i18n.t("Sequential skip count")}</label>
                <FormField
                    name="sequentialSkipCount"
                    component={NumberInputFF}
                    validate={composeValidators(integer, createMinNumber(0))}
                    defaultValue="0"
                    min="0"
                />
            </Row>
        </React.Fragment>
    );
};

const Row = styled.div`
    margin: 20px 0;
`;

const Checkbox = styled(CheckboxField)`
    label {
        display: flex;
    }

    input:focus + .icon {
        border-color: transparent !important;
    }
`;
