import { SOLVE } from "../ApiClients";
import type { CheckSolveSingle, CheckSolveSingleData, SolveSingle, SolveSingleData, StopSolveSingle, StopSolveSingleData } from "../controllers/Solve";

export const solveSingleHash = (data: SolveSingleData): Promise<SolveSingle> => {
    return SOLVE.single(data);
};

export const checkSingleSolver = (data: CheckSolveSingleData): Promise<CheckSolveSingle> => {
    return SOLVE.checkSingle(data);
};

export const stopSingleSolver = (data: StopSolveSingleData): Promise<StopSolveSingle> => {
    return SOLVE.stopSingle(data);
};