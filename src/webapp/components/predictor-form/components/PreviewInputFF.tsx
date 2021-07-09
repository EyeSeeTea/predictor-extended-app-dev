import { InputField } from "@dhis2/ui";
import { ConfirmationDialog } from "@eyeseetea/d2-ui-components";
import i18n from "@eyeseetea/d2-ui-components/locales";
import _ from "lodash";
import React, { ComponentProps, JSXElementConstructor, useMemo, useState } from "react";
import { FieldRenderProps } from "react-final-form";

export function PreviewInputFF<T extends JSXElementConstructor<any>>({
    placeholder,
    previewComponent: PreviewComponent,
    previewComponentProps,
    ...props
}: Pick<FieldRenderProps<string>, "input" | "meta"> & PreviewInputFFProps<T>) {
    const [open, setOpen] = useState(false);

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
                <PreviewComponent {...props} {...previewComponentProps} />
            </ConfirmationDialog>

            <div onClick={() => setOpen(true)}>
                <Foo {...props} />
            </div>
        </React.Fragment>
    );
}

const Foo = ({ meta, input, ...props }: any) => {
    const value = useMemo(() => buildValue(input.value), [input.value]);

    return (
        <InputField
            {...props}
            name={input.name}
            value={value}
            onChange={() => {}}
            error={!!meta.error}
            validationText={meta.error ?? meta.submitError}
        />
    );
};

export interface PreviewInputFFProps<T extends JSXElementConstructor<any>> {
    placeholder: string;
    previewComponent: T;
    previewComponentProps: ComponentProps<T>;
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
