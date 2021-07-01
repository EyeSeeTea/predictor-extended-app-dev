import _ from "lodash";
import i18n from "../../../locales";
import { ExpressionDialog } from "../../components/expression-dialog/ExpressionDialog";
import { useAppContext } from "../../contexts/app-context";

export const GeneratorStep: React.FC = () => {
    const { api } = useAppContext();

    return (
        <div>
            <label>{i18n.t("Generator (*)")}</label>
            <ExpressionDialog
                validateExpression={async formula => {
                    const encodedFormula = encodeURIComponent(formula);
                    const { message, description } = await api
                        .get<any>(`expressions/description?expression=${encodedFormula}`)
                        .getData();

                    return _.compact([message, description]).join(": ");
                }}
                expressionType="predictor"
            />
        </div>
    );
};
