import { routes } from '../routes';
import Service from './Service';

export interface HashPassword {
    hash: string;
}

export interface HashPasswordData {
    password: string;
    pepperStart?: string;
    pepperEnd?: string;
}

export class Hash extends Service {
    constructor(baseURL: string) {
        super(baseURL);
    }

    public async hashPassword(data: HashPasswordData): Promise<HashPassword> {
        return this.POST<HashPassword>(routes.POST.Hash, data);
    }

}
