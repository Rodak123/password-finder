import type { BruteSolveOptionsState, SolveMode } from "../components/BruteSolveOptions";
import { HashIcon, NumberOneIcon, TextAaIcon } from "@phosphor-icons/react";
import { InputTypes } from "../services/api/controllers/Solve";

export const SolveModes: SolveMode[] = [
    {
        name: 'Small Letters',
        icon: <TextAaIcon />,
        inputType: InputTypes.SmallLetters,
    },
    {
        name: 'Large Letters',
        icon: <TextAaIcon />,
        inputType: InputTypes.LargeLetters,
    },
    {
        name: 'Numbers',
        icon: <NumberOneIcon />,
        inputType: InputTypes.Numbers,
    },
    {
        name: 'Special',
        icon: <HashIcon />,
        inputType: InputTypes.Special,
    },
] as const;

// eslint-disable-next-line react-refresh/only-export-components
export const DEFAULT_STATE: BruteSolveOptionsState = {
    startPepper: 'cajovna-2025-',
    endPepper: '',
    maxLength: 5,
    enabledModes: [SolveModes[0]]
};