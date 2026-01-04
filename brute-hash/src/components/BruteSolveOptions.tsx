import { FormControl, FormLabel, Grid, Input } from "@mui/joy";
import { MultiCheckboxSelect, type CheckboxItem } from "./MultiCheckboxSelect";
import { type InputType } from "../services/api/controllers/Solve";
import { useState } from "react";

export interface SolveMode extends CheckboxItem {
    inputType: InputType;
};

export interface BruteSolveOptionsState {
    startPepper: string;
    maxLength: number;
    endPepper: string;
    enabledModes: SolveMode[];
}

interface BruteSolveOptionsParams {
    disabled?: boolean;
    solveModes: SolveMode[];
    value: BruteSolveOptionsState;
    setValue: (value: BruteSolveOptionsState) => void;
}

export const BruteSolveOptions: React.FC<BruteSolveOptionsParams> = ({
    disabled = false,
    solveModes,
    value,
    setValue,
}) => {
    const [maxLengthRaw, setMaxLengthRaw] = useState<string>(value.maxLength.toString());

    const update = (partial: Partial<BruteSolveOptionsState>) => {
        setValue({ ...value, ...partial });
    };

    return (
        <>
            <Grid sm={12} md={3}>
                <FormControl>
                    <FormLabel>Start Pepper</FormLabel>
                    <Input
                        disabled={disabled}
                        placeholder="Start Pepper"
                        value={value.startPepper}
                        onChange={(e) => update({ startPepper: e.target.value })}
                    />
                </FormControl>
            </Grid>
            <Grid sm={12} md={6}>
                <MultiCheckboxSelect
                    disabled={disabled}
                    items={solveModes}
                    value={value.enabledModes}
                    setValue={(value) => update({ enabledModes: value as SolveMode[] })}
                />
            </Grid>
            <Grid sm={12} md={3}>
                <FormControl>
                    <FormLabel>End Pepper</FormLabel>
                    <Input
                        disabled={disabled}
                        placeholder="End Pepper"
                        value={value.endPepper}
                        onChange={(e) => update({ endPepper: e.target.value })}
                    />
                </FormControl>
            </Grid>
            <Grid sm={12} md={3}>
                <FormControl>
                    <FormLabel>Max Length</FormLabel>
                    <Input
                        disabled={disabled}
                        type="number"
                        placeholder="Max Length"
                        value={maxLengthRaw}
                        onChange={(e) => setMaxLengthRaw(e.target.value)}
                        onBlur={(e) => {
                            const intVal = parseInt(e.target.value);
                            if (!isFinite(intVal)) return;
                            const val = Math.min(Math.max(1, intVal), 255);

                            setMaxLengthRaw(val.toString());
                            update({ maxLength: val });
                        }}
                    />
                </FormControl>
            </Grid>
        </>
    );
};