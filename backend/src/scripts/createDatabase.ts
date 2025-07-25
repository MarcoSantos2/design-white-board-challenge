import dotenv from 'dotenv';
import { Client } from 'pg';

// Load environment variables
dotenv.config();

async function createDatabaseIfNotExists() {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'ux_interview_app',
  };

  // Create a connection to the PostgreSQL server (not the database itself)
  const client = new Client({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.username,
    password: dbConfig.password,
    database: 'postgres', // Connect to the default postgres database
  });

  try {
    await client.connect();

    // Check if the database exists
    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbConfig.database]
    );
    
    if (result.rows.length === 0) {
      await client.query(`CREATE DATABASE "${dbConfig.database}"`);
      console.log(`Database ${dbConfig.database} created successfully.`);
      console.log(`\n      \\////\n     /     \\\n   <| ô   ô |>\n    |   ^   |\n     \\ \\_/ /\n      \\___/\n\nYou can Smile now!`);
    } else {
      console.log(`Database ${dbConfig.database} already exists.`);
    }
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  } finally {
    await client.end();
  }
}

async function main() {
  await createDatabaseIfNotExists();
}

main().catch(console.error); 