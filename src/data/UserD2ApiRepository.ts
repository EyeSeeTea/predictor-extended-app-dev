import _ from "lodash";
import { UserRepository } from "../domain/repositories/UserRepository";
import { D2Api } from "../types/d2-api";
import { UserSearchItem } from "../domain/entities/SearchUser";
import { FutureData } from "../domain/entities/Future";
import { toFuture } from "./utils/futures";
import { getD2APiFromUrl } from "./utils/d2-api";

export class UserD2ApiRepository implements UserRepository {
    private api: D2Api;

    constructor(baseUrl: string) {
        this.api = getD2APiFromUrl(baseUrl);
    }

    public searchUsers(query: string): FutureData<UserSearchItem[]> {
        return toFuture(
            this.api.models.users
                //@ts-ignore D2-api index bug
                .get({
                    fields: { id: true, displayName: true },
                    query
                })
        ).map(({ objects }) => {
            return objects;
        });
    }
}
