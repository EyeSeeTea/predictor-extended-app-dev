import {
    Button,
    composeValidators,
    createMinNumber,
    InputFieldFF,
    integer,
    SingleSelectFieldFF,
    Transfer,
} from "@dhis2/ui";
import { Paper } from "@material-ui/core";
import React from "react";
import { Form } from "react-final-form";
import styled from "styled-components";
import i18n from "../../../locales";
import { ExpressionDialog } from "../../components/expression-dialog/ExpressionDialog";
import { FormField } from "../../components/form/FormField";
import { StyledForm } from "../../components/form/StyledForm";
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
                    autocomplete="off"
                    onSubmit={onSubmit}
                    initialValues={{}}
                    render={({ handleSubmit, values }) => (
                        <StyledForm onSubmit={handleSubmit}>
                            <div>
                                <label>{i18n.t("Name (*)")}</label>
                                <FormField name="name" component={InputFieldFF} placeholder={i18n.t("Name")} />
                            </div>

                            <div>
                                <label>{i18n.t("Code")}</label>
                                <FormField name="code" component={InputFieldFF} placeholder={i18n.t("Code")} />
                            </div>

                            <div>
                                <label>{i18n.t("Description")}</label>
                                <FormField
                                    name="description"
                                    component={InputFieldFF}
                                    placeholder={i18n.t("Description")}
                                />
                            </div>

                            <div>
                                <label>{i18n.t("Period type (*)")}</label>
                                <FormField
                                    name="periodType"
                                    component={SelectFieldFF}
                                    clearable={true}
                                    options={[
                                        {
                                            label: "Org Unit Level 1",
                                            value: "OU_LEVEL_1",
                                        },
                                        {
                                            label: "Org Unit Level 2",
                                            value: "OU_LEVEL_2",
                                        },
                                    ]}
                                />
                            </div>

                            <div>
                                <label>{i18n.t("Sequential sample count (*)")}</label>
                                <FormField
                                    name="sequentialSampleCount"
                                    component={InputFieldFF}
                                    placeholder={i18n.t("Sequential sample count")}
                                    type="number"
                                    validate={composeValidators(integer, createMinNumber(0))}
                                    defaultValue={0}
                                />
                            </div>

                            <div>
                                <label>{i18n.t("Annual sample count (*)")}</label>
                                <FormField
                                    name="annualSampleCount"
                                    component={InputFieldFF}
                                    placeholder={i18n.t("Annual sample count")}
                                    type="number"
                                    validate={composeValidators(integer, createMinNumber(0))}
                                    defaultValue={0}
                                />
                            </div>

                            <div>
                                <label>{i18n.t("Sequential skip count")}</label>
                                <FormField
                                    name="sequentialSkipCount"
                                    component={InputFieldFF}
                                    placeholder={i18n.t("Sequential skip count")}
                                    type="number"
                                    validate={composeValidators(integer, createMinNumber(0))}
                                    defaultValue={0}
                                />
                            </div>

                            <div>
                                <label>{i18n.t("Organisation unit levels (*)")}</label>
                                <Transfer
                                    filterable
                                    filterablePicked
                                    onChange={() => {}}
                                    selectedWidth="100%"
                                    optionsWidth="100%"
                                    options={[
                                        {
                                            label: "Org Unit Level 1",
                                            value: "OU_LEVEL_1",
                                        },
                                        {
                                            label: "Org Unit Level 2",
                                            value: "OU_LEVEL_2",
                                        },
                                    ]}
                                />
                            </div>

                            <div>
                                <label>{i18n.t("Generator (*)")}</label>
                                <ExpressionDialog />
                            </div>

                            <div className="buttons">
                                <Button type="submit" primary>
                                    Submit form
                                </Button>

                                <Button type="reset">Reset</Button>
                            </div>

                            {console.log(values)}
                        </StyledForm>
                    )}
                />
            </Paper>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    margin: 20px 30px;
`;

const SelectFieldFF = styled(SingleSelectFieldFF)`
    line-height: 1em;
    padding: 0;
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
