import { routes } from '../routes';
import Service from './Service';

export const InputTypes = {
    SmallLetters: 'sm',
    LargeLetters: 'lg',
    Numbers: 'nu',
    Special: 'sp',
} as const;
export type InputType = typeof InputTypes[keyof typeof InputTypes];

export interface SolveSingle {
    id: number;
}

export interface SolveSingleData {
    hash: string;
    pepperStart?: string;
    pepperEnd?: string;
    maxLength?: number;
    inputTypes: InputType[];
}

export interface BruteSolveResult {
    isSolved: boolean;
    fullPassword?: string;
}

export interface CheckSolveSingle {
    lastOutput: string;
    isWorking: boolean;
    result: BruteSolveResult | null;
}

export interface CheckSolveSingleData {
    id: number;
}

export interface StopSolveSingle {
    isWorking: boolean;
}

export interface StopSolveSingleData {
    id: number;
}

export class Solve extends Service {
    constructor(baseURL: string) {
        super(baseURL);
    }

    public async single(data: SolveSingleData): Promise<SolveSingle> {
        return this.POST<SolveSingle>(routes.POST.Solve + '/single', data);
    }

    public async checkSingle(data: CheckSolveSingleData): Promise<CheckSolveSingle> {
        return this.GET<CheckSolveSingle>(routes.POST.Solve + '/single/' + data.id);
    }

    public async stopSingle(data: StopSolveSingleData): Promise<StopSolveSingle> {
        return this.GET<StopSolveSingle>(routes.POST.Solve + '/single/' + data.id + '/stop');
    }

}
