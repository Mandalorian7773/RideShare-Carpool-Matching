const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function runMigration() {
  try {
    const client = await pool.connect();
    console.log('Connected to database');
    
    // Run the migration
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email_password ON users(email, password);
    `);
    
    console.log('Migration completed successfully');
    
    // Verify the column was added
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'password'
    `);
    
    if (result.rows.length > 0) {
      console.log('Password column added successfully');
    } else {
      console.log('Password column was not added');
    }
    
    client.release();
  } catch (error) {
    console.error('Migration error:', error.message);
  } finally {
    await pool.end();
  }
}

runMigration();