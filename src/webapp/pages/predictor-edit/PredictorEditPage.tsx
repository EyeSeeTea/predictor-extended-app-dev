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
import React, { useEffect, useState } from "react";
import { Form } from "react-final-form";
import styled from "styled-components";
import i18n from "../../../locales";
import { ExpressionEditor } from "../../components/expression-editor/ExpressionEditor";
import { Variable } from "../../components/expression-editor/types";
import { FormField } from "../../components/form/FormField";
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
                                    component={SingleSelectFieldFF}
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
                                <FormulaEditor type="predictor-generator" variables={variables} />
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
    margin: 20px;
`;

const FormulaEditor = styled(ExpressionEditor)`
    box-sizing: border-box;
    font-size: 14px;
    line-height: 16px;
    user-select: text;
    color: rgb(33, 41, 52);
    background-color: white;
    padding: 12px 11px 10px;
    outline: 0px;
    border: 1px solid rgb(160, 173, 186);
    border-radius: 3px;
    box-shadow: rgb(48 54 60 / 10%) 0px 1px 2px 0px inset;
    text-overflow: ellipsis;
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
