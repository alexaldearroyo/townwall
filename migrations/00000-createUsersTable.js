exports.up = async (client) => {
  await client.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      full_name TEXT,
      description TEXT,
      profile_id BIGINT,
      user_image VARCHAR(255),
      location POINT,
      birthdate DATE,
      profession TEXT,
      links TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

exports.down = async (client) => {
  await client.query(`
    DROP TABLE users;
  `);
};
