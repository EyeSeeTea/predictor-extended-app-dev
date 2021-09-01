import { Button, CenteredContent } from "@dhis2/ui";
import { useLoading, useSnackbar } from "@eyeseetea/d2-ui-components";
import i18n from "@eyeseetea/d2-ui-components/locales";
import { Paper } from "@material-ui/core";
import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { PeriodObject } from "../../../domain/entities/SchedulerPeriod";
import { Settings } from "../../../domain/entities/Settings";
import { UpdateMethod } from "../../../utils/utils";
import { Dropdown, DropdownOption } from "../../components/dropdown/Dropdown";
import { PageHeader } from "../../components/page-header/PageHeader";
import { PeriodPicker } from "../../components/period-picker/PeriodPicker";
import { useAppContext } from "../../contexts/app-context";
import { useGoBack } from "../../hooks/useGoBack";

export const SettingsPage: React.FC = () => {
    const { compositionRoot } = useAppContext();
    const goBack = useGoBack();
    const snackbar = useSnackbar();
    const loading = useLoading();

    const [settings, setSettings] = useState<Settings>();

    const saveSettings = useCallback(() => {
        if (!settings) return;
        loading.show(true, i18n.t("Saving settings..."));

        compositionRoot.settings.save(settings).run(
            () => loading.reset(),
            error => {
                loading.reset();
                snackbar.error(error);
            }
        );
    }, [compositionRoot, settings, snackbar, loading]);

    const updateEnabled = useCallback((enabled: Enabled) => {
        setSettings(settings => {
            if (!settings) return;
            return {
                ...settings,
                scheduling:
                    enabled === "yes"
                        ? { ...settings.scheduling, enabled: true, period: { type: "THIS_MONTH" } }
                        : { ...settings.scheduling, enabled: false },
            };
        });
    }, []);

    const updatePeriod: UpdateMethod<PeriodObject> = useCallback(update => {
        setSettings(settings => {
            if (!settings) return;

            const oldPeriod: PeriodObject = settings.scheduling.enabled
                ? settings.scheduling.period
                : { type: "THIS_MONTH" };

            const period = _.isFunction(update) ? update(oldPeriod) : update;

            return { ...settings, scheduling: { ...settings.scheduling, enabled: true, period } };
        });
    }, []);

    useEffect(() => {
        compositionRoot.settings.get().run(
            settings => {
                setSettings(settings);
            },
            error => {
                snackbar.error(error);
            }
        );
    }, [compositionRoot, snackbar]);

    if (!settings) return null;

    return (
        <Wrapper>
            <PageHeader onBackClick={goBack} title={i18n.t("Settings")} />

            <Container>
                <h3>{i18n.t("Scheduling")}</h3>

                <Dropdown<Enabled>
                    items={enabledOptions}
                    value={settings.scheduling.enabled ? "yes" : "no"}
                    onChange={updateEnabled}
                    hideEmpty={true}
                />

                {settings.scheduling.enabled ? (
                    <PeriodPicker period={settings.scheduling.period} onChange={updatePeriod} />
                ) : null}

                <CenteredContent>
                    <SaveButton primary={true} onClick={saveSettings}>
                        {i18n.t("Save")}
                    </SaveButton>
                </CenteredContent>
            </Container>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    margin: 20px 30px;
`;

const Container = styled(Paper)`
    margin: 10px;
    padding: 45px;
`;

const SaveButton = styled(Button)`
    margin-top: 20px;
`;

type Enabled = "yes" | "no";

const enabledOptions: DropdownOption<Enabled>[] = [
    { id: "yes", name: i18n.t("Yes") },
    { id: "no", name: i18n.t("No") },
];
