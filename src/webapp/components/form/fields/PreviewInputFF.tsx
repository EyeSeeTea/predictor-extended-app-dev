import { InputField } from "@dhis2/ui";
import { ConfirmationDialog } from "@eyeseetea/d2-ui-components";
import i18n from "@eyeseetea/d2-ui-components/locales";
import _ from "lodash";
import React, { useMemo, useState } from "react";
import { FieldRenderProps } from "react-final-form";

export function PreviewInputFF({ input, meta, placeholder, render }: PreviewInputFFProps) {
    const [open, setOpen] = useState(false);
    const value = useMemo(() => buildValue(input.value), [input.value]);

    return (
        <React.Fragment>
            <ConfirmationDialog
                title={placeholder}
                isOpen={open}
                maxWidth="lg"
                fullWidth={true}
                onCancel={() => setOpen(false)}
                cancelText={i18n.t("Close")}
            >
                {render({ input, meta })}
            </ConfirmationDialog>

            <div onClick={() => setOpen(true)}>
                <InputField
                    name={input.name}
                    value={value}
                    onChange={() => {}}
                    error={!!meta.error}
                    validationText={meta.error ?? meta.submitError}
                />
            </div>
        </React.Fragment>
    );
}

export interface PreviewInputFFProps extends Pick<FieldRenderProps<string>, "input" | "meta"> {
    placeholder: string;
    render: (props: Pick<FieldRenderProps<string>, "input" | "meta">) => React.ReactElement;
}

const buildValue = (value: unknown): string => {
    if (Array.isArray(value)) {
        return value.length === 0 ? "-" : value.map(item => buildValue(item)).join(", ");
    } else if (_.has(value, "name")) {
        return _.get(value, "name");
    } else if (value) {
        return String(value);
    } else {
        return "-";
    }
};
