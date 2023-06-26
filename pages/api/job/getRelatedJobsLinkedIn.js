import {connectDBJobPortal} from '@/DB/DbJobProtal';
import mongoose from 'mongoose';


export default async function handler({query, method}, res) {
    await connectDBJobPortal();
    
    switch (method) {
        case 'GET':
            await getRelatedJobs(query, res);
            break;
        default:
            res.status(400).json({ success: false, message: 'Invalid Request' });
    }
}


const getRelatedJobs = async (query, res) => {
    
    const {t , l} = query;

    // console.log("job_type", t);
    // console.log("job_level", l);

    const filter = {};
    if(t){
        filter.job_type = t;
    }
    if(l){
        filter.job_level = l;
    }

    console.log("filter", filter)

    try {
        const jobs = await mongoose.connection.db.collection('linkedinjobs').find({...filter}).limit(5).toArray();

        return res.status(200).json({ success: true, data: jobs, message: 'Related Jobs'})
    } catch (error) {
        console.log('Error in getting a job (server) => ', error);
        return res.status(500).json({ success: false, message: "Something Went Wrong Please Retry login  !" })
    }
}