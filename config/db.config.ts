import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

export const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

export const db = mysql.createPool(dbConfig);

export const testConnection = async ()=>{
    try {
        const connection = await db.getConnection();
        console.log("DB CONN SUCCESS");
        connection.release();
    } catch (error) {
        console.error(error);
    }
}

