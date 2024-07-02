import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE posts_comments (
      id serial PRIMARY KEY,
      profile_id bigint NOT NULL,
      comment_id bigint NOT NULL,
      commenter_id bigint NOT NULL
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE posts_comments`;
}
