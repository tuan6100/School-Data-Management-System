import {EntityManager} from "@mikro-orm/postgresql";

export class AuthService {

    constructor(
        private readonly em: EntityManager
    ) {}

    async login() {
        return `This action logs a user in`
    }
}