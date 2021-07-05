import { FieldState, NoticeBox, Transfer, TransferProps } from "@dhis2/ui";
import React from "react";

export const TransferFF = ({
    input,
    meta,
    error,
    showValidStatus,
    valid,
    validationText,
    loading,
    showLoadingStatus,
    ...rest
}: {
    input: any;
    meta: FieldState<string[]>;
    error?: boolean;
    loading?: boolean;
    showLoadingStatus?: boolean;
    showValidStatus?: boolean;
    valid?: boolean;
    validationText?: string;
} & TransferProps) => (
    <React.Fragment>
        <Transfer
            {...rest}
            loading={isLoading(meta, loading, showLoadingStatus)}
            onChange={createChangeHandler(input)}
            selected={input.value}
        />

        <NoticeBox
            error={hasError(meta, error)}
            warning={!isValid(meta, valid, showValidStatus)}
            title={getValidationText(meta, validationText, error)}
        />
    </React.Fragment>
);

const isLoading = (meta: any, loading?: boolean, showLoadingStatus?: boolean) =>
    loading || (showLoadingStatus && meta.validating);

const isValid = (meta: any, valid?: boolean, showValidStatus?: boolean) =>
    valid || (showValidStatus && meta.touched && meta.valid);

const hasError = (meta: any, error?: boolean) => error || (meta.touched && meta.invalid);

const getValidationText = (meta: any, validationText?: string, error?: boolean) => {
    if (validationText) {
        return validationText;
    }

    if (hasError(meta, error)) {
        if (meta.error) {
            return meta.error;
        }

        if (meta.submitError) {
            return meta.submitError;
        }
    }

    return "";
};

const PRIMITIVE_TYPES = new Set(["string", "number", "boolean"]);

const createChangeHandler =
    ({ onChange }: any) =>
    (payload: any) => {
        if (payload && "value" in payload) {
            // ui-core event signature
            onChange(payload.value);
        } else if (payload && payload.target && "value" in payload.target) {
            // synthetic event
            onChange(payload.target.value);
        } else if (PRIMITIVE_TYPES.has(typeof payload)) {
            // directly usable value
            onChange(payload);
        } else {
            // ¯\_(ツ)_/¯
            throw new Error("Could not process event payload");
        }
    };
