import React from "react";

interface ExpressionFormulaProps {
    onFormulaChange: (...args: any[]) => any;
    formula?: string;
}

export const ExpressionFormula: React.FC<ExpressionFormulaProps> = ({ formula, onFormulaChange }) => {
    const handleFormulaChange = (event: any) => {
        const formulaValue = event.target.value;
        if (onFormulaChange) onFormulaChange(formulaValue);
    };

    const textAreaStyle = {
        margin: 0,
        width: "100%",
        height: 200,
        border: "1px solid #DDD",
        padding: "1rem",
        outline: "none",
        //resize: "vertical",
        //boxSizing: "border-box",
    };

    return (
        <div className="expression-formula">
            <textarea onChange={handleFormulaChange} value={formula} style={textAreaStyle} />
        </div>
    );
};
