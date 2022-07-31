import Joi from 'joi'
import User from '../models/userModel.js';
import catchAsync from './catchAsync.js'

const joiCreateSchema = Joi.object({
    name:Joi.string().pattern(/^[A-Za-z]+$/, 'alpha').required(),
    email:Joi.string().email().lowercase().custom(async (value, helper)=>{
        const user= await User.find({email: value});
        if(user) return helper.message("User with this email already exists")
    }).required(),
    username: Joi.string().alphanum().lowercase().custom(async (value, helper)=>{
        const user= await User.find({username: value});
        if(user) return helper.message("User with this username already exists")  //not showing this message, shows the duplicate error handler message
    }).required(),
    password:Joi.string().min(8).required(),
    confirmPassword: Joi.ref('password'),
    isVITian: Joi.boolean().default(false),
    regNo: Joi.when('isVITian',{
        is: true,
        then: Joi.string().alphanum().custom((value, helper)=>{
            const matcher = value.match(/\d{2}\w{3}\d{4}/i)
            if(!matcher) return helper.message("Please provide a valid registration number");
        }).required(),
        otherwise: Joi.forbidden()
    }),
    phoneNo:Joi.string().length(10)
})

const joiUpdateSchema =Joi.object({
    name:Joi.string().pattern(/^[A-Za-z]+$/, 'alpha'),
    email:Joi.string().email().custom(async (value, helper)=>{
        const user= await User.find({email: value});
        if(user) return helper.message("User with this email already exists")
    }),
    username: Joi.string().alphanum().lowercase().custom(async (value, helper)=>{
        const user= await User.find({username: value});
        if(user) return helper.message("User with this username already exists")
    }),
    isVITian: Joi.boolean(),
    regNo: Joi.when('isVITian',{
        is: true,
        then: Joi.string().alphanum().custom((value, helper)=>{
            const matcher = value.match(/\d{2}\w{3}\d{4}/i)
            if(!matcher) return helper.message("Please provide a valid registration number");
        }).required(),
        otherwise: Joi.forbidden()
    }),
    phoneNo:Joi.string().length(10)
})

export const joiCreateValidator = catchAsync(async (req, res, next)=>{
    const value= await joiCreateSchema.validateAsync(req.body);
    next()
})

export const joiUpdateValidator = catchAsync(async (req, res, next)=>{
    const value= await joiUpdateSchema.validateAsync(req.body);
    next()
})
