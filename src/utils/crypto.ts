import * as crypto from 'crypto';

export function calculateMD5(input: string): string {
  const hash = crypto.createHash('md5');
  hash.update(input);
  return hash.digest('hex');
}