import { Hash } from './controllers/Hash';
import { Solve } from './controllers/Solve';

export const SOLVE = new Solve(import.meta.env.VITE_API_PATH);
export const HASH = new Hash(import.meta.env.VITE_API_PATH);
