import { Button } from "@dhis2/ui";
import React from "react";
import styled from "styled-components";

interface ExpressionOperatorsProps {
    operatorClicked: (...args: any[]) => any;
}

export const ExpressionOperators: React.FC<ExpressionOperatorsProps> = ({ operatorClicked }) => {
    const createOperatorClick = (operatorValue: string) => {
        return function operatorButtonClick() {
            operatorClicked(operatorValue);
        };
    };

    return (
        <div>
            <StyledButton onClick={createOperatorClick("(")}>(</StyledButton>
            <StyledButton onClick={createOperatorClick(")")}>)</StyledButton>
            <StyledButton onClick={createOperatorClick(" * ")}>*</StyledButton>
            <StyledButton onClick={createOperatorClick(" / ")}>/</StyledButton>
            <StyledButton onClick={createOperatorClick(" + ")}>+</StyledButton>
            <StyledButton onClick={createOperatorClick(" - ")}>-</StyledButton>
            <StyledButton onClick={createOperatorClick(" [days] ")}>Days</StyledButton>
        </div>
    );
};

const StyledButton = styled(Button)`
    min-width: 50px;
`;
