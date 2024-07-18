import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE profile_comments (
      id serial PRIMARY KEY,
      profile_id int NOT NULL REFERENCES users (profile_id),
      user_id int NOT NULL REFERENCES users (id),
      content text NOT NULL,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE IF EXISTS profile_comments`;
}
