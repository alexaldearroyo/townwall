import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE posts_categories (
      id serial PRIMARY KEY,
      post_id int NOT NULL,
      category_id int NOT NULL
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE posts_categories`;
}
