import { BruteSolveProcess, BruteSolveResult } from "../bruteSolver/BruteSolveProcess";

describe('BruteSolveProcess', () => {

    it('should find correct password', async () => {

        const process = new BruteSolveProcess('81620f5ccec6b6ab1364cd17f91a74b2100944487c12b9eb48b1e2307154199a', {
            pepperStart: 'cajovna-2025-',
            maxLength: 3,
        });

        const result = await process.start();

        const expectedResult: BruteSolveResult = {
            exitCode: 'ok',
            fullPassword: 'cajovna-2025-a',
            isSolved: true
        };

        expect(result).toEqual(expectedResult);
    });

    it('should not find solution', async () => {
        const process = new BruteSolveProcess('wrong_hash', {
            pepperStart: 'cajovna-2025-',
            maxLength: 3,
        });

        const result = await process.start();

        const expectedResult: BruteSolveResult = {
            exitCode: 'noSolution',
            isSolved: false
        };

        expect(result).toEqual(expectedResult);
    });
});