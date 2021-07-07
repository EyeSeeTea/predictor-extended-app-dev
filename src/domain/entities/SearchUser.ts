export interface UserSearchItem {
    id: string;
    name: string;
}

export interface UserSearch {
    users: UserSearchItem[];
    userGroups: UserSearchItem[];
}
