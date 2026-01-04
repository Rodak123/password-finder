export class ApiError extends Error {
    code: number;
    cause: string;

    constructor(message: string, code: number, cause: string) {
        super(message);
        this.code = code;
        this.cause = cause;
    }
}
