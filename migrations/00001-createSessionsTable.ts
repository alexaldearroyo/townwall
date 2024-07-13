import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE sessions (
      id serial PRIMARY KEY,
      user_id int NOT NULL REFERENCES users (id),
      token varchar(255) NOT NULL,
      created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      expires_at timestamp NOT NULL
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE sessions`;
}
