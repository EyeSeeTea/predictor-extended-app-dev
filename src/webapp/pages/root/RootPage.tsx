import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { PredictorList } from "../predictor-list/PredictorList";

const Root = () => {
    return (
        <HashRouter>
            <Switch>
                <Route render={() => <PredictorList />} />
            </Switch>
        </HashRouter>
    );
};

export default Root;
