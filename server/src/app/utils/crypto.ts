import crypto from 'crypto';

export function hash(str: string): string {
  return crypto.createHash('sha-512').update(str).digest('hex');
}
