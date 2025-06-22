import { createPool } from "mysql2";

const connection = createPool({
    host: process.env.DATABASE_HOST,
    
    user: process.env.DATABASE_USER
})