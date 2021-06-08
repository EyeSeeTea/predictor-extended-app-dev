import { Paper } from "@material-ui/core";
import React from "react";
import { Field, Form } from "react-final-form";
import styled from "styled-components";
import i18n from "../../../locales";
import { NumberInput } from "../../components/form/fields/NumberInput";
import { TextInput } from "../../components/form/fields/TextInput";
import { DefaultButton, PrimaryButton, StyledForm } from "../../components/form/StyledForm";
import PageHeader from "../../components/page-header/PageHeader";

const onSubmit = async (values: any) => {
    window.alert(JSON.stringify(values, undefined, 2));
};

export const PredictorEditPage: React.FC = () => {
    return (
        <Wrapper>
            <PageHeader onBackClick={() => {}} title={i18n.t("Create/Edit predictor")} />
            <Paper square={true}>
                <Form
                    onSubmit={onSubmit}
                    initialValues={{}}
                    render={({ handleSubmit, form, submitting, pristine, values }) => (
                        <StyledForm onSubmit={handleSubmit}>
                            <div>
                                <label>{i18n.t("Name (*)")}</label>
                                <Field<string> name="name" component={TextInput} placeholder={i18n.t("Name")} />
                            </div>
                            <div>
                                <label>{i18n.t("Code")}</label>
                                <Field<string> name="code" component={TextInput} placeholder={i18n.t("Code")} />
                            </div>
                            <div>
                                <label>{i18n.t("Description")}</label>
                                <Field<string>
                                    name="description"
                                    component={TextInput}
                                    placeholder={i18n.t("Description")}
                                />
                            </div>
                            <div>
                                <label>{i18n.t("Sequential sample count (*)")}</label>
                                <Field<number>
                                    name="age"
                                    component={NumberInput}
                                    placeholder={i18n.t("Sequential sample count")}
                                />
                            </div>
                            <div>
                                <label>{i18n.t("Annual sample count (*)")}</label>
                                <Field<number>
                                    name="age"
                                    component={NumberInput}
                                    placeholder={i18n.t("Annual sample count")}
                                />
                            </div>
                            <div>
                                <label>{i18n.t("Sequential skip count")}</label>
                                <Field<number>
                                    name="age"
                                    component={NumberInput}
                                    placeholder={i18n.t("Sequential skip count")}
                                />
                            </div>
                            
                            <div className="buttons">
                                <PrimaryButton type="submit" disabled={submitting || pristine}>
                                    Submit
                                </PrimaryButton>
                                <DefaultButton type="button" onClick={form.reset} disabled={submitting || pristine}>
                                    Reset
                                </DefaultButton>
                            </div>
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
