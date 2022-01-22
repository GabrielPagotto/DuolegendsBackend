import bcrypt from "bcrypt";

export default {
    generatePasswordHash: async function (password: string): Promise<string> {
        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    },
    verifyPassword: async function (password: string, passwordHashed: string): Promise<boolean> {
        const comparation = await bcrypt.compare(password, passwordHashed);
        return comparation;
    },
}
