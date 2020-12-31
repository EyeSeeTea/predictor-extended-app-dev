import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { PredictorListPage } from "../predictor-list/PredictorListPage";

const Root = () => {
    return (
        <HashRouter>
            <Switch>
                <Route render={() => <PredictorListPage />} />
            </Switch>
        </HashRouter>
    );
};

export default Root;
