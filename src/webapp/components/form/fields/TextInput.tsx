import React from "react";
import { FieldRenderProps } from "react-final-form";

type Props = FieldRenderProps<string, any>;

export const TextInput: React.FC<Props> = ({ input, ...rest }: Props) => <input type="text" {...input} {...rest} />;
