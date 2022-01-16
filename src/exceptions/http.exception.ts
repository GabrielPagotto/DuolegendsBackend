export class ValidationException extends Error {
    public status: number;
    public message: string;
    public type: string = "Validation";
    
    constructor(message: string, status?: number) {
        super(message);
        this.status = status ?? 400;
        this.message = message;
    }
}
