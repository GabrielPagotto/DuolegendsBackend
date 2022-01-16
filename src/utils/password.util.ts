import bcrypt from "bcrypt";

export async function generatePasswordHash(password: string): Promise<string> {
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

export async function verifyPassword(password: string, passwordHashed: string): Promise<boolean> {
    const comparation = await bcrypt.compare(password, passwordHashed);
    return comparation;
}
