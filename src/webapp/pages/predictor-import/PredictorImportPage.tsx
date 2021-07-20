import { Button, ButtonStrip, CenteredContent, NoticeBox } from "@dhis2/ui";
import { Paper } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import _ from "lodash";
import { IconButton } from "material-ui";
import React, { useCallback, useState } from "react";
import { Form, useForm } from "react-final-form";
import { Redirect, useLocation } from "react-router";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeGrid as Grid } from "react-window";
import styled from "styled-components";
import { MetadataResponse } from "../../../domain/entities/Metadata";
import { Predictor } from "../../../domain/entities/Predictor";
import i18n from "../../../locales";
import { ImportSummary } from "../../components/import-summary/ImportSummary";
import { PageHeader } from "../../components/page-header/PageHeader";
import {
    getPredictorFieldName,
    predictorFormFields,
    RenderPredictorImportField,
} from "../../components/predictor-form/PredictorForm";
import { useAppContext } from "../../contexts/app-context";
import { useGoBack } from "../../hooks/useGoBack";

const rowHeight = (index: number) => (index === 0 ? 30 : 70);
const columnWidth = (index: number) => (index === 0 ? 50 : 250);

export const PredictorImportPage: React.FC = () => {
    const { compositionRoot } = useAppContext();
    const goBack = useGoBack();

    const location = useLocation<{ predictors: Predictor[] }>();
    const [predictors] = React.useState<Predictor[]>(location.state?.predictors ?? []);
    const [summary, setSummary] = useState<MetadataResponse[]>();

    const goHome = useCallback(() => goBack(true), [goBack]);

    const onSubmit = useCallback(
        async ({ predictors }: { predictors: Predictor[] }) => {
            const { data = [], error } = await compositionRoot.predictors.save(predictors).runAsync();
            if (error) return error ?? i18n.t("Network error");

            setSummary(data);
        },
        [compositionRoot]
    );

    if (predictors.length === 0) return <Redirect to="/" />;

    return (
        <Wrapper>
            <PageHeader onBackClick={goBack} title={i18n.t("Import predictors")} />

            {summary ? <ImportSummary results={summary} onClose={() => setSummary(undefined)} /> : null}

            <Container>
                <Form<{ predictors: Predictor[] }>
                    autocomplete="off"
                    onSubmit={onSubmit}
                    initialValues={{ predictors }}
                    render={({ handleSubmit, values, submitError }) => (
                        <StyledForm onSubmit={handleSubmit}>
                            <MaxHeight>
                                <AutoSizer>
                                    {({ height, width }) => (
                                        <Grid
                                            height={height}
                                            width={width}
                                            rowCount={values.predictors.length + 1}
                                            columnCount={predictorFormFields.length + 1}
                                            estimatedColumnWidth={250}
                                            estimatedRowHeight={70}
                                            rowHeight={rowHeight}
                                            columnWidth={columnWidth}
                                        >
                                            {Row}
                                        </Grid>
                                    )}
                                </AutoSizer>
                            </MaxHeight>

                            {submitError && (
                                <NoticeBox title={i18n.t("Error saving predictors")} error={true}>
                                    {submitError}
                                </NoticeBox>
                            )}

                            <ButtonsRow middle>
                                <Button type="submit" primary>
                                    {i18n.t("Save")}
                                </Button>

                                <Button type="reset" onClick={goHome}>
                                    {i18n.t("Close")}
                                </Button>
                            </ButtonsRow>
                        </StyledForm>
                    )}
                />
            </Container>
        </Wrapper>
    );
};

const MaxHeight = styled.div`
    height: 95%;
`;

const ButtonsRow = styled(ButtonStrip)`
    padding: 20px;

    button:focus::after {
        border-color: transparent !important;
    }
`;

const Row: React.FC<RowItemProps & { style: object }> = ({ style, ...props }) => (
    <div style={style}>
        <RowItem {...props} />
    </div>
);

interface RowItemProps {
    columnIndex: number;
    rowIndex: number;
}

const RowItem: React.FC<RowItemProps> = ({ columnIndex, rowIndex }) => {
    const form = useForm<{ predictors: Predictor[] }>();

    const headerRow = rowIndex === 0;
    const deleteRow = columnIndex === 0;
    const row = rowIndex - 1;
    const field = predictorFormFields[columnIndex - 1];

    const removeRow = useCallback(() => {
        const original = form.getState().values.predictors;
        const predictors = [...original.slice(0, row), ...original.slice(row + 1)];
        form.change("predictors", predictors);
    }, [form, row]);

    if (deleteRow) {
        return headerRow ? null : (
            <CenteredContent>
                <IconButton tooltip={i18n.t("Delete")} tooltipPosition="top-center" onClick={removeRow}>
                    <Delete />
                </IconButton>
            </CenteredContent>
        );
    }

    if (!field) return null;

    if (headerRow) {
        return (
            <CenteredContent>
                <Title>{getPredictorFieldName(field)}</Title>
            </CenteredContent>
        );
    }

    return (
        <Item>
            <RenderPredictorImportField row={row} field={field} />
        </Item>
    );
};

const Wrapper = styled.div`
    margin: 20px;
`;

const StyledForm = styled.form`
    height: 71vh;
`;

const Container = styled(Paper)`
    margin: 20px;
    padding: 40px;
`;

const Item = styled.div`
    margin: 4px 0;
    padding: 10px;
`;

const Title = styled.b``;
