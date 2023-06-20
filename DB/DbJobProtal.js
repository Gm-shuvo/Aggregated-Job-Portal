import {connectDB} from './connectDB.js';
import {MongoClient} from 'mongodb'
import mongoose from 'mongoose';


const connectDBJobPortal = async () => {
   await connectDB(process.env.DBJOBPORTAL_URL);
} 
// // LinkedIn Jobs Scraper DB Connection

// const connectDBScrapy = async () => {
//     const collectionName = 'linkedInJobs';

//     // Connect to the MongoDB server
//     const collect = mongoose.connect(DBSCRAPY_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     })
//     .then(() => {
//         console.log('Connected to the database successfully!');
//         // Access the specific database
//         const db = mongoose.connection.db;

//         // Access the specific collection
//         const collection = db.collection(collectionName);
        
//         return collection;
//     })
//     .catch((err) => {
//         console.error('Failed to connect to the database:', err);
//     });
//     return collect;
// }

export {connectDBJobPortal};