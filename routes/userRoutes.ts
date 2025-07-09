import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { validateCreateUser, validateUpdateUser, validateUserId } from '../middleware/validation';

const router = Router();

// GET /api/users - Get all users
router.get('/', UserController.getAllUsers.bind(UserController));

// GET /api/users/:id - Get user by ID
router.get('/:id',validateUserId, UserController.getUserById.bind(UserController));

// POST /api/users - Create new user
router.post('/',validateCreateUser, UserController.createUser.bind(UserController));

// PUT /api/users/:id - Update user
router.put('/:id',validateUpdateUser, UserController.updateUser.bind(UserController));

// DELETE /api/users/:id - Delete user
router.delete('/:id',validateUserId, UserController.deleteUser.bind(UserController));

export default router;