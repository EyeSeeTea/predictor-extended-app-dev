import { InputFieldFF, SingleSelectFieldFF, Transfer } from "@dhis2/ui";
import React from "react";
import styled from "styled-components";
import i18n from "../../../../locales";
import { FormField } from "../../../components/form/fields/FormField";

export const GeneralInfoStep: React.FC = () => {
    return (
        <React.Fragment>
            <Row>
                <label>{i18n.t("Name (*)")}</label>
                <FormField name="name" component={InputFieldFF} placeholder={i18n.t("Name")} />
            </Row>

            <Row>
                <label>{i18n.t("Code")}</label>
                <FormField name="code" component={InputFieldFF} placeholder={i18n.t("Code")} />
            </Row>

            <Row>
                <label>{i18n.t("Description")}</label>
                <FormField name="description" component={InputFieldFF} placeholder={i18n.t("Description")} />
            </Row>

            <Row>
                <label>{i18n.t("Period type (*)")}</label>
                <FormField name="periodType" component={SingleSelectFieldFF} options={periodTypes} />
            </Row>

            <Row>
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
            </Row>

            <Row>
                <label>{i18n.t("Predictor groups")}</label>
                <Transfer
                    filterable
                    filterablePicked
                    onChange={() => {}}
                    selectedWidth="100%"
                    optionsWidth="100%"
                    options={[
                        {
                            label: "Predictor Group 1",
                            value: "OU_LEVEL_1",
                        },
                        {
                            label: "Predictor Group 2",
                            value: "OU_LEVEL_2",
                        },
                    ]}
                />
            </Row>
        </React.Fragment>
    );
};

const Row = styled.div`
    margin: 20px 0;
`;

const periodTypes = [
    { value: "Daily", label: "Daily" },
    { value: "Weekly", label: "Weekly" },
    { value: "WeeklyWednesday", label: "Weekly starting Wednesday" },
    { value: "WeeklyThursday", label: "Weekly starting Thursday" },
    { value: "WeeklySaturday", label: "Weekly starting Saturday" },
    { value: "WeeklySunday", label: "Weekly starting Sunday" },
    { value: "BiWeekly", label: "Biweekly" },
    { value: "Monthly", label: "Monthly" },
    { value: "BiMonthly", label: "Bi-monthly" },
    { value: "Quarterly", label: "Quarterly" },
    { value: "SixMonthly", label: "Six-monthly" },
    { value: "SixMonthlyApril", label: "Six-monthly starting April" },
    { value: "SixMonthlyNov", label: "Six-monthly starting November" },
    { value: "Yearly", label: "Yearly" },
    { value: "FinancialApril", label: "Financial year starting April" },
    { value: "FinancialJuly", label: "Financial year starting July" },
    { value: "FinancialOct", label: "Financial year starting October" },
    { value: "FinancialNov", label: "Financial year starting November" },
];
