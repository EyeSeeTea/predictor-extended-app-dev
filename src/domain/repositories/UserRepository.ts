import { UserSearchItem } from "../entities/SearchUser";
import { FutureData } from "../entities/Future";

export interface UserRepository {
    searchUsers(query: string): FutureData<UserSearchItem[]>;
}
