// import { bruteSolve, BruteSolveResult } from "../bruteSolver/bruteSolve";

// describe('bruteSolve', () => {

//     it('should find correct password', async () => {
//         const result = await bruteSolve('81620f5ccec6b6ab1364cd17f91a74b2100944487c12b9eb48b1e2307154199a', {
//             pepperStart: 'cajovna-2025-',
//             maxLength: 3,
//         });

//         const expectedResult: BruteSolveResult = {
//             exitCode: 'ok',
//             fullPassword: 'cajovna-2025-a',
//             isSolved: true
//         };

//         expect(result).toEqual(expectedResult);
//     });

//     it('should not find solution', async () => {
//         const result = await bruteSolve('wrong_hash', {
//             pepperStart: 'cajovna-2025-',
//             maxLength: 3,
//         });

//         const expectedResult: BruteSolveResult = {
//             exitCode: 'noSolution',
//             fullPassword: '',
//             isSolved: false
//         };

//         expect(result).toEqual(expectedResult);
//     });

//     it('should fail with invalid length', async () => {
//         const result = await bruteSolve('81620f5ccec6b6ab1364cd17f91a74b2100944487c12b9eb48b1e2307154199a', {
//             pepperStart: 'cajovna-2025-',
//             maxLength: -1,
//         });

//         const expectedResult: BruteSolveResult = {
//             exitCode: 'invalidArgs',
//             fullPassword: '',
//             isSolved: false
//         };

//         expect(result).toEqual(expectedResult);
//     });

// });