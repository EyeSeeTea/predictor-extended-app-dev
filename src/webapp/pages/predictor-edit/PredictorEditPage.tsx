import { Paper } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import PageHeader from "../../components/page-header/PageHeader";

export const PredictorEditPage: React.FC = () => {
    return (
        <Wrapper>
            <PageHeader onBackClick={() => {}} title={i18n.t("Create/Edit predictor")} />
            <Paper square={true}>{"foo"}</Paper>
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
