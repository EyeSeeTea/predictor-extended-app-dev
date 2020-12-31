import { PaginationOptions, TableAction, TableColumn, TableSorting } from "d2-ui-components";
import _ from "lodash";
import React, { useMemo } from "react";
import { Predictor } from "../../../domain/entities/Predictor";
import i18n from "../../../locales";
import { TableConfig, useObjectsTable } from "../../components/objects-list/objects-list-hooks";
import { ObjectsList } from "../../components/objects-list/ObjectsList";
import { useAppContext } from "../../contexts/app-context";

export const PredictorList: React.FC = () => {
    const { compositionRoot } = useAppContext();

    const baseConfig = useMemo(() => {
        return getBaseListConfig();
    }, []);

    const rows = React.useMemo(
        () => async () => {
            return compositionRoot.predictors.get();
        },
        [compositionRoot]
    );

    const tableProps = useObjectsTable(baseConfig, rows);

    return <ObjectsList<Predictor> {...tableProps} />;
};

function getBaseListConfig(): TableConfig<Predictor> {
    const paginationOptions: PaginationOptions = {
        pageSizeOptions: [10, 20, 50],
        pageSizeInitialValue: 20,
    };

    const initialSorting: TableSorting<Predictor> = {
        field: "name" as const,
        order: "asc" as const,
    };

    const columns: TableColumn<Predictor>[] = [
        { name: "name", text: i18n.t("Name"), sortable: true },
        { name: "code", text: i18n.t("Code"), sortable: true },
        { name: "lastUpdated", text: i18n.t("Last Updated"), sortable: true, hidden: true },
        { name: "created", text: i18n.t("Created"), sortable: true, hidden: true },
    ];

    const details = columns;

    const actions: TableAction<Predictor>[] = _.compact([
        {
            name: "details",
            text: i18n.t("Details"),
            multiple: false,
            primary: true,
        },
    ]);

    const searchBoxLabel = i18n.t("Search by name or code");

    return { columns, details, actions, initialSorting, paginationOptions, searchBoxLabel };
}
