import { config } from 'dotenv-safe';
import postgres from 'postgres';

config();

const options = {
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  username: process.env.PGUSERNAME,
  password: process.env.PGPASSWORD,
  transform: {
    ...postgres.camel,
    undefined: null,
  },
};

export default options;
