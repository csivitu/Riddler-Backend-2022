import app from './app.js';
import mongoose from 'mongoose'

process.on('uncaughtException', err=>{
  console.log(err);
  console.log("Uncaught Exception! Shutting Down the App....");
  process.exit(1);
});

mongoose.connect(process.env.DATABASE_URL.replace('<password>', process.env.DATABASE_PASSWORD))
        .then(() =>console.log("Connected to Database!"))
mongoose.set('runValidators', true) 

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${process.env.PORT}`);
});

process.on('unhandledRejection', err=>{ 
  console.log(err);
  console.log("Unhandled Rejection! Shutting Down the App....");
  server.close(()=>{
    process.exit(1);
  });
});