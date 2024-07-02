import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE sessions (
      id serial PRIMARY KEY,
      user_id int NOT NULL,
      token varchar(255) NOT NULL,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP,
      expires_at timestamp
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE sessions`;
}
