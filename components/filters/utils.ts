import { getMMYFilters } from 'lib/vercel-kv';
import { cache } from 'react';

export const loadMMMYFilters = cache(async () => {
  return await getMMYFilters();
});
