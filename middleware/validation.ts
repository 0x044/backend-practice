import type {Request, Response, NextFunction} from 'express'
import { ZodSchema, ZodError } from 'zod'

interface ValidationSchema {
    body?: ZodSchema;
    params?: ZodSchema;
    query?: ZodSchema;
}

export const validate = (schema: ValidationSchema)=>{
    return (req: Request, res: Response, next: NextFunction)=>{
        try {
            if(schema.body){
                req.body = schema.body.parse(req.body)
            }

            if(schema.params){
                req.params = schema.params.parse(req.params);
            }

            if(schema.query){
                req.query = schema.query.parse(req.query)
            }

            next();
        } catch (error) {
            if(error instanceof ZodError){
                const validationErrors = error.errors.map(err=>({
                    field: err.path.join('.'),
                    message: err.message
                }))

                return res.status(400).json({
                    success: false,
                    message: 'validation failed',
                    errors: validationErrors
                })
            }

            return res.status(500).json({
                success: false,
                message: 'Internal server error during validation'
            })

        }
    }
}

export const validateCreateUser = validate({
    body: require('../validation/userSchemas').createUserSchema
})

export const validateUpdateUser = validate({
    body: require('../validation/userSchemas').updateUserSchema,
    params: require('../validation/userSchemas').userIdParamSchema
});

export const validateUserId = validate({
    params: require('../validation/userSchemas').userIdParamSchema
});

export const formatValidationError = (error: ZodError) => {
  return {
    success: false,
    message: 'Validation failed',
    errors: error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    }))
  };
};