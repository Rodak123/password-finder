import { Box, Button, Card, CardContent, CardOverflow, FormControl, FormLabel, Grid, Input, Stack, Textarea, Typography } from "@mui/joy";
import { checkSingleSolver, solveSingleHash, stopSingleSolver } from "../services/api/actions/solve";
import { useEffect, useState } from "react";
import { type BruteSolveResult } from "../services/api/controllers/Solve";
import { BruteSolveOptions, type BruteSolveOptionsState } from "./BruteSolveOptions";
import { DEFAULT_STATE, SolveModes } from "../constants/bruteSolveOptions";

interface SolverState {
    id: number;
    isSolving: boolean;
    lastOutput: string;
    result: BruteSolveResult | null;
    hash: string;
}

const getCheckInterval = (solverCount: number) => {
    if (solverCount > 15) return 1000;
    if (solverCount > 10) return 200;
    if (solverCount > 5) return 100;
    if (solverCount > 3) return 40;
    return 20;
};

export const BruteforceBatchHash = () => {
    const [hashes, setHashes] = useState<string[]>([]);
    const [hashesRaw, setHashesRaw] = useState<string>(hashes.join('\n'));

    const [options, setOptions] = useState<BruteSolveOptionsState>(DEFAULT_STATE);
    const [solvers, setSolvers] = useState<SolverState[]>([]);

    const isSomeSolving = solvers.some((s) => s.isSolving);

    const solveBatch = async () => {
        if (isSomeSolving) return;

        if (hashes.length === 0 || options.enabledModes.length === 0) return;

        const newSolvers: SolverState[] = [];

        for (const hash of hashes) {
            try {
                const result = await solveSingleHash({
                    hash: hash,
                    pepperStart: options.startPepper,
                    pepperEnd: options.endPepper,
                    maxLength: options.maxLength,
                    inputTypes: options.enabledModes.map((m) => m.inputType)
                });
                const solver: SolverState = {
                    isSolving: true,
                    lastOutput: '',
                    result: null,
                    id: result.id,
                    hash
                };
                newSolvers.push(solver);
            } catch (e) {
                console.error(e);
            }
        }

        setSolvers(newSolvers);
    };

    const stopSolver = async (solver: SolverState) => {
        if (!solver.isSolving) return;

        try {
            const result = await stopSingleSolver({
                id: solver.id!
            });

            if (result.isWorking) return;

            const newSolvers: SolverState[] = solvers.map((s) => {
                if (s.id !== solver.id) return s;
                return {
                    ...s,
                    isSolving: false,
                    result: {
                        isSolved: false
                    }
                };
            });
            setSolvers(newSolvers);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (solvers.every((s) => !s.isSolving)) return;

        const checkSolving = async () => {
            const newSolvers: SolverState[] = [...solvers];

            for (const solver of newSolvers) {
                if (!solver.isSolving) continue;

                try {
                    const res = await checkSingleSolver({
                        id: solver.id
                    });

                    if (res.isWorking) {
                        solver.lastOutput = res.lastOutput;
                        continue;
                    }

                    solver.isSolving = false;
                    solver.result = res.result;
                } catch (e) {
                    console.error(e);
                    solver.isSolving = false;
                }
            }

            setSolvers(newSolvers);
        };

        const duration = getCheckInterval(solvers.filter((s) => s.isSolving).length);
        const interval = setInterval(checkSolving, duration);

        return () => clearInterval(interval);
    }, [solvers]);

    return (
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
            <BruteSolveOptions
                solveModes={SolveModes}
                value={options}
                setValue={(o) => setOptions(o)}
                disabled={isSomeSolving}
            />
            <Grid sm={12} md={9} sx={{
                display: 'flex',
                alignItems: 'end'
            }}>
                <Button
                    disabled={isSomeSolving}
                    type="button"
                    sx={{ flexGrow: 1 }}
                    color="primary"
                    onClick={solveBatch}
                    variant="soft"
                >
                    Brute Solve
                </Button>
            </Grid>
            <Grid sm={12}>
                <Textarea
                    value={hashesRaw}
                    onChange={(e) => {
                        setHashesRaw(e.target.value);
                    }}
                    onBlur={(e) => {
                        const lines = e.target.value
                            .split('\n')
                            .filter((line) => line.length > 0);
                        setHashesRaw(lines.join('\n'));
                        setHashes(lines);
                    }}
                />
            </Grid>
            <Grid sm={12}>
                {solvers.map((solver) => {
                    return (
                        <div key={solver.id} style={{ marginBottom: '1rem' }}>
                            <Card orientation="horizontal" variant="outlined" >
                                <CardContent>
                                    {solver.isSolving
                                        ? (
                                            <Stack direction="row" gap='1rem'>
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography textColor={"warning.plainColor"} sx={{ fontWeight: 'md' }}>
                                                        Solving
                                                    </Typography>
                                                    <FormControl>
                                                        <FormLabel>Hash</FormLabel>
                                                        <Input value={solver.hash} />
                                                    </FormControl>
                                                    <FormControl>
                                                        <FormLabel>Full Password</FormLabel>
                                                        <Input value={solver.lastOutput} />
                                                    </FormControl>
                                                </Box>
                                                <Button
                                                    type="button"
                                                    color="danger"
                                                    onClick={() => stopSolver(solver)}
                                                    variant="soft"
                                                >
                                                    Stop
                                                </Button>
                                            </Stack>
                                        )
                                        : (
                                            <>
                                                <Typography textColor={solver.result?.isSolved ? "success.plainColor" : "danger.plainColor"} sx={{ fontWeight: 'md' }}>
                                                    {solver.result?.isSolved ? "Found Solution" : "No Solution Found"}
                                                </Typography>
                                                <FormControl>
                                                    <FormLabel>Hash</FormLabel>
                                                    <Input value={solver.hash} />
                                                </FormControl>
                                                {solver.result?.isSolved && (
                                                    <FormControl>
                                                        <FormLabel>Full Password</FormLabel>
                                                        <Input value={solver.result.fullPassword} />
                                                    </FormControl>
                                                )}
                                            </>
                                        )}
                                </CardContent>
                                <CardOverflow
                                    variant="soft"
                                    color={solver.isSolving ? 'warning' : (solver.result?.isSolved ? 'primary' : 'danger')}
                                    sx={{
                                        px: 0.2,
                                        writingMode: 'vertical-rl',
                                        justifyContent: 'center',
                                        fontSize: 'xs',
                                        fontWeight: 'xl',
                                        letterSpacing: '1px',
                                        textTransform: 'uppercase',
                                        borderLeft: '1px solid',
                                        borderColor: 'divider',
                                    }}
                                >
                                    {solver.isSolving ? 'Solving' : 'Result'}
                                </CardOverflow>
                            </Card>
                        </div>
                    );
                })}
            </Grid>
        </Grid >
    );
};