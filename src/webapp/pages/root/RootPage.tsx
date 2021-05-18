import { HashRouter, Route, Switch } from "react-router-dom";
import { PredictorEditPage } from "../predictor-edit/PredictorEditPage";
import { PredictorListPage } from "../predictor-list/PredictorListPage";

const Root = () => {
    return (
        <HashRouter>
            <Switch>
                <Route path={"/edit"} render={() => <PredictorEditPage />} />
                <Route render={() => <PredictorListPage />} />
            </Switch>
        </HashRouter>
    );
};

export default Root;
