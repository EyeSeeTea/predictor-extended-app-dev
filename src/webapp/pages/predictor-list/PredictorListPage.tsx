import {
    DatePicker,
    MultipleDropdown,
    TablePagination,
    TableSorting,
    useLoading,
    useSnackbar,
} from "@eyeseetea/d2-ui-components";
import { ArrowDownward, ArrowUpward, Delete, Edit, QueuePlayNext, Sync } from "@material-ui/icons";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { FileRejection } from "react-dropzone";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { MetadataResponse } from "../../../domain/entities/Metadata";
import { Predictor } from "../../../domain/entities/Predictor";
import { ListPredictorsFilters } from "../../../domain/repositories/PredictorRepository";
import i18n from "../../../locales";
import { formatDate } from "../../../utils/dates";
import { Dropzone, DropzoneRef } from "../../components/dropzone/Dropzone";
import { ImportSummary } from "../../components/import-summary/ImportSummary";
import { Pager, TableConfig, useObjectsTable } from "../../components/objects-list/objects-list-hooks";
import { ObjectsList } from "../../components/objects-list/ObjectsList";
import { useAppContext } from "../../contexts/app-context";
import { useFuture } from "../../hooks/useFuture";
import { useQueryState } from "../../hooks/useQueryState";
import { useReload } from "../../hooks/useReload";

export const PredictorListPage: React.FC = () => {
    const { compositionRoot } = useAppContext();
    const loading = useLoading();
    const snackbar = useSnackbar();
    const history = useHistory();

    const fileRef = useRef<DropzoneRef>(null);

    const [state, setState] = useQueryState<ListPredictorsFilters>({});
    const [response, setResponse] = useState<MetadataResponse>();
    const [reloadKey, reload] = useReload();

    const { data: predictorGroupOptions = [] } = useFuture(() => {
        return compositionRoot.usecases
            .getGroups()
            .map(groups => groups.map(({ id, name }) => ({ value: id, text: name })));
    });

    const { data: dataElementsOptions = [] } = useFuture(() => {
        return compositionRoot.usecases
            .getDataElements()
            .map(dataElements => dataElements.map(({ id, name }) => ({ value: id, text: name })));
    });

    const runPredictors = useCallback(
        async (ids: string[]) => {
            loading.show(true, i18n.t("Running predictors"));
            const results = await compositionRoot.usecases.run(ids).toPromise();
            snackbar.info(results.map((response: any) => response?.message).join("\n"));
            loading.reset();
        },
        [compositionRoot, loading, snackbar]
    );

    const exportPredictors = useCallback(
        async (ids: string[]) => {
            loading.show(true, i18n.t("Exporting predictors"));
            await compositionRoot.usecases.export(ids);
            loading.reset();
        },
        [compositionRoot, loading]
    );

    const editPredictor = useCallback(
        async (ids: string[]) => {
            if (ids[0] === undefined) return;
            history.push(`/edit/${ids[0]}`);
        },
        [history]
    );

    const deletePredictor = useCallback(
        async (ids: string[]) => {
            loading.show(true, i18n.t("Deleting predictors"));
            await compositionRoot.usecases.delete(ids);
            loading.reset();
            reload();
        },
        [compositionRoot, loading, reload]
    );

    const openImportDialog = useCallback(async () => {
        fileRef.current?.openDialog();
    }, [fileRef]);

    const placeholderAction = useCallback(() => {
        snackbar.info("Not implemented yet");
    }, [snackbar]);

    const baseConfig = useMemo((): TableConfig<Predictor> => {
        return {
            columns: [
                {
                    name: "id",
                    text: i18n.t("Identifier"),
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
                {
                    name: "sampleSkipTest",
                    text: i18n.t("Sample skip test"),
                    sortable: false,
                    getValue: ({ sampleSkipTest }: Predictor) => {
                        return sampleSkipTest?.expression ?? "-";
                    },
                },
                { name: "lastUpdated", text: i18n.t("Last Updated"), sortable: true },
            ],
            details: [
                { name: "id", text: i18n.t("Identifier") },
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
                    onClick: editPredictor,
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
                    multiple: false,
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
    }, [runPredictors, exportPredictors, editPredictor, deletePredictor, openImportDialog, placeholderAction]);

    const refreshRows = useCallback(
        (
            search: string,
            paging: TablePagination,
            sorting: TableSorting<Predictor>
        ): Promise<{ objects: Predictor[]; pager: Pager }> => {
            console.debug("Reloading", reloadKey);
            return compositionRoot.usecases.list({ ...state, search }, paging, sorting).toPromise();
        },
        [compositionRoot, state, reloadKey]
    );

    const tableProps = useObjectsTable(baseConfig, refreshRows);

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

            //@ts-ignore TODO FIXME: Add validation
            const response = await compositionRoot.usecases.import(predictors).toPromise();
            setResponse(response);

            loading.reset();
            tableProps.reload();
        },
        [compositionRoot, tableProps, loading, snackbar]
    );

    const onChangeFilter = useCallback(
        (update: Partial<ListPredictorsFilters>) => {
            if (tableProps.onChangeSearch) {
                tableProps.onChangeSearch(update.search ?? "");
            }

            setState(state => ({ ...state, ...update }));
        },
        [setState, tableProps]
    );

    const onChangeGroupFilter = useCallback(
        (predictorGroups: string[]) => onChangeFilter({ predictorGroups }),
        [onChangeFilter]
    );

    const onChangeOutputFilter = useCallback(
        (dataElements: string[]) => onChangeFilter({ dataElements }),
        [onChangeFilter]
    );

    const onChangeLastUpdatedFilter = useCallback(
        (lastUpdated: { toDate(): Date } | null) =>
            onChangeFilter({
                lastUpdated: lastUpdated ? formatDate(lastUpdated.toDate()) : undefined,
            }),
        [onChangeFilter]
    );

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
                        <Filter
                            items={predictorGroupOptions}
                            values={state.predictorGroups ?? []}
                            onChange={onChangeGroupFilter}
                            label={i18n.t("Predictor groups")}
                        />

                        <Filter
                            items={dataElementsOptions}
                            values={state.dataElements ?? []}
                            onChange={onChangeOutputFilter}
                            label={i18n.t("Output data element")}
                        />

                        <DatePicker
                            placeholder={i18n.t("Last updated date")}
                            value={state.lastUpdated ?? null}
                            isFilter={true}
                            onChange={onChangeLastUpdatedFilter}
                        />
                    </React.Fragment>
                </ObjectsList>
            </Dropzone>

            {response && <ImportSummary results={[response]} onClose={() => setResponse(undefined)} />}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    padding: 20px;
    height: 100%;
`;

const Filter = styled(MultipleDropdown)`
    min-width: 200px;
`;
