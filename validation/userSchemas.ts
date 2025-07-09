import { z } from 'zod';

// User creation schema - all fields required
export const createUserSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name cannot exceed 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  
  email: z.string()
    .email('Please provide a valid email address')
    .max(255, 'Email cannot exceed 255 characters'),
  
  age: z.number()
    .int('Age must be a whole number')
    .min(1, 'Age must be at least 1')
    .max(120, 'Age cannot exceed 120')
});

// User update schema - all fields optional
export const updateUserSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name cannot exceed 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .optional(),
  
  email: z.string()
    .email('Please provide a valid email address')
    .max(255, 'Email cannot exceed 255 characters')
    .optional(),
  
  age: z.number()
    .int('Age must be a whole number')
    .min(1, 'Age must be at least 1')
    .max(120, 'Age cannot exceed 120')
    .optional(),
  // id: z.string()
});

// URL parameter schema for user ID
export const userIdParamSchema = z.object({
  id: z.string()
    .regex(/^\d+$/, 'User ID must be a valid number')
    .transform(Number)
    .refine(val => val > 0, 'User ID must be a positive number')
});

// Query parameters schema for filtering/pagination (future use)
export const getUsersQuerySchema = z.object({
  page: z.string()
    .regex(/^\d+$/, 'Page must be a valid number')
    .transform(Number)
    .default('1')
    .optional(),
  
  limit: z.string()
    .regex(/^\d+$/, 'Limit must be a valid number')
    .transform(Number)
    .refine(val => val <= 100, 'Limit cannot exceed 100')
    .default('10')
    .optional(),
  
  sortBy: z.enum(['name', 'email', 'age', 'created_at'])
    .default('created_at')
    .optional(),
  
  sortOrder: z.enum(['asc', 'desc'])
    .default('desc')
    .optional()
});

// Type inference from schemas
export type CreateUserData = z.infer<typeof createUserSchema>;
export type UpdateUserData = z.infer<typeof updateUserSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
export type GetUsersQuery = z.infer<typeof getUsersQuerySchema>;