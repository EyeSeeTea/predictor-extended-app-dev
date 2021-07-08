import React, { useCallback } from "react";
import styled from "styled-components";
import { ShareUpdate, Sharing } from "@eyeseetea/d2-ui-components";

import i18n from "@eyeseetea/d2-ui-components/locales";
import { useAppContext } from "../../../contexts/app-context";
import { PredictorEditWizardProps } from "../PredictorEditWizard";

export const SharingStep: React.FC<PredictorEditWizardProps> = ({
    predictor,
    onChange,
}: PredictorEditWizardProps) => {
    const { compositionRoot } = useAppContext();

    const search = useCallback(async (query: string) => 
    {
        const searchResult = await compositionRoot.usecases.searchUsers(query)
        const resultToReturn = {
            users: searchResult,
            userGroups: []
        }
        return resultToReturn;
    }, [compositionRoot]);

    const setModuleSharing = useCallback(
        ({ publicAccess, userAccesses, userGroupAccesses }: ShareUpdate) => {
            onChange(predictor => {
                return {
                    ...predictor,
                    publicAccess: publicAccess ?? predictor.publicAccess,
                    userAccesses: userAccesses ? userAccesses : predictor.userAccesses,
                    userGroupAccesses: userGroupAccesses ? userGroupAccesses : predictor.userGroupAccesses,
                };
            });
            return Promise.resolve();
        },
        [onChange]
    );
    return (
        <React.Fragment>
            <Sharing
                meta={{
                    meta: { allowPublicAccess: true, allowExternalAccess: false },
                    object: {
                        id: predictor.id || "",
                        displayName: predictor.name,
                        publicAccess: predictor.publicAccess,
                        userAccesses: predictor.userAccesses,
                        userGroupAccesses: predictor.userGroupAccesses,
                    },
                }}
                showOptions={{
                    title: false,
                    dataSharing: false,
                    publicSharing: true,
                    externalSharing: false,
                    permissionPicker: true,
                }}
                onChange={setModuleSharing}
                onSearch={search}
            />

            <Footer>
                {i18n.t("Note: The sharing settings are only applied to the current predictor", { nsSeparator: false })}
            </Footer>
        </React.Fragment>
    );
};

const Footer = styled.div`
    margin-top: 10px;
    margin-bottom: 15px;
    font-size: 1.1.em;
    text-align: left;
`;
