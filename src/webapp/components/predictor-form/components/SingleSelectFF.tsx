import {  NoticeBox, SingleSelectFieldFFProps } from "@dhis2/ui";
import React, { useCallback, ChangeEvent } from "react";
import styled from "styled-components";
import { NamedRef } from "../../../../domain/entities/DHIS2";
import { SingleSelectFieldFF } from "@dhis2/ui";


/*export type SingleSelectFFProps = Omit<SingleSelectProps, "loading" | "onChange" | "selected"> & {
    input: any;
    meta: FieldState<NamedRef[]>;
    error?: boolean;
    loading?: boolean;
    showLoadingStatus?: boolean;
    showValidStatus?: boolean;
    valid?: boolean;
    validationText?: string;
};*/

export const SingleSelectFF = ({
    input,
    meta,
    validationText,
    loading,
    showLoadingStatus,
    options,
    ...rest
}: SingleSelectFieldFFProps) => {
    const isLoading = loading || (showLoadingStatus && meta.validating);
    const message = validationText ?? meta.error; // ?? meta.invalid
    const selected = input.value.map(({ id }: NamedRef) => id);
    //Transfer onChange: (params: { selected: string[] }) => void;
    //SingleSelect onChange?: (data: { value?: string; name?: string }, event: ChangeEvent) => void;

    const onChange = useCallback(
        ({ data }: { data: { value?: string; name?: string }},
            event: ChangeEvent) => {
            input.onChange({ value: data?.value || 0, name: options.find(item => item.value === data?.value || 0)?.label ?? "" }, event);
        },
        [input, options]
    );

    return (
        <React.Fragment>
            <SingleSelectFieldFF {...rest} options={options} loading={isLoading} onChange={onChange} selected={selected} />

            {!!message && <WarningBox warning={true} title={message} />}
        </React.Fragment>
    );
};

const WarningBox = styled(NoticeBox)`
    margin-top: 20px;
    align-items: center;

    h6 {
        margin: 0px;
    }
`;
