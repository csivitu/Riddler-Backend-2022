import express from "express";
import morgan from "morgan"
import dotenv from 'dotenv'
import path from 'path'
import AppError from "./utils/AppError.js";
import { noURL } from "./Controllers/ErrorController.js";
import userRouter from "./routers/userRouter.js";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import bodyParser from "body-parser";
import cors from 'cors'

const __dirname=path.resolve() 
dotenv.config();

const app=express()

app.use(express.json()) 

app.use(cors())
app.use(helmet())
app.use(ExpressMongoSanitize())

app.use(express.static(path.join(__dirname, 'public')))

if(process.env.NODE_ENV=='dev') app.use(morgan("dev"))

app.use((req,res,next)=>{
    req.requestedAt=new Date().toISOString();
    next()
})

app.use("/users", userRouter)

app.all("*", (req, res, next)=>{
    next(new AppError(`Cannot find ${req.originalUrl}`, 404))
}) 

app.use(noURL)

export default app 