// config.js
import dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET;
export const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
export const PORT = process.env.PORT;
