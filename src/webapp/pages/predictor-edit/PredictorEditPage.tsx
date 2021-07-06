import { useSnackbar } from "@eyeseetea/d2-ui-components";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { Predictor } from "../../../domain/entities/Predictor";
import i18n from "../../../locales";
import { generateUid } from "../../../utils/uid";
import PageHeader from "../../components/page-header/PageHeader";
import { PredictorEditWizard } from "../../components/predictor-edit-wizard/PredictorEditWizard";
import { useAppContext } from "../../contexts/app-context";

export interface PredictorEditPageProps {
    type: "new" | "edit";
    id?: string;
}

export const PredictorEditPage: React.FC<PredictorEditPageProps> = ({ type, id }) => {
    const { compositionRoot } = useAppContext();
    const location = useLocation<{ predictor?: Predictor }>();
    const snackbar = useSnackbar();

    const [predictor, setPredictor] = useState<Partial<Predictor> | undefined>(location.state?.predictor);

    const isValidEdit = id !== undefined || location.state?.predictor !== undefined;
    const title = type === "edit" && isValidEdit ? i18n.t("Edit predictor") : i18n.t("New predictor");

    useEffect(() => {
        if (predictor !== undefined) return;
        else if (id === undefined) {
            setPredictor({ id: generateUid() });
            return;
        }

        compositionRoot.usecases
            .get(_.compact([id]))
            .toPromise()
            .then(([predictor]) => {
                if (!predictor) snackbar.error(i18n.t("Unable to load predictor {{id}}", { id }));
                else setPredictor(predictor);
            });
    }, [compositionRoot, id, predictor, setPredictor, snackbar]);

    return (
        <Wrapper>
            <PageHeader onBackClick={() => {}} title={title} />

            {predictor !== undefined ? <PredictorEditWizard predictor={predictor} /> : null}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    margin: 20px 30px;
`;
