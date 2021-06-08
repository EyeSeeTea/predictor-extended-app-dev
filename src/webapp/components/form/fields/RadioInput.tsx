import React from "react";
import { FieldRenderProps } from "react-final-form";

type Props = FieldRenderProps<string, any>;

export const RadioInput: React.FC<Props> = ({ input, ...rest }) => {
    return <input type="radio" {...input} {...rest} />;
};
