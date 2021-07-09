import { InputField } from "@dhis2/ui";
import { ConfirmationDialog } from "@eyeseetea/d2-ui-components";
import i18n from "@eyeseetea/d2-ui-components/locales";
import _ from "lodash";
import React, { ComponentProps, JSXElementConstructor, useState } from "react";
import { FieldRenderProps } from "react-final-form";
import { FormField } from "../../form/fields/FormField";

export function PreviewInputFF<T extends JSXElementConstructor<any>>({
    input,
    placeholder,
    previewComponent,
    previewComponentProps,
    ...props
}: Pick<FieldRenderProps<string>, "input"> & PreviewInputFFProps<T>) {
    const [open, setOpen] = useState(false);
    const value = buildValue(input.value);

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
                <FormField name={input.name} component={previewComponent} {...previewComponentProps} />
            </ConfirmationDialog>

            <div onClick={() => setOpen(true)}>
                <InputField {...props} name={input.name} value={value} />
            </div>
        </React.Fragment>
    );
}

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
