import { TableSorting } from "@eyeseetea/d2-ui-components";
import _ from "lodash";
import { NamedRef } from "../domain/entities/DHIS2";
import { Future, FutureData } from "../domain/entities/Future";
import { Predictor } from "../domain/entities/Predictor";
import {
    ExpressionType,
    ExpressionValidation,
    ListPredictorsFilters,
    PredictorRepository,
} from "../domain/repositories/PredictorRepository";
import { D2Api, MetadataResponse, Pager } from "../types/d2-api";
import { formatDate } from "../utils/dates";
import { PredictorSaveModel } from "./models/PredictorModel";
import { getD2APiFromUrl } from "./utils/d2-api";
import { toFuture } from "./utils/futures";

export class PredictorD2ApiRepository implements PredictorRepository {
    private api: D2Api;

    constructor(baseUrl: string) {
        this.api = getD2APiFromUrl(baseUrl);
    }

    public validateExpression(type: ExpressionType, expression: string): FutureData<ExpressionValidation> {
        return toFuture(this.api.expressions.validate(type, expression)).map(({ message, description, status }) => ({
            message,
            description,
            status,
        }));
    }

    public get(ids: string[]): FutureData<Predictor[]> {
        return toFuture(
            this.api.models.predictors.get({
                filter: { id: { in: ids } },
                paging: false,
                fields: predictorFields,
            })
        ).map(({ objects }) => {
            return objects;
        });
    }

    public list(
        filters?: ListPredictorsFilters,
        paging?: { page: number; pageSize: number },
        sorting?: TableSorting<Predictor>
    ): FutureData<{ pager: Pager; objects: Predictor[] }> {
        const { search, predictorGroups = [], dataElements = [], lastUpdated } = filters ?? {};

        return toFuture(
            this.api.models.predictors.get({
                filter: {
                    name: search ? { token: search } : undefined,
                    "predictorGroups.id": predictorGroups.length > 0 ? { in: predictorGroups } : undefined,
                    "output.id": dataElements.length > 0 ? { in: dataElements } : undefined,
                    lastUpdated: lastUpdated ? { ge: lastUpdated } : undefined,
                },
                page: paging?.page,
                pageSize: paging?.pageSize,
                order: sorting ? `${sorting.field}:${sorting.order}` : undefined,
                fields: predictorFields,
            })
        );
    }

    public getGroups(): FutureData<NamedRef[]> {
        return toFuture(
            this.api.models.predictorGroups.get({ paging: false, fields: { id: true, displayName: true } })
        ).map(({ objects }) => {
            return objects.map(({ id, displayName }) => ({ id, name: displayName }));
        });
    }

    public getOutputDataElements(): FutureData<NamedRef[]> {
        return toFuture(
            this.api.models.predictors.get({ paging: false, fields: { output: { id: true, displayName: true } } })
        ).map(({ objects }) => {
            return _.uniqBy(
                objects.map(({ output }) => ({ id: output.id, name: output.displayName })),
                "id"
            );
        });
    }

    // TODO: Response {"httpStatus":"OK","httpStatusCode":200,"status":"OK","message":"Generated 0 predictions"}
    public run(ids: string[], startDate: Date, endDate: Date): FutureData<any> {
        return Future.futureMap(ids, id =>
            toFuture(
                this.api.post(`/predictors/${id}/run`, {
                    startDate: formatDate(startDate),
                    endDate: formatDate(endDate),
                })
            )
        );
    }

    public save(inputPredictors: Predictor[]): FutureData<MetadataResponse[]> {
        const validations = inputPredictors.map(predictor => PredictorSaveModel.decode(predictor));
        const predictors = _.compact(validations.map(either => either.toMaybe().extract()));
        const errors = _.compact(validations.map(either => either.leftOrDefault("")));
        if (errors.length > 0) {
            return Future.error(errors.join("\n"));
        }

        const savePredictor$ = toFuture(this.api.metadata.post({ predictors }));
        const existingPredictors$ = this.get(predictors.map(({ id }) => id));

        return Future.join2(savePredictor$, existingPredictors$).flatMap(([savePayload, existingPredictors]) =>
            this.getGroupsToSave(inputPredictors, existingPredictors).flatMap(groupsToSave => {
                const groupPayload$ = toFuture(this.api.metadata.post({ predictorGroups: groupsToSave }));
                return groupPayload$.map(groupPayload => [savePayload, groupPayload]);
            })
        );
    }

    public delete(ids: string[]): FutureData<any> {
        return Future.futureMap(ids, id => toFuture(this.api.models.predictors.delete({ id: id })));
    }

    private getGroupsToSave(update: Predictor[], original: Predictor[]) {
        const predictorIds = update.map(({ id }) => id);
        const groupDictionary = _(update)
            .flatMap(({ id, predictorGroups }) => predictorGroups.map(group => ({ id, group })))
            .groupBy(({ group }) => group.id)
            .mapValues(items => items.map(({ id }) => id))
            .value();

        const existingGroupRefs = _.flatMap(original, ({ predictorGroups }) => predictorGroups);
        const newGroupRefs = _.flatMap(update, ({ predictorGroups }) => predictorGroups);
        const allGroupRefs = _.concat(existingGroupRefs, newGroupRefs);

        const groupInfo$ = toFuture(
            this.api.metadata.get({
                predictorGroups: {
                    fields: { $owner: true },
                    filter: { id: { in: _.uniq(allGroupRefs.map(oug => oug.id)) } }, // Review 414
                },
            })
        );

        return groupInfo$.map(({ predictorGroups }) =>
            predictorGroups
                .map(group => {
                    const cleanList = group.predictors.filter(({ id }) => !predictorIds.includes(id));
                    const newItems = groupDictionary[group.id] ?? [];
                    const predictors = [...cleanList, ...newItems.map(id => ({ id }))];

                    return { ...group, predictors };
                })
                .filter(group => {
                    const newIds = group.predictors.map(({ id }) => id);
                    const oldIds =
                        predictorGroups.find(({ id }) => id === group.id)?.predictors.map(({ id }) => id) ?? [];

                    return !_.isEqual(_.sortBy(oldIds), _.sortBy(newIds));
                })
        );
    }
}

const predictorFields = {
    id: true,
    code: true,
    name: true,
    description: true,
    output: { id: true, name: true },
    outputCombo: { id: true, name: true },
    periodType: true,
    annualSampleCount: true,
    generator: {
        expression: true,
        description: true,
        missingValueStrategy: true,
        slidingWindow: true,
    },
    organisationUnitLevels: { id: true, name: true },
    predictorGroups: { id: true, name: true },
    sampleSkipTest: {
        expression: true,
        description: true,
        missingValueStrategy: true,
        slidingWindow: true,
    },
    sequentialSampleCount: true,
    sequentialSkipCount: true,
    lastUpdated: true,
    lastUpdatedBy: { id: true, name: true },
    created: true,
    user: { id: true, name: true },
    publicAccess: true,
    userAccesses: { id: true, access: true, displayName: true },
    userGroupAccesses: { id: true, access: true, displayName: true },
};
