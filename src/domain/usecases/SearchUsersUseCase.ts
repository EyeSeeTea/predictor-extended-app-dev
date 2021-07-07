import { UseCase } from "../../compositionRoot";
import { UserRepository } from "../repositories/UserRepository";
import { UserSearch } from "../entities/SearchUser";

export class SearchUsersUseCase implements UseCase {
    constructor(private userRepository: UserRepository) {}

    public execute(query: string): Promise<UserSearch> {
        return this.userRepository.searchUsers(query);
    }
}
