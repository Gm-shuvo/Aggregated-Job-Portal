import {connectDBJobPortal} from '@/DB/DbJobProtal';
import Job from '@/models/Job';


export default async function handler(req, res) {
    await connectDBJobPortal();
    // console.log('req', req);
    const { method } = req;
    switch (method) {
        case 'GET':
            await getSearchJobs(req, res);
            break;
        default:
            res.status(400).json({ success: false, message: 'Invalid Request' });
    }
}


const getSearchJobs = async (req, res) => {
    
    const {jt, q, loc, jl} = req.query;
    // console.log('req.query', req.query);

    const filter = {};
    if(query){
        filter.title = { $regex: query, $options: 'i' };
    }
    if (job_type) {
        filter.job_type = job_type;
    }


    try {
        const jobs = await Job.find(filter).populate('user');
        return res.status(200).json({ success: true, data: jobs, message: `${job_type}`})
    } catch (error) {
        console.log('Error in getting a job (server) => ', error);
        return res.status(500).json({ success: false, message: "Something Went Wrong Please Retry login  !" })
    }
}