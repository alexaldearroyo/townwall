import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE profiles_comments (
      id serial PRIMARY KEY,
      profile_id int NOT NULL,
      comment_id int NOT NULL,
      commenter_id int NOT NULL
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE profiles_comments`;
}
