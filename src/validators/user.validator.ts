import { ValidationException } from '../exceptions/http.exception';
import { UserInterface } from '../models/user.model';

class UserValidator {
    private user: UserInterface;

    constructor(user: UserInterface) {
        this.user = user;
    }

    public validateUserForSave(): void {
        if (this.user.email.length < 4 || !this.user.email.match('@')) {
            throw new ValidationException('The email provided is invalid.');
        }
    
        if (this.user.password.length < 6) {
            throw new ValidationException('The password must contain at least 8 digits.');
        }
    
    }
}

export default UserValidator;
