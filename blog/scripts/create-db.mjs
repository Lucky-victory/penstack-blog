import mysql from "mysql2/promise";

// Function to create database if it doesn't exist
export async function createDatabaseIfNotExists() {
  const { DB_PORT, DB_USER_NAME, DB_USER_PASS, DB_HOST, DB_NAME } = process.env;
  const dbConfig = {
    port: +DB_PORT,
    user: DB_USER_NAME,
    password: DB_USER_PASS,
    host: DB_HOST,
    ssl: { rejectUnauthorized: true },
  };
  const dbName = DB_NAME;

  const connection = await mysql.createConnection(dbConfig);
  try {
    const [rows] = await connection.query(`SHOW DATABASES LIKE ?`, [dbName]);
    if (Array.isArray(rows) && rows.length === 1) {
      await connection.query(`DROP DATABASE ??`, [dbName]);
      console.log(`Database '${dbName}' created successfully.`);
    } else {
      console.log(`Database '${dbName}' already exists.`);
    }
  } finally {
    await connection.end();
  }
}
createDatabaseIfNotExists().catch((err) => {
  console.log(err);
});
