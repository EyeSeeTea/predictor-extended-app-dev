import { Feedback } from "@eyeseetea/feedback-component";
import { useConfig } from "@dhis2/app-runtime";
import { LoadingProvider, SnackbarProvider } from "@eyeseetea/d2-ui-components";
import { MuiThemeProvider } from "@material-ui/core/styles";
import _ from "lodash";
import OldMuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import React, { useEffect, useState } from "react";

import { appConfig } from "../../../app-config";
import { getCompositionRoot } from "../../../compositionRoot";
import { D2Api } from "../../../types/d2-api";
import { AppContext, AppContextState } from "../../contexts/app-context";
import { Router } from "../../pages/Router";
import { HeaderBar } from "../header-bar/HeaderBar";
import { useMigrations } from "../migrations/hooks";
import Migrations from "../migrations/Migrations";
import Share from "../share/Share";
import "./App.css";
import muiThemeLegacy from "./themes/dhis2-legacy.theme";
import { muiTheme } from "./themes/dhis2.theme";

type D2 = object;

const App = ({ api, d2 }: { api: D2Api; d2: D2 }) => {
    const { baseUrl } = useConfig();

    const [showShareButton, setShowShareButton] = useState(false);
    const [loading, setLoading] = useState(true);
    const [appContext, setAppContext] = useState<AppContextState | null>(null);
    const migrations = useMigrations(appContext);

    useEffect(() => {
        async function setup() {
            const compositionRoot = getCompositionRoot({ url: baseUrl });
            const currentUser = await compositionRoot.users.getCurrent();

            setAppContext({ api, compositionRoot, currentUser });
            setShowShareButton(_(appConfig).get("appearance.showShareButton") || false);
            setLoading(false);
        }
        setup();
    }, [d2, api, baseUrl]);

    if (loading) return null;

    if (migrations.state.type === "pending") {
        return (
            <AppContext.Provider value={appContext}>
                <Migrations migrations={migrations} />
            </AppContext.Provider>
        );
    }

    return (
        <MuiThemeProvider theme={muiTheme}>
            <OldMuiThemeProvider muiTheme={muiThemeLegacy}>
                <SnackbarProvider>
                    <LoadingProvider>
                        <HeaderBar appName={"Data Management"} />

                        <div id="app" className="content">
                            <AppContext.Provider value={appContext}>
                                <Router />
                            </AppContext.Provider>
                        </div>

                        <Share visible={showShareButton} />
                        {appContext && (
                            <Feedback options={appConfig.feedback} username={appContext.currentUser.username} />
                        )}
                    </LoadingProvider>
                </SnackbarProvider>
            </OldMuiThemeProvider>
        </MuiThemeProvider>
    );
};

export default React.memo(App);
