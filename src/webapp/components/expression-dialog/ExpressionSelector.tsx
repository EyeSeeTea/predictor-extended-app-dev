import { LinearProgress, TextField } from "@material-ui/core";
import React, { useState } from "react";
import i18n from "../../../locales";

const styles = {
    list: {
        width: "100%",
        outline: "none",
        border: "none",
        padding: "0rem 1rem",
    },
    pagination: {
        //float: "right"
    },
    textField: {
        marginLeft: "1rem",
    },
};

interface DataElementOperandSelectorProps {
    dataElementOperandSelectorActions?: object;
    dataElementOperandStore?: object;
    onSelect: (...args: any[]) => any;
    listStyle?: object;
}

interface DataElementOperandSelectorState {
    isLoading: boolean;
    pager: { hasNextPage: () => boolean; hasPreviousPage: () => boolean };
}

export const ExpressionSelector: React.FC<DataElementOperandSelectorProps> = () => {
    const [state] = useState<DataElementOperandSelectorState>({
        isLoading: true,
        pager: {
            hasNextPage: () => false,
            hasPreviousPage: () => false,
        },
    });

    return (
        <div className="data-element-operand-selector">
            <div style={styles.pagination}>
                {/**<Pagination
            hasNextPage={() => state.pager.hasNextPage()}
            hasPreviousPage={() => state.pager.hasPreviousPage()}
            onNextPageClick={getNextPage}
            onPreviousPageClick={getPreviousPage}
          />**/}
            </div>
            <TextField style={styles.textField} label={i18n.t("Search by name")} onChange={() => {}} />
            {state.isLoading && <LinearProgress />}
            {/**<ListSelectAsync
          size={12}
          onItemDoubleClick={onSelect}
          source={storeObservable}
          listStyle={listStyle}
        />**/}
        </div>
    );
};
