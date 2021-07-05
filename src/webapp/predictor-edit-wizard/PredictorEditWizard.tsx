import { Button, ButtonStrip } from "@dhis2/ui";
import { Wizard } from "@eyeseetea/d2-ui-components";
import i18n from "@eyeseetea/d2-ui-components/locales";
import { Paper } from "@material-ui/core";
import { ArrowBack, ArrowForward } from "@material-ui/icons";
import React, { useCallback } from "react";
import { Form } from "react-final-form";
import styled from "styled-components";
import { Predictor } from "../../domain/entities/Predictor";
import { StyledForm } from "../components/form/StyledForm";
import { useQueryState } from "../hooks/useQueryState";
import { GeneralInfoStep } from "./steps/GeneralInfoStep";
import { GeneratorStep } from "./steps/GeneratorStep";
import { SampleStep } from "./steps/SampleStep";
import { SharingStep } from "./steps/SharingStep";

const onSubmit = async (values: any) => {
    window.alert(JSON.stringify(values, undefined, 2));
};

const steps = [
    {
        key: `general-info`,
        module,
        label: i18n.t("General info"),
        component: GeneralInfoStep,
        props: {},
    },
    {
        key: `generator`,
        module,
        label: i18n.t("Generator"),
        component: GeneratorStep,
        props: {},
    },
    {
        key: `sample`,
        module,
        label: i18n.t("Samples"),
        component: SampleStep,
        props: {},
    },
    {
        key: `sharing`,
        module,
        label: i18n.t("Access"),
        component: SharingStep,
        props: {},
    },
];

export interface PredictorEditWizardProps {
    predictor: Partial<Predictor>;
}

interface WizardState {
    step: string;
}

export const PredictorEditWizard: React.FC<PredictorEditWizardProps> = ({ predictor }) => {
    const [state, setState] = useQueryState<WizardState>({ step: steps[0]?.key ?? "" });

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

    return (
        <React.Fragment>
            <Paper square={true}>
                <Form
                    autocomplete="off"
                    onSubmit={onSubmit}
                    initialValues={predictor}
                    render={({ handleSubmit }) => (
                        <StyledForm onSubmit={handleSubmit}>
                            <StyledWizard
                                stepKey={state.step}
                                steps={steps}
                                initialStepKey={steps[0]?.key}
                                lastClickableStepIndex={steps.length}
                                NavigationComponent={() => null}
                                onStepChange={setCurrentStep}
                            />
                        </StyledForm>
                    )}
                />
            </Paper>

            <ButtonsRow middle>
                <Button onClick={onPrev} icon={<ArrowBack />} />

                <Button type="submit" primary>
                    {i18n.t("Save")}
                </Button>

                <Button type="reset">{i18n.t("Cancel")}</Button>

                <Button onClick={onNext} icon={<ArrowForward />} />
            </ButtonsRow>
        </React.Fragment>
    );
};

const StyledWizard = styled(Wizard)`
    height: 100%;

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
