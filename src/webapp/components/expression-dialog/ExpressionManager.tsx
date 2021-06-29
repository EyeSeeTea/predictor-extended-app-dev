import { InputFieldFF } from "@dhis2/ui";
import { useEffect, useState } from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { useAppContext } from "../../contexts/app-context";
import { ExpressionEditor } from "../expression-editor/ExpressionEditor";
import { Variable } from "../expression-editor/types";
import { FormField } from "../form/FormField";
import { TabRow } from "../tab-row/TabRow";
import { ExpressionFunctions } from "./ExpressionFunctions";
import { ExpressionSelector } from "./ExpressionSelector";

interface ExpressionManagerProps {
    expressionChanged?: (value: string) => void;
    validateExpression?: (value: string) => Promise<string | undefined>;
    expressionType: "indicator" | "programIndicator" | "validationRule" | "predictor";
}

export const ExpressionManager: React.FC<ExpressionManagerProps> = ({ expressionType, validateExpression }) => {
    const { compositionRoot } = useAppContext();
    const [formula, setFormula] = useState<string>("");
    const [variables, setVariables] = useState<Variable[]>([]);
    const [expressionValidation, setValidation] = useState<string>();

    useEffect(() => {
        compositionRoot.usecases.getExpressionSuggestions().then(setVariables);
    }, [compositionRoot]);

    const formulaChange = (formula = "") => {
        setFormula(formula);
        if (validateExpression) validateExpression(formula).then(message => setValidation(message));
        console.log("foo", formula);
    };

    const appendToFormula = (partToAppend: string) => {
        formulaChange(`${trimTrailing(formula)} ${partToAppend}`);
    };

    const dataElementOperandSelected = (dataElementOperandId: string) => {
        const dataElementOperandFormula = ["#{", dataElementOperandId, "}"].join("");
        appendToFormula(dataElementOperandFormula);
    };

    return (
        <GridContainer>
            <GridItem column={1} expand={true}>
                <label>{i18n.t("Generator description (*)")}</label>
                <FormField name="name" component={InputFieldFF} placeholder={i18n.t("Description")} />
            </GridItem>

            <GridItem column={1}>
                <FormulaEditor
                    type="predictor-generator"
                    variables={variables}
                    value={formula}
                    onChange={formulaChange}
                />

                <ExpressionFunctions onFunctionClick={appendToFormula} expressionType={expressionType} />
            </GridItem>

            <GridItem column={2}>
                <TabRow options={tabs} onClick={() => {}} loading={false} />
                <ExpressionSelector onSelect={dataElementOperandSelected} />
            </GridItem>

            {expressionValidation && (
                <GridItem column={1} expand={true}>
                    {expressionValidation}
                </GridItem>
            )}
        </GridContainer>
    );
};

const tabs = [
    { value: "dataElements", label: i18n.t("Data Elements") },
    { value: "programs", label: i18n.t("Programs") },
    { value: "orgUnitCounts", label: i18n.t("Org Unit Counts") },
    { value: "constants", label: i18n.t("Constants") },
    { value: "reportingRates", label: i18n.t("Reporting rates") },
];

const GridContainer = styled.div`
    display: grid;
    grid-gap: 20px;
    grid-template-columns: minmax(100px, 1fr) 1fr;
`;

const GridItem = styled.div<{ column: number; expand?: boolean }>`
    grid-column: ${props => props.column} ${props => (props.expand ? "/ span 2" : "")};
    grid-row: auto;
    padding: 20px;

    border: 1px solid rgb(160, 173, 186);
    border-radius: 3px;
    box-shadow: rgb(48 54 60 / 10%) 0px 1px 2px 0px inset;
`;

const FormulaEditor = styled(ExpressionEditor)`
    box-sizing: border-box;
    font-size: 14px;
    line-height: 16px;
    user-select: text;
    color: rgb(33, 41, 52);
    background-color: white;
    padding: 12px 11px 10px;
    outline: 0px;
    border: 1px solid rgb(160, 173, 186);
    border-radius: 3px;
    box-shadow: rgb(48 54 60 / 10%) 0px 1px 2px 0px inset;
    text-overflow: ellipsis;
`;

function trimTrailing(x: string) {
    return x.replace(/\s+$/gm, "");
}
