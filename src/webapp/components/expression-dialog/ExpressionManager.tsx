import { Divider, Paper, Tab, Tabs } from "@material-ui/core";
import { useState } from "react";
import styled from "styled-components";
import i18n from "../../../locales";
//import { useAppContext } from "../../contexts/app-context";
import { ExpressionDescription } from "./ExpressionDescription";
import { ExpressionFormula } from "./ExpressionFormula";
import { ExpressionFunctions } from "./ExpressionFunctions";
import { ExpressionOperators } from "./ExpressionOperators";
import { ExpressionSelector } from "./ExpressionSelector";

const styles = {
    expressionDescription: {
        padding: "1rem",
        margin: "1rem 0",
    },
    expressionMessage: {
        valid: {
            padding: "1rem",
            color: "#006400",
        },
        invalid: {
            padding: "1rem",
            color: "#8B0000",
        },
    },
    list: {
        width: "100%",
        outline: "none",
        border: "none",
        padding: "0rem 1rem",
    },
    expressionFormulaWrap: {
        padding: "1rem",
        maxWidth: "650px",
        marginRight: "1rem",
    },
    expressionValueOptionsWrap: {
        minHeight: 400,
        minWidth: 600,
    },
    expressionContentWrap: {
        minHeight: 360,
    },
    tabItemContainer: {
        backgroundColor: "rgb(33, 150, 243)",
    },
    tabs: {
        color: "white",
    },
    divider: {
        padding: "0 1rem 2rem",
    },
};

interface ExpressionManagerProps {
    expressionChanged: (...args: any[]) => any;
    descriptionValue?: string;
    formulaValue?: string;
    titleText?: string;
    validateExpression?: (...args: any[]) => any;
    expressionType: "indicator" | "programIndicator" | "validationRule" | "predictor";
}

interface ExpressionManagerState {
    formula?: any;
    description?: any;
    expressionStatus?: { description: string; isValid: boolean; message?: any };
}

export const ExpressionManager: React.FC<ExpressionManagerProps> = ({
    expressionChanged,
    expressionType,
    descriptionValue = "",
    formulaValue = "",
    titleText = "",
}) => {
    //const { api } = useAppContext();

    const [state, setState] = useState<ExpressionManagerState>({
        formula: formulaValue,
        description: descriptionValue,
        expressionStatus: {
            description: "",
            isValid: false,
        },
    });

    const descriptionChange = (newDescription: any) => {
        setState({ description: newDescription });
        expressionChanged({
            formula: state.formula,
            description: state.description,
            expressionStatus: state.expressionStatus,
        });
    };

    const formulaChange = (newFormula: string) => {
        setState({
            formula: newFormula,
        });
        requestExpressionStatus();
    };

    const addOperatorToFormula = (operator: string) => {
        appendToFormula(operator);
    };

    const programOperandSelected = (programFormulaPart: string) => {
        appendToFormula(programFormulaPart);
    };

    const appendToFormula = (partToAppend: string) => {
        setState({
            formula: [state.formula, partToAppend].join(""),
        });
        requestExpressionStatus();
    };

    const dataElementOperandSelected = (dataElementOperandId: string) => {
        const dataElementOperandFormula = ["#{", dataElementOperandId, "}"].join("");
        appendToFormula(dataElementOperandFormula);
    };

    const requestExpressionStatus = () => {
        //requestExpressionStatusAction(state.formula);
    };

    /**const validateExpression = async (formula: string) => {
        const encodedFormula = encodeURIComponent(formula);
        const response = await api.get<any>(`expressions/description?expression=${encodedFormula}`).getData();
        setState(state => ({
            ...state,
            expressionStatus: {
                description: response.description,
                isValid: response.status === "OK",
                message: response.message,
            },
        }));
    };**/

    const isDescriptionValid = () => state.description && state.description.trim();

    return (
        <Column>
            <h3>{titleText}</h3>
            <Row>
                <Paper style={styles.expressionFormulaWrap}>
                    <Column>
                        <ExpressionDescription
                            descriptionValue={state.description}
                            descriptionLabel={i18n.t("Description")}
                            onDescriptionChange={descriptionChange}
                            errorText={!isDescriptionValid() ? i18n.t("Field is required") : undefined}
                        />
                        <ExpressionFormula onFormulaChange={formulaChange} formula={state.formula} />
                        <ExpressionOperators operatorClicked={addOperatorToFormula} />
                        <ExpressionFunctions onFunctionClick={appendToFormula} expressionType={expressionType} />
                    </Column>
                </Paper>
                <Paper style={styles.expressionValueOptionsWrap}>
                    <Tabs style={styles.expressionContentWrap}>
                        <Tab style={styles.tabs} label={i18n.t("Data elements")}>
                            <ExpressionSelector listStyle={styles.list} onSelect={dataElementOperandSelected} />
                        </Tab>
                        <Tab style={styles.tabs} label={i18n.t("Programs")}>
                            <ExpressionSelector onSelect={programOperandSelected} />
                        </Tab>
                        <Tab style={styles.tabs} label={i18n.t("Org Unit Counts")}>
                            <ExpressionSelector listStyle={styles.list} onSelect={appendToFormula} />
                        </Tab>
                        <Tab style={styles.tabs} label={i18n.t("Constants")}>
                            <ExpressionSelector listStyle={styles.list} onSelect={appendToFormula} />
                        </Tab>
                        <Tab style={styles.tabs} label={i18n.t("Reporting rates")}>
                            <ExpressionSelector listStyle={styles.list} onSelect={appendToFormula} />
                        </Tab>
                    </Tabs>
                    <div style={styles.divider}>
                        <Divider />
                    </div>
                </Paper>
            </Row>
            <Column>
                <Paper style={styles.expressionDescription}>{state.expressionStatus?.description}</Paper>
                <div
                    style={
                        state.expressionStatus?.isValid
                            ? styles.expressionMessage.valid
                            : styles.expressionMessage.invalid
                    }
                >
                    {state.expressionStatus?.message}
                </div>
            </Column>
        </Column>
    );
};

const Column = styled.div`
    flex-direction: "column";
`;

const Row = styled.div`
    flex-direction: "row";
`;
