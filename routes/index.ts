import { Router } from "express";
import userRoutes from './userRoutes'

const router = Router();

router.use('/users', userRoutes);

router.get('/', (req, res)=>{
    res.json({
        message: 'Welcome to API',
        version: '1.0',
        endPoints: {
            users: {
                'GET /api/users': 'Get all users',
                'GET /api/users/:id': 'Get user by ID',
                'POST /api/users': 'Create new user',
                'PUT /api/users/:id': 'Update user',
                'DELETE /api/users/:id': 'Delete user'
            }
        }
    })
})

export default router;