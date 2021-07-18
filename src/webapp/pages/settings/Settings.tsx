import { InputField } from "@dhis2/ui";
import i18n from "@eyeseetea/d2-ui-components/locales";
import React, { useState } from "react";
import styled from "styled-components";
import { PageHeader } from "../../components/page-header/PageHeader";
import { useGoBack } from "../../hooks/useGoBack";

export const SettingsPage: React.FC = () => {
    const goBack = useGoBack();

    const [recurrence, setRecurrece] = useState(0);

    return (
        <Wrapper>
            <PageHeader onBackClick={goBack} title={i18n.t("Settings")} />

            <h3>{i18n.t("Scheduling")}</h3>

            <b>{i18n.t("Recurrence (hours)")}</b>

            <InputField
                value={`${recurrence}`}
                onChange={({ value }) => setRecurrece(parseInt(value ?? "0"))}
                type="number"
                min="0"
            />

            <b>{i18n.t("Delay between executions (seconds)")}</b>

            <InputField
                value={`${recurrence}`}
                onChange={({ value }) => setRecurrece(parseInt(value ?? "0"))}
                type="number"
                min="0"
            />

            <b>{i18n.t("Period start date")}</b>

            <InputField type="date" />

            <b>{i18n.t("Period end date")}</b>

            <InputField type="date" />
        </Wrapper>
    );
};

const Wrapper = styled.div`
    margin: 20px;

    b,
    input,
    h3 {
        margin: 20px;
    }
`;
