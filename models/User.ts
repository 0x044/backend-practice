import { db } from '../config/db.config';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface User {
  id?: number;
  name: string;
  email: string;
  age?: number;
  created_at?: Date;
  updated_at?: Date;
}

export class UserModel {
  // Get all users
  static async findAll(): Promise<User[]> {
    const [rows] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM users ORDER BY created_at DESC'
    );
    return rows as User[];
  }

  // Get user by ID
  static async findById(id: number): Promise<User | null> {
    const [rows] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? rows[0] as User : null;
  }

  // Create new user
  static async create(userData: Omit<User, 'id'>): Promise<User> {
    const [result] = await db.execute<ResultSetHeader>(
      'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
      [userData.name, userData.email, userData.age]
    );
    
    const newUser = await this.findById(result.insertId);
    if (!newUser) throw new Error('Failed to create user');
    return newUser;
  }

  // Update user
  static async update(id: number, userData: Partial<User>): Promise<User | null> {
    const updates = [];
    const values = [];
    
    if (userData.name) {
      updates.push('name = ?');
      values.push(userData.name);
    }
    if (userData.email) {
      updates.push('email = ?');
      values.push(userData.email);
    }
    if (userData.age !== undefined) {
      updates.push('age = ?');
      values.push(userData.age);
    }
    
    if (updates.length === 0) return null;
    
    values.push(id);
    await db.execute(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.findById(id);
  }

  // Delete user
  static async delete(id: number): Promise<boolean> {
    const [result] = await db.execute<ResultSetHeader>(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}