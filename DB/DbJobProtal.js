import {connectDB} from './connectDB.js';


const connectDBJobPortal = async () => {
   await connectDB(process.env.DBSCRAPY_URL);
} 

export {connectDBJobPortal};