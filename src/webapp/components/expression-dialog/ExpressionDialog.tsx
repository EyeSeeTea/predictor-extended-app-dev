import { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import { ExpressionManager } from "./ExpressionManager";

export const ExpressionDialog: React.FC = () => {
    const { api } = useAppContext();
    const [value, setValue] = useState<string>("");

    useEffect(() => {
        const encodedFormula = encodeURIComponent(value);
        const { response, cancel } = api.get<any>(`expressions/description?expression=${encodedFormula}`);
        response.then(({ data }) => console.log(value, data));
        return cancel;
    }, [api, value]);

    return <ExpressionManager expressionChanged={setValue} expressionType="predictor" />;
};
