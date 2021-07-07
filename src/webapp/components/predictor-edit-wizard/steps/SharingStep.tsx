import React, { useState, useCallback } from "react"; // { useCallback }
import styled from "styled-components";
import { ShareUpdate, Sharing } from "@eyeseetea/d2-ui-components";
import { defaultPredictor, Predictor } from "../../../../domain/entities/Predictor";

import i18n from "@eyeseetea/d2-ui-components/locales";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../../contexts/app-context";
import { useFuture } from "../../../hooks/useFuture";

export const SharingStep: React.FC = () => {
    const params: { type: string, id: string } = useParams();

    console.log(params?.id);
    const { compositionRoot } = useAppContext();
    const { data: predictorOptions = [] } = useFuture(() => {
        return compositionRoot.usecases
            .get([params.id]);
    }, []);
    console.log(predictorOptions);
    const [statePredictor, updateStatePredictor] = useState<Predictor>(predictorOptions[0] ?? defaultPredictor);


    const search = useCallback((query: string) => compositionRoot.usecases.searchUsers(query), [compositionRoot]);
    const onChange = useCallback((update: Parameters<typeof updateStatePredictor>[0]) => {
        updateStatePredictor(update);
    }, []);

   const setModuleSharing = useCallback(
        ({ publicAccess, userAccesses, userGroupAccesses }: ShareUpdate) => {
            onChange(predictor => {
                return {
                    ...predictor,
                    publicAccess: publicAccess ?? predictor.publicAccess,
                    userAccesses: userAccesses ? userAccesses : predictor.userAccesses,
                    userGroupAccesses: userGroupAccesses
                        ? userGroupAccesses
                        : predictor.userGroupAccesses,
                };
            });
            return Promise.resolve();
        },
        [onChange]);
    return (
        <React.Fragment>
            <Sharing
                meta={{
                    meta: { allowPublicAccess: true, allowExternalAccess: false },
                    object: {
                        id: statePredictor.id,
                        displayName: statePredictor.name,
                        publicAccess: statePredictor.publicAccess,
                        userAccesses: statePredictor.userAccesses,
                        userGroupAccesses: statePredictor.userGroupAccesses,
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

