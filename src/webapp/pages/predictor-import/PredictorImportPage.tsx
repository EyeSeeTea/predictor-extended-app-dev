import { Paper } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { IconButton } from "material-ui";
import React, { useCallback } from "react";
import { Form, useForm } from "react-final-form";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeGrid as Grid } from "react-window";
import styled from "styled-components";
import { Predictor } from "../../../domain/entities/Predictor";
import i18n from "../../../locales";
import { PageHeader } from "../../components/page-header/PageHeader";
import {
    getPredictorFieldName,
    predictorFormFields,
    RenderPredictorImportField,
} from "../../components/predictor-form/PredictorForm";
import { useAppContext } from "../../contexts/app-context";
import { useFuture } from "../../hooks/useFuture";
import { useGoBack } from "../../hooks/useGoBack";

export const PredictorImportPage: React.FC = () => {
    const { compositionRoot } = useAppContext();
    const goBack = useGoBack();

    const { data: { objects: predictors = [] } = {} } = useFuture(compositionRoot.usecases.list, []);

    return (
        <Wrapper>
            <PageHeader onBackClick={goBack} title={i18n.t("Import predictors")} />
            <Container>
                <Form
                    autocomplete="off"
                    onSubmit={() => {}}
                    initialValues={{ predictors }}
                    render={({ handleSubmit, values }) => (
                        <Wrapper2 onSubmit={handleSubmit}>
                            <AutoSizer>
                                {({ height, width }) => (
                                    <Grid
                                        height={height}
                                        width={width}
                                        rowCount={values.predictors.length + 1}
                                        columnCount={predictorFormFields.length + 1}
                                        rowHeight={index => (index === 0 ? 30 : 70)}
                                        columnWidth={index => (index === 0 ? 50 : 250)}
                                    >
                                        {Row}
                                    </Grid>
                                )}
                            </AutoSizer>
                        </Wrapper2>
                    )}
                />
            </Container>
        </Wrapper>
    );
};

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
            <IconButton tooltip={i18n.t("Delete")} tooltipPosition="top-center" onClick={removeRow}>
                <Delete />
            </IconButton>
        );
    }

    if (!field) return null;

    if (headerRow) {
        return <Title>{getPredictorFieldName(field)}</Title>;
    }

    return (
        <Center>
            <RenderPredictorImportField row={row} field={field} />
        </Center>
    );
};

const Wrapper = styled.div`
    margin: 20px;
`;

const Wrapper2 = styled.form`
    margin: 10px;
    height: 71vh;
`;

const Container = styled(Paper)`
    margin: 20px;
    padding: 40px;
`;

const Center = styled.div`
    margin: 4px 0;
    padding: 10px;
`;

const Title = styled.b``;
