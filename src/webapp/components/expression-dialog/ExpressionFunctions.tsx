import { Button } from "@dhis2/ui";
import React from "react";
import styled from "styled-components";

const functionsForExpressionType: any = {
    indicator: [".periodOffset("],
};

interface ExpressionFunctionsProps {
    onFunctionClick: (...args: any[]) => any;
    expressionType: string;
}

export const ExpressionFunctions: React.FC<ExpressionFunctionsProps> = ({ expressionType, onFunctionClick }) => {
    const extraFunctionsForType = expressionType ? functionsForExpressionType[expressionType] : [];

    const handleClick = ({ value }: { value?: string }) => {
        onFunctionClick(value);
    };

    return (
        <Wrapper>
            <FunctionButton value={"if("} label={"if"} onFunctionClick={handleClick} />
            <FunctionButton value={"isNull("} label={"isNull"} onFunctionClick={handleClick} />
            <FunctionButton value={"isNotNull("} label={"isNotNull"} onFunctionClick={handleClick} />
            <FunctionButton value={"firstNonNull("} label={"firstNonNull"} onFunctionClick={handleClick} />
            <FunctionButton value={"greatest("} label={"greatest"} onFunctionClick={handleClick} />
            <FunctionButton value={"least("} label={"least"} onFunctionClick={handleClick} />
            <FunctionButton value={"log("} label={"log"} onFunctionClick={handleClick} />
            <FunctionButton value={"log10("} label={"log10"} onFunctionClick={handleClick} />
            <FunctionButton value={"[days]"} label={"days"} onFunctionClick={handleClick} />

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
    return (
        <StyledButton
            value={value}
            onClick={onFunctionClick}
        >
            {label ?? value}
        </StyledButton>
    );
};

const StyledButton = styled(Button)`
    min-width: 50px;
    margin: 5px;
    padding: 0 5px;

    &&:focus::after {
        border-color: transparent !important;
    }
`;

const Wrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
`;
