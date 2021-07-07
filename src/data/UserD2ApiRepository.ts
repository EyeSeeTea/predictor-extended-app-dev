import _ from "lodash";
import { UserRepository } from "../domain/repositories/UserRepository";
import { D2Api } from "../types/d2-api";
import { UserSearch } from "../domain/entities/SearchUser";

import { getD2APiFromUrl } from "./utils/d2-api";

export class UserD2ApiRepository implements UserRepository {
    private api: D2Api;

    constructor(baseUrl: string) {
        this.api = getD2APiFromUrl(baseUrl);
    }

    public async searchUsers(query: string): Promise<UserSearch> {
            /*return toFuture(this.api.models.users.get({
                fields: { id: true, name: true },
                filter: { identifiable: { ilike: query } },
              })).map(({ objects }) => {
                return objects;
            });*/
            const options = {
                fields: { id: true, name: true },
                filter: { name: { ilike: query } },
            };
            const { objects: exact } = await this.api.models.users
            //@ts-ignore D2-api index bug
            .get({
                fields: { id: true, name: true },
                filter: { identifiable: { eq: query } },
                paging: false,
            })
            .getData();
            
        
    }

}
