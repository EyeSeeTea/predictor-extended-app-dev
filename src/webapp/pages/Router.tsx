import { HashRouter, Route, Switch } from "react-router-dom";
import { PredictorEditPage } from "./predictor-edit/PredictorEditPage";
import { PredictorImportPage } from "./predictor-import/PredictorImportPage";
import { PredictorListPage } from "./predictor-list/PredictorListPage";

export const Router = () => {
    return (
        <HashRouter>
            <Switch>
                <Route
                    path="/:type(new|edit)/:id"
                    render={({ match }) => <PredictorEditPage type={match.params.type} id={match.params.id} />}
                />

                <Route path="/import" render={() => <PredictorImportPage />} />

                <Route render={() => <PredictorListPage />} />
            </Switch>
        </HashRouter>
    );
};
