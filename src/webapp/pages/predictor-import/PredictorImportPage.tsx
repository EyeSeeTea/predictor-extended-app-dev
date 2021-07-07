import React from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import { Predictor } from "../../../domain/entities/Predictor";
import i18n from "../../../locales";
import { PageHeader } from "../../components/page-header/PageHeader";
import { useAppContext } from "../../contexts/app-context";
import { useFuture } from "../../hooks/useFuture";
import { useGoBack } from "../../hooks/useGoBack";

export const PredictorImportPage: React.FC = () => {
    const { compositionRoot } = useAppContext();
    const goBack = useGoBack();

    const { data: predictors } = useFuture(compositionRoot.usecases.list, []);

    return (
        <React.Fragment>
            <PageHeader onBackClick={goBack} title={i18n.t("Import predictors")} />
            <div style={{ height: "89vh" }}>
                <AutoSizer>
                    {({ height, width }) => (
                        <List
                            height={height}
                            width={width}
                            itemData={predictors?.objects ?? []}
                            itemCount={predictors?.pager.total ?? 0}
                            itemSize={100}
                        >
                            {Row}
                        </List>
                    )}
                </AutoSizer>
            </div>
        </React.Fragment>
    );
};

const Row = React.memo(({ index, style, data }: { index: number; style: object; data: Predictor[] }) => (
    <div style={style}>
        <h3>Predictor #{index + 1}</h3>
        {data[index]?.name}
    </div>
));
