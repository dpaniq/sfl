import { cleanEnv, num, str } from 'envalid';

export default () => {
  const env = cleanEnv(process.env, {
    STAGE: str(),

    DATABASE_URL: str(),
    DATABASE_DB: str(),

    SERVER_HOSTNAME: str(),
    SERVER_PORT: str(),

    CLIENT_HOSTNAME: str(),
    CLIENT_PORT: num(),

    ACCESS_TOKEN_SECRET: str(),
    REFRESH_TOKEN_SECRET: str(),
  });

  return { ...env };
};
