import type { Request, Response } from 'express';
import { UserModel, type User } from '../models/User';
import type {
  CreateUserData,
  UpdateUserData,
  UserIdParam,
  GetUsersQuery
} from '../validation/userSchemas';

export class UserController {
  /**
   * GET /api/users - Get all users
   * Future-ready for query parameters (pagination, filtering, sorting)
   */
  static async getAllUsers(req: Request, res: Response) {
    try {
      // Query parameters are validated by validateGetUsers middleware
      // const queryParams = req.query as GetUsersQuery;
      
      const users = await UserModel.findAll();
      
      res.json({
        success: true,
        message: 'Users retrieved successfully',
        data: users,
        count: users.length
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users',
        ...(process.env.NODE_ENV === 'development' && { error: error instanceof Error ? error.message : error })
      });
    }
  }

  /**
   * GET /api/users/:id - Get user by ID
   * Uses validateUserId middleware to ensure 'id' is a valid number
   */
  static async getUserById(req: Request, res: Response) {
    try {
      // The 'id' is already parsed and validated by the validateUserId middleware
      const { id } = req.params as unknown as UserIdParam;

      const user = await UserModel.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'User retrieved successfully',
        data: user
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user'
      });
    }
  }

  /**
   * POST /api/users - Create new user
   * Uses validateCreateUser middleware for body validation
   */
  static async createUser(req: Request, res: Response) {
    try {
      // req.body is already validated and parsed by validateCreateUser middleware
      const userData: CreateUserData = req.body;

      const newUser = await UserModel.create({
        name: userData.name,
        email: userData.email,
        age: userData.age
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: newUser
      });
    } catch (error: any) {
      console.error('Error creating user:', error);

      // Handle duplicate email error
      if (error.code === 'ER_DUP_ENTRY' || error.message?.includes('duplicate key')) {
        return res.status(409).json({
          success: false,
          message: 'Email already exists'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to create user'
      });
    }
  }

  /**
   * PUT /api/users/:id - Update user
   * Uses validateUpdateUser middleware for params and body validation
   */
  static async updateUser(req: Request, res: Response) {
    try {
      // req.params.id is validated and parsed by validateUpdateUser middleware
      const { id } = req.params as unknown as UserIdParam;
      // req.body is validated and parsed by validateUpdateUser middleware
      const updates: UpdateUserData = req.body;

      // Check if user exists before attempting to update
      const existingUser = await UserModel.findById(id);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const updatedUser = await UserModel.update(id, updates);

      res.json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser
      });
    } catch (error: any) {
      console.error('Error updating user:', error);

      if (error.code === 'ER_DUP_ENTRY' || error.message?.includes('duplicate key')) {
        return res.status(409).json({
          success: false,
          message: 'Email already exists'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update user'
      });
    }
  }

  /**
   * DELETE /api/users/:id - Delete user
   * Uses validateUserId middleware to ensure 'id' is a valid number
   */
  static async deleteUser(req: Request, res: Response) {
    try {
      // The 'id' is already parsed and validated by the validateUserId middleware
      const { id } = req.params as unknown as UserIdParam;

      const deleted = await UserModel.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete user'
      });
    }
  }
}