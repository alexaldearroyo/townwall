import 'server-only';

import postgres from 'postgres';
import { config } from 'dotenv-safe';

config();

export const sql = postgres({
  transform: {
    ...postgres.camel,
    undefined: null,
  },
});
