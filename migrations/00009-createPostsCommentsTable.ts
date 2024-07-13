import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE posts_comments (
      id serial PRIMARY KEY,
      profile_id bigint NOT NULL REFERENCES posts (id),
      comment_id bigint NOT NULL REFERENCES comments (id),
      commenter_id bigint NOT NULL REFERENCES users (id)
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE posts_comments`;
}
