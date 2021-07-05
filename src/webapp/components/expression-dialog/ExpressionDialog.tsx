import { Button, Menu, MenuItem, Pagination } from "@dhis2/ui";
import { useState } from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { D2ModelSchemas } from "../../../types/d2-api";
import { useAppContext } from "../../contexts/app-context";
import { useFuture } from "../../hooks/useFuture";
import { ExpressionEditor } from "../expression-editor/ExpressionEditor";
import { TabRow } from "../tab-row/TabRow";

const functionsForExpressionType: any = {
    indicator: [".periodOffset("],
};

interface ExpressionDialogProps {
    expressionChanged?: (value: string) => void;
    validateExpression?: (value: string) => Promise<string | undefined>;
    expressionType: "indicator" | "programIndicator" | "validationRule" | "predictor";
}

export const ExpressionDialog: React.FC<ExpressionDialogProps> = ({ expressionType, validateExpression }) => {
    const { compositionRoot } = useAppContext();
    const [formula, setFormula] = useState<string>("");
    const [expressionValidation, setValidation] = useState<string>();
    const [variableListType, setVariableListType] = useState<keyof D2ModelSchemas>("dataElements");

    const extraFunctionsForType = expressionType ? functionsForExpressionType[expressionType] : [];

    const { data: variables = [] } = useFuture(compositionRoot.usecases.getExpressionSuggestions, []);

    const { data: variableList, refetch: updateVariableList } = useFuture(compositionRoot.usecases.listMetadata, [
        variableListType,
    ]);

    const formulaChange = (formula = "") => {
        setFormula(formula);
        if (validateExpression) validateExpression(formula).then(message => setValidation(message));
    };

    const appendToFormula = (partToAppend: string) => {
        formulaChange(`${trimTrailing(formula)} ${partToAppend}`);
    };

    return (
        <GridContainer>
            <GridItem column={1}>
                <FormulaEditor
                    type="predictor-generator"
                    variables={variables}
                    value={formula}
                    onChange={formulaChange}
                />

                <Wrapper>
                    <FunctionButton value={"if("} label={"if"} handleClick={appendToFormula} />
                    <FunctionButton value={"isNull("} label={"isNull"} handleClick={appendToFormula} />
                    <FunctionButton value={"isNotNull("} label={"isNotNull"} handleClick={appendToFormula} />
                    <FunctionButton value={"firstNonNull("} label={"firstNonNull"} handleClick={appendToFormula} />
                    <FunctionButton value={"greatest("} label={"greatest"} handleClick={appendToFormula} />
                    <FunctionButton value={"least("} label={"least"} handleClick={appendToFormula} />
                    <FunctionButton value={"log("} label={"log"} handleClick={appendToFormula} />
                    <FunctionButton value={"log10("} label={"log10"} handleClick={appendToFormula} />
                    <FunctionButton value={"[days]"} label={"days"} handleClick={appendToFormula} />

                    {extraFunctionsForType?.map((funcName: string) => (
                        <FunctionButton key={`${funcName}`} value={funcName} handleClick={appendToFormula} />
                    ))}
                </Wrapper>
            </GridItem>

            <GridItem column={2}>
                <TabRow<keyof D2ModelSchemas>
                    options={tabs}
                    selected={variableListType}
                    onClick={value => {
                        setVariableListType(value);
                        updateVariableList(value, {
                            page: variableList?.pager.page,
                            pageSize: variableList?.pager.pageSize,
                        });
                    }}
                    scrollable={true}
                />
                <StyledPagination
                    page={variableList?.pager.page ?? 0}
                    pageCount={variableList?.pager.pageCount ?? 0}
                    pageSize={variableList?.pager.pageSize ?? 0}
                    total={variableList?.pager.total ?? 0}
                    hidePageSelect={true}
                    hidePageSizeSelect={true}
                    onPageChange={page => {
                        updateVariableList("dataElements", { page, pageSize: variableList?.pager.pageSize });
                    }}
                    onPageSizeChange={pageSize => {
                        updateVariableList("dataElements", { page: variableList?.pager.page, pageSize });
                    }}
                />
                <StyledMenu dense={true}>
                    {variableList?.objects.map(item => (
                        <MenuItem key={`item-${item.id}`} label={item.name} />
                    ))}
                </StyledMenu>
            </GridItem>

            {expressionValidation && (
                <GridItem column={1} expand={true}>
                    {expressionValidation}
                </GridItem>
            )}
        </GridContainer>
    );
};

const tabs: Array<{ value: keyof D2ModelSchemas; label: string }> = [
    { value: "dataElements", label: i18n.t("Data Elements") },
    { value: "programs", label: i18n.t("Programs") },
    //{ value: "orgUnitCounts", label: i18n.t("Org Unit Counts") },
    { value: "constants", label: i18n.t("Constants") },
    { value: "reportingRates", label: i18n.t("Reporting rates") },
];

const StyledPagination = styled(Pagination)`
    margin: 8px;
`;

const GridContainer = styled.div`
    display: grid;
    grid-gap: 20px;
    grid-auto-columns: 50%;
    margin-right: 25px;
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

const StyledMenu = styled(Menu)`
    height: 10em;
    overflow-y: scroll;
`;

const FunctionButton: React.FC<{ label?: string; value: string; handleClick: (value: string) => void }> = ({
    handleClick,
    value,
    label,
}) => {
    const onFunctionClick = ({ value }: { value?: string }) => {
        if (value) handleClick(value);
    };

    return (
        <StyledButton value={value} onClick={onFunctionClick}>
            {label ?? value}
        </StyledButton>
    );
};

const StyledButton = styled(Button)`
    min-width: 50px;
    margin: 5px;
    padding: 0 5px;

    &&:focus::after {
        border-color: transparent;
    }
`;

const Wrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
`;
