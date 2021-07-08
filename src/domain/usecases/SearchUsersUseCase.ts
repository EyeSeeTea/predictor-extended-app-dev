import { UseCase } from "../../compositionRoot";
import { UserRepository } from "../repositories/UserRepository";
import { UserSearchItem } from "../entities/SearchUser";

export class SearchUsersUseCase implements UseCase {
    constructor(private userRepository: UserRepository) {}

    public execute(query: string): Promise<UserSearchItem[]> {
        return this.userRepository.searchUsers(query).toPromise();
    }
}
