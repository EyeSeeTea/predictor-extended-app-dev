import { UserSearch } from "../entities/SearchUser";
import { FutureData } from "../entities/Future";
//import { Pager } from "../../types/d2-api";

export interface UserRepository {
    searchUsers(query: string): FutureData<UserSearch[]> ;
}
