import { Button, composeValidators, createMinNumber, InputFieldFF, integer } from "@dhis2/ui";
import { Paper } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import styled from "styled-components";
import i18n from "../../../locales";
import { ExpressionEditor } from "../../components/expression-editor/ExpressionEditor";
import { Variable } from "../../components/expression-editor/types";
import { StyledForm } from "../../components/form/StyledForm";
import PageHeader from "../../components/page-header/PageHeader";
import { useAppContext } from "../../contexts/app-context";

const onSubmit = async (values: any) => {
    window.alert(JSON.stringify(values, undefined, 2));
};

export const PredictorEditPage: React.FC = () => {
    const { compositionRoot } = useAppContext();
    const [variables, setVariables] = useState<Variable[]>([]);

    useEffect(() => {
        compositionRoot.usecases.getExpressionSuggestions().then(setVariables);
    }, [compositionRoot]);

    return (
        <Wrapper>
            <PageHeader onBackClick={() => {}} title={i18n.t("Create/Edit predictor")} />
            <Paper square={true}>
                <Form
                    onSubmit={onSubmit}
                    initialValues={{}}
                    render={({ handleSubmit, values }) => (
                        <StyledForm onSubmit={handleSubmit}>
                            <div>
                                <label>{i18n.t("Name (*)")}</label>
                                <Field<string> name="name" component={InputFieldFF} placeholder={i18n.t("Name")} />
                            </div>
                            <div>
                                <label>{i18n.t("Code")}</label>
                                <Field<string> name="code" component={InputFieldFF} placeholder={i18n.t("Code")} />
                            </div>
                            <div>
                                <label>{i18n.t("Description")}</label>
                                <Field<string>
                                    name="description"
                                    component={InputFieldFF}
                                    placeholder={i18n.t("Description")}
                                />
                            </div>
                            <div>
                                <label>{i18n.t("Sequential sample count (*)")}</label>
                                <Field<number>
                                    name="sequentialSampleCount"
                                    component={InputFieldFF}
                                    placeholder={i18n.t("Sequential sample count")}
                                    type="number"
                                    validate={composeValidators(integer, createMinNumber(0))}
                                />
                            </div>
                            <div>
                                <label>{i18n.t("Annual sample count (*)")}</label>
                                <Field<number>
                                    name="annualSampleCount"
                                    component={InputFieldFF}
                                    placeholder={i18n.t("Annual sample count")}
                                    type="number"
                                    validate={composeValidators(integer, createMinNumber(0))}
                                />
                            </div>
                            <div>
                                <label>{i18n.t("Sequential skip count")}</label>
                                <Field<number>
                                    name="sequentialSkipCount"
                                    component={InputFieldFF}
                                    placeholder={i18n.t("Sequential skip count")}
                                    type="number"
                                    validate={composeValidators(integer, createMinNumber(0))}
                                />
                            </div>

                            <div className="buttons">
                                <Button type="submit" primary>
                                    Submit form
                                </Button>

                                <Button type="reset">Reset</Button>
                            </div>

                            <ExpressionEditor type="predictor-generator" variables={variables} />

                            <pre>{JSON.stringify(values, undefined, 4)}</pre>
                        </StyledForm>
                    )}
                />
            </Paper>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    margin: 20px;
`;

interface FormItemBase {
    key: string;
    title: string;
    mandatory: boolean;
    type: "text" | "number" | "dropdown" | "custom";
}

interface FormItemText extends FormItemBase {
    type: "text";
    validate?: (value: string) => string[];
}

interface FormItemNumber extends FormItemBase {
    type: "number";
    validate?: (value: number) => string[];
}

interface FormItemDropdown extends FormItemBase {
    type: "dropdown";
    validate?: <T>(value: T) => string[];
}

interface FormItemCustom extends FormItemBase {
    type: "custom";
    customComponent?: <T>(value: T, errors: string[]) => React.ReactNode;
}

export type FormItem = FormItemText | FormItemNumber | FormItemDropdown | FormItemCustom;
