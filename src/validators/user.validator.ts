import { UserInterface } from '../models/user.model';

export function validateUserToPost(user: UserInterface): string | null {
    if (user.email.length < 4 || !user.email.match("@")) {
        return "The email provided is invalid."
    }

    if (user.password.length < 6) {
        return "The password must contain at least 8 digits.";
    }

    return null;
}
