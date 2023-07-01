import {connectDB} from './connectDB.js';
import dotenv from 'dotenv';
dotenv.config();

console.log("process.env.DBSCRAPY_URL", process.env.DBSCRAPY_URL);

const connectDBJobPortal = async () => {
   await connectDB(process.env.DBSCRAPY_URL);
} 

export {connectDBJobPortal};