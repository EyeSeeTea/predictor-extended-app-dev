import React, { useMemo } from "react";
import { useCallback } from "react";
import styled from "styled-components";
import { Predictor } from "../../../domain/entities/Predictor";
import i18n from "../../../locales";
import { TableConfig, useObjectsTable } from "../../components/objects-list/objects-list-hooks";
import { ObjectsList } from "../../components/objects-list/ObjectsList";
import { useAppContext } from "../../contexts/app-context";
import { useQueryState } from "../../hooks/useQueryState";

export const PredictorListPage: React.FC = () => {
    const { compositionRoot } = useAppContext();
    const [state, setState] = useQueryState<{ search: string }>({ search: "" });

    const baseConfig = useMemo(() => {
        return buildTableConfig();
    }, []);

    const tableProps = useObjectsTable(baseConfig, compositionRoot.predictors.get);

    const onChangeSearch = useCallback(
        (search: string) => {
            if (tableProps.onChangeSearch) tableProps.onChangeSearch(search);
            setState({ search });
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

function buildTableConfig(): TableConfig<Predictor> {
    return {
        columns: [
            { name: "name", text: i18n.t("Name"), sortable: true },
            { name: "code", text: i18n.t("Code"), sortable: true, hidden: true },
            { name: "output", text: i18n.t("Output data element"), sortable: true },
            { name: "outputCombo", text: i18n.t("Output category option"), sortable: true },
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
}
