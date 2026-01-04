import { HASH } from "../ApiClients";
import type { HashPassword, HashPasswordData } from "../controllers/Hash";

export const hashPassword = (data: HashPasswordData): Promise<HashPassword> => {
    return HASH.hashPassword(data);
};