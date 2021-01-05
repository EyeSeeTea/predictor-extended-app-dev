import { ArrowDownward, Delete, Edit, QueuePlayNext, Sync } from "@material-ui/icons";
import { useLoading, useSnackbar } from "d2-ui-components";
import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { Predictor } from "../../../domain/entities/Predictor";
import i18n from "../../../locales";
import { TableConfig, useObjectsTable } from "../../components/objects-list/objects-list-hooks";
import { ObjectsList } from "../../components/objects-list/ObjectsList";
import { useAppContext } from "../../contexts/app-context";
import { useQueryState } from "../../hooks/useQueryState";

export const PredictorListPage: React.FC = () => {
    const { compositionRoot } = useAppContext();
    const loading = useLoading();
    const snackbar = useSnackbar();

    const [state, setState] = useQueryState<{ search: string }>({ search: "" });

    const runPredictors = useCallback(
        async (predictors: string[]) => {
            loading.show(true, i18n.t("Running predictors"));
            await compositionRoot.predictors.run(predictors);
            loading.reset();
        },
        [compositionRoot, loading]
    );

    const placeholderAction = useCallback(() => {
        snackbar.info("Not implemented yet");
    }, [snackbar]);

    const baseConfig: TableConfig<Predictor> = useMemo(() => {
        return {
            columns: [
                {
                    name: "sectionSequence",
                    text: i18n.t("Section sequence"),
                    sortable: true,
                    hidden: true,
                },
                {
                    name: "variableSequence",
                    text: i18n.t("Variable sequence"),
                    sortable: true,
                    hidden: true,
                },
                { name: "name", text: i18n.t("Name"), sortable: true },
                { name: "output", text: i18n.t("Output data element"), sortable: true },
                { name: "outputCombo", text: i18n.t("Output category option"), sortable: true },
                { name: "description", text: i18n.t("Description"), sortable: false },
                {
                    name: "generator",
                    text: i18n.t("Formula"),
                    sortable: false,
                    getValue: ({ generator }: Predictor) => {
                        return generator.expression;
                    },
                },
                { name: "predictorGroups", text: i18n.t("Predictor groups"), sortable: true },
                { name: "periodType", text: i18n.t("Period type"), sortable: true },
                { name: "lastUpdated", text: i18n.t("Last Updated"), sortable: true },
            ],
            details: [
                { name: "code", text: i18n.t("Code") },
                { name: "name", text: i18n.t("Name") },
                { name: "description", text: i18n.t("Description") },
                { name: "output", text: i18n.t("Output data element") },
                { name: "outputCombo", text: i18n.t("Output data element") },
                { name: "lastUpdated", text: i18n.t("Last updated") },
                { name: "lastUpdatedBy", text: i18n.t("Last updated by") },
                { name: "created", text: i18n.t("Created") },
                { name: "user", text: i18n.t("Created by") },
            ],
            actions: [
                {
                    name: "details",
                    text: i18n.t("Details"),
                    multiple: false,
                    primary: true,
                },
                {
                    name: "edit",
                    text: i18n.t("Edit"),
                    multiple: false,
                    onClick: placeholderAction,
                    icon: <Edit />,
                },
                {
                    name: "delete",
                    text: i18n.t("Delete"),
                    multiple: true,
                    onClick: placeholderAction,
                    icon: <Delete />,
                },
                {
                    name: "execute",
                    text: i18n.t("Run"),
                    multiple: true,
                    onClick: runPredictors,
                    icon: <QueuePlayNext />,
                },
                {
                    name: "export",
                    text: i18n.t("Export"),
                    multiple: true,
                    onClick: placeholderAction,
                    icon: <ArrowDownward />,
                },
                {
                    name: "validate",
                    text: i18n.t("Validate"),
                    multiple: true,
                    onClick: placeholderAction,
                    icon: <Sync />,
                },
            ],
            initialSorting: {
                field: "name",
                order: "asc",
            },
            paginationOptions: {
                pageSizeOptions: [10, 25, 50, 100],
                pageSizeInitialValue: 25,
            },
            searchBoxLabel: i18n.t("Search by name"),
        };
    }, [runPredictors, placeholderAction]);

    const tableProps = useObjectsTable(baseConfig, compositionRoot.predictors.get);

    const onChangeSearch = useCallback(
        (search: string) => {
            if (tableProps.onChangeSearch) tableProps.onChangeSearch(search);
            setState(state => ({ ...state, search }));
        },
        [setState, tableProps]
    );

    return (
        <Wrapper>
            <ObjectsList<Predictor>
                {...tableProps}
                onChangeSearch={onChangeSearch}
                initialSearch={state.search}
            />
        </Wrapper>
    );
};

const Wrapper = styled.div`
    margin: 20px;
`;
