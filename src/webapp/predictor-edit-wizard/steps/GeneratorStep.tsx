import { InputFieldFF } from "@dhis2/ui";
import _ from "lodash";
import React, { useCallback } from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { ExpressionDialog } from "../../components/expression-dialog/ExpressionDialog";
import { FormField } from "../../components/form/fields/FormField";
import { useAppContext } from "../../contexts/app-context";

export const GeneratorStep: React.FC = () => {
    const { compositionRoot } = useAppContext();

    const validateExpression = useCallback(
        async (formula: string) =>
            compositionRoot.usecases.validateExpression("predictor-formula", formula).toPromise(),
        [compositionRoot]
    );

    return (
        <React.Fragment>
            <Row>
                <label>{i18n.t("Generator description (*)")}</label>
                <FormField name="name" component={InputFieldFF} placeholder={i18n.t("Generator description")} />
            </Row>

            <Row>
                <label>{i18n.t("Generator (*)")}</label>
                <ExpressionDialog validateExpression={validateExpression} expressionType="predictor" />
            </Row>
        </React.Fragment>
    );
};

const Row = styled.div`
    margin: 20px 0;
`;
