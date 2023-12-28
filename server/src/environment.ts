import * as dotenv from 'dotenv';

dotenv.config();

export const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME!;
export const SERVER_PORT = Number(process.env.SERVER_PORT!);

export const CLIENT_HOSTNAME = process.env.CLIENT_HOSTNAME!;
export const CLIENT_PORT = Number(process.env.CLIENT_PORT!);

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
