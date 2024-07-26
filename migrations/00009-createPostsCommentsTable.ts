import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE posts_comments (
      id serial PRIMARY KEY,
      post_id int NOT NULL REFERENCES posts (id),
      user_id int NOT NULL REFERENCES users (id),
      content text NOT NULL,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE IF EXISTS posts_comments`;
}
