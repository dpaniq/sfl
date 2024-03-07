import { bool, num, str, cleanEnv } from 'envalid';

export default () => {
  const processEnv = process.env;

  const env = cleanEnv(process.env, {});

  return { ...processEnv, ...env };
};
