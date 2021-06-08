import React from "react";
import { FieldRenderProps } from "react-final-form";

type Props = FieldRenderProps<string[], any>;

export const MultiSelectInput: React.FC<Props> = ({ input, ...rest }: Props) => (
    <select {...input} {...rest} multiple value={input.value || []} />
);
