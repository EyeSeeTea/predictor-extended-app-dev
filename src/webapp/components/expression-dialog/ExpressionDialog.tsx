import _ from "lodash";
import { useAppContext } from "../../contexts/app-context";
import { ExpressionManager } from "./ExpressionManager";

export const ExpressionDialog: React.FC = () => {
    const { api } = useAppContext();

    return (
        <ExpressionManager
            validateExpression={async formula => {
                const encodedFormula = encodeURIComponent(formula);
                const { message, description } = await api
                    .get<any>(`expressions/description?expression=${encodedFormula}`)
                    .getData();

                return _.compact([message, description]).join(": ");
            }}
            expressionType="predictor"
        />
    );
};
