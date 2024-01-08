import {SERVER_HOSTNAME, SERVER_PORT, CLIENT_HOSTNAME, CLIENT_PORT} from '@env';

export const CORS_CONFIGURATION = {
  origin: [
    // dev
    `https://localhost:${CLIENT_PORT}`,
    `https://${SERVER_HOSTNAME}:${SERVER_PORT}`,
    `https://${CLIENT_HOSTNAME}:${CLIENT_PORT}`,
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
};
