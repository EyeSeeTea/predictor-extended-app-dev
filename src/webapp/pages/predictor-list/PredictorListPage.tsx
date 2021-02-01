import { ArrowDownward, ArrowUpward, Delete, Edit, QueuePlayNext, Sync } from "@material-ui/icons";
import {
    DropdownItem,
    MultipleDropdown,
    TablePagination,
    TableSorting,
    useLoading,
    useSnackbar,
} from "d2-ui-components";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FileRejection } from "react-dropzone";
import styled from "styled-components";
import { Predictor } from "../../../domain/entities/Predictor";
import i18n from "../../../locales";
import { Dropzone, DropzoneRef } from "../../components/dropzone/Dropzone";
import {
    Pager,
    TableConfig,
    useObjectsTable,
} from "../../components/objects-list/objects-list-hooks";
import { ObjectsList } from "../../components/objects-list/ObjectsList";
import { useAppContext } from "../../contexts/app-context";
import { useQueryState } from "../../hooks/useQueryState";

export const PredictorListPage: React.FC = () => {
    const { compositionRoot } = useAppContext();
    const loading = useLoading();
    const snackbar = useSnackbar();

    const fileRef = useRef<DropzoneRef>(null);

    const [state, setState] = useQueryState<Filters>({});
    const [predictorGroupOptions, setPredictorGroupOptions] = useState<DropdownItem[]>([]);

    const runPredictors = useCallback(
        async (ids: string[]) => {
            loading.show(true, i18n.t("Running predictors"));
            await compositionRoot.usecases.run(ids);
            loading.reset();
        },
        [compositionRoot, loading]
    );

    const exportPredictors = useCallback(
        async (ids: string[]) => {
            loading.show(true, i18n.t("Exporting predictors"));
            await compositionRoot.usecases.export(ids);
            loading.reset();
        },
        [compositionRoot, loading]
    );

    const deletePredictor = useCallback(
        async (ids: string[]) => {
            loading.show(true, i18n.t("Deleting predictors"));
            await compositionRoot.usecases.delete(ids); //usecases.delete(id);
            loading.reset();
        },
        [compositionRoot, loading]
    );

    const openImportDialog = useCallback(async () => {
        fileRef.current?.openDialog();
    }, [fileRef]);

    const placeholderAction = useCallback(() => {
        snackbar.info("Not implemented yet");
    }, [snackbar]);

    const handleFileUpload = useCallback(
        async (files: File[], rejections: FileRejection[]) => {
            if (files.length === 0 && rejections.length > 0) {
                snackbar.error(i18n.t("Couldn't read the file because it's not valid"));
                return;
            }

            loading.show(true, i18n.t("Reading files"));
            const { predictors, warnings } = await compositionRoot.usecases.readExcel(files);

            if (warnings && warnings.length > 0) {
                snackbar.warning(warnings.map(({ description }) => description).join("\n"));
            }

            //@ts-ignore TODO FIXME
            await compositionRoot.usecases.import(predictors);
            loading.reset();
        },
        [compositionRoot, loading, snackbar]
    );

    const baseConfig = useMemo((): TableConfig<Predictor> => {
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
                    onClick: deletePredictor, 
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
                    onClick: exportPredictors,
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
            globalActions: [
                {
                    name: "import",
                    text: i18n.t("Import excel"),
                    onClick: openImportDialog,
                    icon: <ArrowUpward />,
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
    }, [runPredictors, exportPredictors, deletePredictor, openImportDialog, placeholderAction]);

    const refreshRows = useCallback(
        (
            search: string,
            paging: TablePagination,
            sorting: TableSorting<Predictor>
        ): Promise<{ objects: Predictor[]; pager: Pager }> => {
            return compositionRoot.usecases.list(
                { search, predictorGroups: state.predictorGroups },
                paging,
                sorting
            );
        },
        [compositionRoot, state]
    );

    const tableProps = useObjectsTable(baseConfig, refreshRows);

    const onChangeFilter = useCallback(
        (update: Partial<Filters>) => {
            if (tableProps.onChangeSearch) {
                tableProps.onChangeSearch(update.search ?? "");
            }

            setState(state => ({ ...state, ...update }));
        },
        [setState, tableProps]
    );

    useEffect(() => {
        compositionRoot.usecases.getGroups().then(groups => {
            const options = groups.map(({ id, name }) => ({ value: id, text: name }));
            setPredictorGroupOptions(options);
        });
    }, [compositionRoot]);

    return (
        <Wrapper>
            <Dropzone
                ref={fileRef}
                accept={"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}
                onDrop={handleFileUpload}
            >
                <ObjectsList<Predictor>
                    {...tableProps}
                    onChangeSearch={search => onChangeFilter({ search })}
                    initialSearch={state.search ?? ""}
                >
                    <React.Fragment>
                        <MultipleDropdown
                            items={predictorGroupOptions}
                            values={state.predictorGroups ?? []}
                            onChange={predictorGroups => onChangeFilter({ predictorGroups })}
                            label={i18n.t("Predictor groups")}
                        />
                    </React.Fragment>
                </ObjectsList>
            </Dropzone>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    padding: 20px;
    height: 100%;
`;

interface Filters {
    search?: string;
    predictorGroups?: string[];
}
