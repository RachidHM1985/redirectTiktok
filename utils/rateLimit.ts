// utils/rateLimit.ts
import {LRUCache} from 'lru-cache';
import type { NextApiResponse } from 'next';

console.log(LRUCache); // voir la structure exportée

interface Options {
  interval: number;
  uniqueTokenPerInterval?: number;
}

export default function rateLimit(options: Options) {
const tokenCache = new LRUCache<string, number>({
  max: options.uniqueTokenPerInterval || 500,
  ttl: options.interval,
});

  return {
    check: (res: NextApiResponse, limit: number, token: string) => {
      const tokenCount = tokenCache.get(token) || 0;

      if (tokenCount >= limit) {
        res.status(429).json({ error: 'Too many requests' });
        throw new Error('Rate limit exceeded');
      }

      tokenCache.set(token, tokenCount + 1);
    },
  };
}
