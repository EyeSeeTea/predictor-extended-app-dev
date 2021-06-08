import React from "react";
import { FieldRenderProps } from "react-final-form";

type Props = FieldRenderProps<string, any>;

export const TextAreaInput: React.FC<Props> = ({ input, ...rest }: Props) => <textarea {...input} {...rest} />;
