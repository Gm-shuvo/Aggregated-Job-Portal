import { connectDBJobPortal } from '@/DB/DbJobProtal';
import Job from '@/models/Job'

export default async function handler(req, res) {
    await connectDBJobPortal();
    
    // console.log('req', req);
    const { method } = req;
    switch (method) {
        case 'GET':
            await getAllJobs(req, res);
            break;
        default:
            res.status(400).json({ success: false, message: 'Invalid Request' });
    }
}


const getAllJobs = async (req, res) => {
  try {
      
      const JobData = await Job.find({});

        return res.status(200).json({
          success: true,
          data: JobData,
          message: 'Jobs Fetched Successfully!',
        });
      } catch (error) {
        console.log('Error in getting jobs:', error);
        return res.status(500).json({
          success: false,
          message: 'Something went wrong while fetching jobs.',
        });
      }
}