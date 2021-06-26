import { Button } from "@dhis2/ui";
import React from "react";
import styled from "styled-components";

const functionsForExpressionType: any = {
    indicator: [" .periodOffset( "],
};

interface ExpressionFunctionsProps {
    onFunctionClick: (...args: any[]) => any;
    expressionType: string;
}

export const ExpressionFunctions: React.FC<ExpressionFunctionsProps> = ({ expressionType, onFunctionClick }) => {
    const extraFunctionsForType = expressionType ? functionsForExpressionType[expressionType] : [];

    return (
        <Wrapper>
            <FunctionButton value={" if( "} onFunctionClick={onFunctionClick} />
            <FunctionButton value={" isNull( "} onFunctionClick={onFunctionClick} />
            <FunctionButton value={" isNotNull( "} onFunctionClick={onFunctionClick} />
            <FunctionButton value={" firstNonNull( "} onFunctionClick={onFunctionClick} />
            <FunctionButton value={" greatest( "} onFunctionClick={onFunctionClick} />
            <FunctionButton value={" least( "} onFunctionClick={onFunctionClick} />
            <FunctionButton value={" log( "} onFunctionClick={onFunctionClick} />
            <FunctionButton value={" log10( "} onFunctionClick={onFunctionClick} />

            {extraFunctionsForType?.map((funcName: string) => (
                <FunctionButton key={`${funcName}`} value={funcName} onFunctionClick={onFunctionClick} />
            ))}
        </Wrapper>
    );
};

const FunctionButton: React.FC<{ label?: string; value: string; onFunctionClick: (...args: any[]) => any }> = ({
    onFunctionClick,
    value,
    label,
}) => {
    const createFunctionClick = (operatorValue: string) => {
        return function functionButtonClicked() {
            onFunctionClick(operatorValue);
        };
    };

    return (
        <StyledButton key={value} onClick={createFunctionClick(value)}>
            {label ?? value}
        </StyledButton>
    );
};

const StyledButton = styled(Button)`
    min-width: 50;
    margin-right: "15px";
    padding: "0 5px";
`;

const Wrapper = styled.div`
    display: "flex";
    flex-wrap: "wrap";
`;
