import type { RowDataPacket } from "mysql2";
import { db } from "../config/db.config";

export default interface User {
    id?: number,
    name?: string,
    phone?: number,
    createdAt: Date,
    updatedAt: Date
}

export class UserModel {
    
}