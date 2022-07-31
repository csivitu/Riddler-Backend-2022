import User from "../models/userModel.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { createSendToken } from "./authController.js";
import { getAllDocs, getDoc, updateDoc, deleteDoc } from "../utils/HandlerFactory.js";
import sendEmail from "../utils/Email.js";
import multer from "multer";
import sharp from "sharp";

const filterObj=(obj, ...fields)=>{
    const filteredBody={};
    Object.keys(obj).forEach(el=>{
        if(fields.includes(el)) filteredBody[el]=obj[el];
    })
    return filteredBody;
}

export const filterBody=(req, res, next)=>{
    if(req.body.password || req.body.passwordConfirm) return next(new AppError("Password cannot be changed using this route."))
    const filteredBody=filterObj(req.body, 'username', 'email', 'name', 'isVITian', 'regNo', 'phoneNo');
    if(req.file) filteredBody.profilePic= req.file.filename;
    req.body=filteredBody;
    next()
}

const multerStrorage= multer.memoryStorage();

const multerFilter = (req, file, cb)=>{
    if(file.mimetype.startsWith('image')) cb(null, true)
    else cb(new AppError("Only images files are allowed", 400), false)
}

const uploadPhoto = multer({
    storage: multerStrorage,
    fileFilter: multerFilter,
    limits:{fileSize:5*1024*1024}
})

export const uploadProficPic = uploadPhoto.single('profilePic')

export const resizePic = (req, res, next)=>{
    if(!req.file) return next()
    
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({quality: 100})
    .toFile(`public/img/users/${req.file.filename}`)

    next()
}

export const getAllUsers = getAllDocs(User);

export const getUser = getDoc(User);

export const updateUser = updateDoc(User);

export const deleteUser = deleteDoc(User);

export const UpdatePassword= catchAsync(async (req, res, next)=>{
    const user=await User.findById(req.user.id).select("+password");
    if(! await user.correctPassword(req.body.password, user.password)) return next(new AppError("Incorect Password, Please enter the corrent password", 401));
    
    user.password = req.body.newPassword;
    user.confirmPassword=req.body.passwordConfirm;
    user.passwordChangedAt=Date.now()
    await user.save()
    
    createSendToken(user, 200, res)
})

export const forgotPassword= catchAsync(async (req, res, next)=>{
    const user= await User.findOne({email:req.body.email});
    if(!user) return next(new AppError("No User of this email id found", 401))
    const resetToken=await user.createPasswordResetToken()
    await user.save({validateBeforeSave: false});

    const URL= `${req.protocol}://${req.get('host')}/users/${user.id}/resetPassword/${resetToken}`;
    const EmailSubject=`Reset your Password!`;
    const EmailBody= `Forgot your Password? Click here to reset: ${URL}`;
    try{
        await sendEmail({
            email:user.email,
            subject:EmailSubject,
            body:EmailBody
        });
        res.status(200).json({
            status:"success",
            requestedAt: req.requestedAt,
            message :"Reset URL send to registered email."
        })
    }catch(err){
        user.passwordResetToken=undefined;
        user.passwordResetTokenExpiresIn=undefined;
        await user.save({validateBeforeSave: false});

        return next(new AppError("There was an error sending the email", 500))
    }
})

export const resetPassword= catchAsync(async (req, res, next)=>{
    const user= await User.findOne({_id:req.params.userID});
    if(!user) return next(new AppError("Invalid URL", 401));

    if(!user.passwordResetToken || user.resetTokenExpired()) return next(new AppError("URL has Expired", 401));
    if(!user.correctPasswordResetToken(req.params.token, user.passwordResetToken)) return next(new AppError("Invalid URL", 401));
    
    user.password=req.body.password;
    user.confirmPassword=req.body.passwordConfirm;
    user.passwordResetToken=undefined;
    user.passwordResetTokenExpiresIn=undefined;
    await user.save();
    
    createSendToken(user, 200, res);
})