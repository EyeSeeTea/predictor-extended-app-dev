import { composeValidators, createMinNumber, integer } from "@dhis2/ui";
import i18n from "@eyeseetea/d2-ui-components/locales";
import React from "react";
import styled from "styled-components";
import { FormField } from "../../../components/form/fields/FormField";
import { NumberInputFF } from "../../../components/form/fields/NumberInputFF";

export const SampleStep: React.FC = () => {
    return (
        <React.Fragment>
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
