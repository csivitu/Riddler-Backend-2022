import app from './app.js';
import mongoose from 'mongoose'
import envHandler from './managers/envHandler.js';
import connectToDB from './managers/DB.js';
import { uncaughtExceptionManager, unhandledRejectionManager } from './managers/baseErrorManager.js';

uncaughtExceptionManager

mongoose.set('runValidators', true)
connectToDB() 

app.listen(envHandler("PORT"), () => {
  console.log(`Server is running on http://${envHandler("URL")}:${envHandler("PORT")}`);
});

unhandledRejectionManager