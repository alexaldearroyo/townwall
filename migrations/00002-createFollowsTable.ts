import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE follows (
      id serial PRIMARY KEY,
      follower_id int NOT NULL,
      followed_id int NOT NULL,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE follows`;
}
