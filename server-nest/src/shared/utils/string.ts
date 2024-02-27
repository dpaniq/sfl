import { createHash } from 'crypto';

export function hash(str: string): string {
  return createHash('sha-512').update(str).digest('hex');
}
