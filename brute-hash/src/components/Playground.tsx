import { Button, FormControl, FormLabel, Grid, Input } from "@mui/joy";
import { useState } from "react";
import { hashPassword } from "../services/api/actions/hash";

export const Playground = () => {
    const [password, setPassword] = useState<string>('admin');
    const [startPepper, setStartPepper] = useState<string>("cajovna-2025-");
    const [endPepper, setEndPepper] = useState<string>("");

    const [hash, setHash] = useState<string>("");

    const generateHash = async () => {
        try {
            const result = await hashPassword({
                pepperStart: startPepper,
                password: password,
                pepperEnd: endPepper,
            });
            setHash(result.hash);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
            <Grid sm={12} md={3}>
                <FormControl>
                    <FormLabel>Start Pepper</FormLabel>
                    <Input
                        placeholder="Start Pepper"
                        value={startPepper}
                        onChange={(e) => setStartPepper(e.target.value)}
                    />
                </FormControl>
            </Grid>
            <Grid sm={12} md={6}>
                <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </FormControl>
            </Grid>
            <Grid sm={12} md={3}>
                <FormControl>
                    <FormLabel>End Pepper</FormLabel>
                    <Input
                        placeholder="End Pepper"
                        value={endPepper}
                        onChange={(e) => setEndPepper(e.target.value)}
                    />
                </FormControl>
            </Grid>
            <Grid sm={12} md={9}>
                <FormControl>
                    <FormLabel>Hash</FormLabel>
                    <Input
                        placeholder="Hash"
                        value={hash}
                    />
                </FormControl>
            </Grid>
            <Grid sm={12} md={3} sx={{
                display: 'flex',
                alignItems: 'end'
            }}>
                <Button
                    sx={{ flexGrow: 1 }}
                    color="primary"
                    onClick={generateHash}
                    variant="soft"
                >
                    Generate Hash
                </Button>
            </Grid>
        </Grid >
    );
};