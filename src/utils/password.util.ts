import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
    const saltRounds =  Number(process.env.SALT_ROUNDS);
    return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}
