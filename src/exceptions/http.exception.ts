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

export class NotFoundException extends Error {
    public status: number;
    public message: string;
    public type: string = "Not Found";

    constructor(message: string, status?: number) {
        super(message);
        this.message = message;
        this.status = status ?? 404;
    }
}

export class UnauthorizedException extends Error {
    public status: number;
    public message: string;
    public type: string = "Unauthorized";

    constructor(message: string = "Not authorized", status?: number) {
        super(message);
        this.message = message;
        this.status = status ?? 400;
    }
}

export class NotAcceptable extends Error {
    public status: number;
    public message: string;
    public type: string = "Not Acceptable";

    constructor(message: string = "Not Acceptable", status?: number) {
        super(message);
        this.message = message;
        this.status = status ?? 406;
    }
}
