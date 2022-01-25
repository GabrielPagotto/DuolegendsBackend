export class BadRequest extends Error {
    public status: number;
    public message: string;
    public type: string = "Bad request";
    
    constructor(message: string, status?: number) {
        super(message);
        this.status = status ?? 400;
        this.message = message;
    }
}

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
}1

export class UnauthorizedException extends Error {
    public status: number;
    public message: string;
    public type: string = "Unauthorized";

    constructor(message: string = "not-authorized", status?: number) {
        super(message);
        this.message = message;
        this.status = status ?? 401;
    }
}

export class NotAcceptable extends Error {
    public status: number;
    public message: string;
    public type: string = "Not Acceptable";

    constructor(message: string = "not-acceptable", status?: number) {
        super(message);
        this.message = message;
        this.status = status ?? 406;
    }
}
