import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { BruteSolveProcess, InputTypes, type InputType } from './bruteSolver/BruteSolveProcess';
import { createHash } from 'crypto';

export const app: Application = express();

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

let lastSolverId = 0;
const solvers: Record<number, BruteSolveProcess> = {};

app.get('/solve/single/:id/stop', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    if (!isFinite(id)) {
        res.status(400).json({
            type: 'error',
            error: {
                message: 'id must be a number',
                cause: 'id',
            }
        });
    }

    const solver = solvers[id];

    if (solver.isWorking()) {
        solver.stop();
    }

    res.json({
        type: 'data',
        data: {
            isWorking: solver.isWorking(),
        },
    });
});

// report output
app.get('/solve/single/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    if (!isFinite(id)) {
        res.status(400).json({
            type: 'error',
            error: {
                message: 'id must be a number',
                cause: 'id',
            }
        });
    }

    const solver = solvers[id];

    res.json({
        type: 'data',
        data: {
            lastOutput: solver.lastOutput,
            isWorking: solver.isWorking(),
            result: solver.result
        },
    });
});

// start solver
app.post('/solve/single', async (req: Request, res: Response) => {
    const hash: string | undefined = req.body.hash;
    const pepperStart: string | undefined = req.body.pepperStart ?? undefined;
    const pepperEnd: string | undefined = req.body.pepperEnd ?? undefined;
    const maxLength: number | undefined = req.body.maxLength !== undefined ? parseInt(req.body.maxLength) : undefined;
    const inputTypes: InputType[] = req.body.inputTypes ?? [InputTypes.SmallLetters];

    if (hash === undefined) {
        res.status(400).json({
            type: 'error',
            error: {
                message: 'hash is required.',
                cause: 'hash',
            }
        });
    }

    if (maxLength !== undefined && !isFinite(maxLength)) {
        res.status(400).json({
            type: 'error',
            error: {
                message: 'maxLength must be a number.',
                cause: 'maxLength',
            }
        });
    }

    const solver = new BruteSolveProcess(hash!, {
        pepperStart, pepperEnd, maxLength, inputTypes
    });

    solver.start();

    lastSolverId++;
    solvers[lastSolverId] = solver;

    res.json({
        type: 'data',
        data: {
            id: lastSolverId
        },
    });
});

app.post('/hash', async (req: Request, res: Response) => {
    const password: string | undefined = req.body.password;
    const pepperStart: string | undefined = req.body.pepperStart ?? undefined;
    const pepperEnd: string | undefined = req.body.pepperEnd ?? undefined;

    if (password === undefined) {
        res.status(400).json({
            type: 'error',
            error: {
                message: 'password is required.',
                cause: 'hash',
            }
        });
    }

    const fullPassword = (pepperStart ?? '') + password + (pepperEnd ?? '');
    const hash = createHash('sha256').update(fullPassword, 'utf8').digest('hex');

    res.json({
        type: 'data',
        data: {
            hash: hash
        },
    });
});