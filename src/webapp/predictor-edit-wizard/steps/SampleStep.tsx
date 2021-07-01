import { composeValidators, createMinNumber, InputField, integer } from "@dhis2/ui";
import i18n from "@eyeseetea/d2-ui-components/locales";
import React from "react";
import { Field } from "react-final-form";
import styled from "styled-components";

export const SampleStep: React.FC = () => {
    return (
        <React.Fragment>
            <NumericField name="sequentialSampleCount" label={i18n.t("Sequential sample count")} />

            <NumericField name="annualSampleCount" label={i18n.t("Annual sample count")} />

            <NumericField name="sequentialSkipCount" label={i18n.t("Sequential skip count")} />
        </React.Fragment>
    );
};

const NumericField: React.FC<{ name: string; label: string }> = ({ name, label }) => {
    return (
        <Row>
            <label>{label}</label>
            <Field name={name} validate={composeValidators(integer, createMinNumber(0))} defaultValue={"0"}>
                {props => (
                    <div>
                        <InputField
                            name={props.input.name}
                            value={`${props.input.value}`}
                            onChange={({ value }) => props.input.onChange(parseInt(value ?? "0"))}
                            placeholder={label}
                            type="number"
                            min="0"
                        />
                    </div>
                )}
            </Field>
        </Row>
    );
};

const Row = styled.div`
    margin: 20px 0;
`;
