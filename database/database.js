import postgres from 'postgres';
import { config } from 'dotenv-safe';

console.log(config());

config();

const sql = postgres();

console.log(
  await sql`
    SELECT
    *
    FROM
      users
  `,
);
