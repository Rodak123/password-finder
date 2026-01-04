import { ChildProcess, spawn } from "child_process";

export const InputTypes = {
    SmallLetters: 'sm',
    LargeLetters: 'lg',
    Numbers: 'nu',
    Special: 'sp',
} as const;

export type InputType = typeof InputTypes[keyof typeof InputTypes];

const InputTypeCharsMap: Record<InputType, string> = {
    [InputTypes.SmallLetters]: 'abcdefghijklmnopqrstuvwxyz',
    [InputTypes.LargeLetters]: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    [InputTypes.Numbers]: '0123456789',
    [InputTypes.Special]: '+-*/!?@#$%^&*()[]{}`"\'_.,;=<>',
} as const;

interface BruteSolveOptions {
    pepperStart?: string;
    pepperEnd?: string;
    maxLength?: number;
    inputTypes?: InputType[];
}

export type BruteExitCode = 'ok' | 'invalidArgs' | 'runtimeException' | 'noSolution';

const BruteExitCodeMap: Record<number, BruteExitCode> = {
    0: 'ok',
    1: 'invalidArgs',
    2: 'runtimeException',
    3: 'noSolution',
};

export interface BruteSolveResult {
    isSolved: boolean;
    fullPassword?: string;
    exitCode: BruteExitCode;
}

const dir = __dirname;

export class BruteSolveProcess {
    _hash: string;
    _options: BruteSolveOptions;
    _process?: ChildProcess;

    _isWorking: boolean;

    result: BruteSolveResult | null;
    err: Error | null;
    lastOutput: string = '';

    constructor(hash: string, options: BruteSolveOptions) {
        this._hash = hash;

        this._options = {
            ...options,
            maxLength: options.maxLength === undefined ? undefined : Math.max(1, Math.min(options.maxLength, 255)),
        };

        this.result = null;
        this.err = null;
        this._isWorking = false;
    }

    _finalize(result: BruteSolveResult, err: Error | null = null) {
        this.result = result;
        this.err = err;
        this._isWorking = false;
        if (err) console.error(err);
    }

    isWorking() {
        return this._isWorking;
    }

    start(): Promise<BruteSolveResult> {
        if (this.isWorking()) {
            return Promise.resolve({ isSolved: false, exitCode: 'runtimeException' });
        }

        this.err = null;
        this.result = null;
        this._isWorking = true;

        return new Promise((resolve) => {
            const { pepperStart, pepperEnd, maxLength, inputTypes } = this._options;

            // console.log(this._hash, this._options);

            const chars = (inputTypes ?? [InputTypes.SmallLetters]).reduce((p, c) => p + InputTypeCharsMap[c], '');

            const args = [this._hash, "--IsSilent", "--ShowProgress"];
            if (pepperStart) args.push("--PepperStart", pepperStart);
            if (pepperEnd) args.push("--PepperEnd", pepperEnd);
            if (maxLength) args.push("--MaxLength", maxLength.toString());
            if (maxLength) args.push("--Chars", chars);

            // console.log(args.join(' '))

            this._process = spawn(`${dir}/Brute/Brute`, args);

            if (!this._process || !this._process.stdout) {
                const err = new Error('Failed to start process');
                const res: BruteSolveResult = { isSolved: false, exitCode: 'runtimeException' };
                this._finalize(res, err);
                resolve(res);
                return;
            }

            this._process.stdout.on('data', (data) => {
                const output = data.toString();
                const lines = output.trim().split('\n');
                if (lines.length > 0) {
                    this.lastOutput = lines[lines.length - 1];
                }
            });

            this._process.on('error', (err) => {
                const res: BruteSolveResult = { isSolved: false, exitCode: 'runtimeException' };
                this._finalize(res, err);
                resolve(res);
            });

            this._process.on('exit', (code, signal) => {
                if (code === null) {
                    const err = new Error(`Process killed by signal: ${signal}`);
                    const res: BruteSolveResult = { isSolved: false, exitCode: 'runtimeException' };
                    this._finalize(res, err);
                    resolve(res);
                    return;
                }

                const exitCode: BruteExitCode = BruteExitCodeMap[code] || 'runtimeException';
                let finalResult: BruteSolveResult;

                if (exitCode === 'ok') {
                    finalResult = { isSolved: true, fullPassword: this.lastOutput, exitCode: 'ok' };
                } else {
                    finalResult = { isSolved: false, exitCode };
                }

                this._finalize(finalResult);
                resolve(finalResult);
            });
        });
    }

    stop(): boolean {
        if (!this._process || !this._isWorking) {
            return false;
        }

        const killed = this._process.kill('SIGTERM');

        if (killed) {
            this._isWorking = false;
        }

        return killed;
    }

}