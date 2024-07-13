import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE profiles_comments (
      id serial PRIMARY KEY,
      profile_id int NOT NULL REFERENCES users (profile_id),
      comment_id int NOT NULL REFERENCES comments (id),
      commenter_id int NOT NULL REFERENCES users (id)
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE profiles_comments`;
}
