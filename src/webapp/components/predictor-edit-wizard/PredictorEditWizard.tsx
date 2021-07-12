import { Button, ButtonStrip } from "@dhis2/ui";
import { ConfirmationDialog, Wizard } from "@eyeseetea/d2-ui-components";
import i18n from "@eyeseetea/d2-ui-components/locales";
import { Paper } from "@material-ui/core";
import { ArrowBack, ArrowForward } from "@material-ui/icons";
import { FormApi, FORM_ERROR } from "final-form";
import React, { useCallback } from "react";
import { Form } from "react-final-form";
import styled from "styled-components";
import { Predictor } from "../../../domain/entities/Predictor";
import { useQueryState } from "../../hooks/useQueryState";
import { PredictorEditWizardStep } from "./PredictorEditWizardStep";

const steps = [
    {
        key: `general-info`,
        module,
        label: i18n.t("General info"),
        component: PredictorEditWizardStep,
        props: {
            fields: [
                "name",
                "code",
                "description",
                "periodType",
                "output",
                "outputCombo",
                "organisationUnitLevels",
                "predictorGroups",
            ],
        },
    },
    {
        key: `generator`,
        module,
        label: i18n.t("Generator"),
        component: PredictorEditWizardStep,
        props: { fields: ["generator.description", "generator.expression", "generator.missingValueStrategy"] },
    },
    {
        key: `sample`,
        module,
        label: i18n.t("Samples"),
        component: PredictorEditWizardStep,
        props: {
            fields: [
                "sequentialSampleCount",
                "annualSampleCount",
                "sequentialSkipCount",
                "sampleSkipTest.description",
                "sampleSkipTest.expression",
            ],
        },
    },
    {
        key: `scheduling`,
        module,
        label: i18n.t("Scheduling"),
        component: PredictorEditWizardStep,
        props: {
            fields: [],
        },
    },
];

export interface PredictorEditWizardProps {
    predictor: Predictor;
    onCancel: () => void;
    onSave: (predictor: Predictor) => Promise<string | undefined>;
}

interface WizardState {
    step: string;
}

export const PredictorEditWizard: React.FC<PredictorEditWizardProps> = ({ predictor, onSave, onCancel }) => {
    const [state, setState] = useQueryState<WizardState>({ step: steps[0]?.key ?? "" });
    const [errorDialogOpen, setErrorDialogOpen] = React.useState(false);

    const onNext = useCallback(() => {
        setState(state => {
            const index = steps.findIndex(step => step.key === state.step);
            return { ...state, step: steps[index + 1]?.key ?? state.step };
        });
    }, [setState]);

    const onPrev = useCallback(() => {
        setState(state => {
            const index = steps.findIndex(step => step.key === state.step);
            return { ...state, step: steps[index - 1]?.key ?? state.step };
        });
    }, [setState]);

    const setCurrentStep = useCallback(
        (currentStep: string) => {
            setState(state => ({ ...state, step: currentStep }));
        },
        [setState]
    );

    const onSubmit = useCallback(
        async (
            values: { predictors: Predictor[] },
            form: FormApi<{ predictors: Predictor[] }, Partial<{ predictors: Predictor[] }>>
        ) => {
            const predictor = values.predictors[0];
            if (!predictor) return;

            const error = await onSave(predictor);
            if (error) {
                form.restart(values);
                setErrorDialogOpen(true);
                return { [FORM_ERROR]: error };
            }
        },
        [onSave]
    );

    return (
        <React.Fragment>
            <Form<{ predictors: Predictor[] }>
                autocomplete="off"
                onSubmit={onSubmit}
                initialValues={{ predictors: [predictor] }}
                render={({ handleSubmit, submitError }) => (
                    <Wrapper onSubmit={handleSubmit}>
                        <Paper square={true}>
                            <StyledWizard
                                stepKey={state.step}
                                steps={steps}
                                initialStepKey={steps[0]?.key}
                                lastClickableStepIndex={steps.length}
                                NavigationComponent={() => null}
                                onStepChange={setCurrentStep}
                            />
                        </Paper>

                        <ButtonsRow middle>
                            <Button onClick={onPrev} icon={<ArrowBack />} />

                            <Button type="submit" primary>
                                {i18n.t("Save")}
                            </Button>

                            <Button type="reset" onClick={onCancel}>
                                {i18n.t("Cancel")}
                            </Button>

                            <Button onClick={onNext} icon={<ArrowForward />} />
                        </ButtonsRow>

                        <ConfirmationDialog
                            isOpen={errorDialogOpen}
                            title={i18n.t("Please fix the following problems before saving")}
                            description={submitError}
                            onCancel={() => setErrorDialogOpen(false)}
                        />
                    </Wrapper>
                )}
            />
        </React.Fragment>
    );
};

const StyledWizard = styled(Wizard)`
    height: 100%;
    padding: 45px;
    width: inherit;

    && > .MuiStepper-root {
        margin-bottom: 40px;
    }

    .MuiPaper-root {
        box-shadow: none;
        background-color: inherit;
        margin: inherit;
        padding: 0;
    }

    label {
        display: block;
        margin-bottom: 15px;
    }
`;

const ButtonsRow = styled(ButtonStrip)`
    padding: 20px;

    button:focus::after {
        border-color: transparent !important;
    }
`;

const Wrapper = styled.form`
    margin: 10px;
`;
