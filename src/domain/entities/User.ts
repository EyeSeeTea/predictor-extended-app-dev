interface UserData {
    id: string;
    name: string;
    authorities: string[];
    username: string;
}

export class User {
    readonly id: string;
    readonly name: string;
    readonly authorities: string[];
    readonly isAdmin: boolean;
    readonly username: string;

    private constructor({ id, name, authorities, username }: UserData) {
        this.id = id;
        this.name = name;
        this.authorities = authorities;
        this.isAdmin = authorities.includes("ALL");
        this.username = username;
    }

    public static create(data: UserData) {
        return new User(data);
    }
}
