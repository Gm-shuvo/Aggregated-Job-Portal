import { connectDBJobPortal } from '@/DB/DbJobProtal';
import Job from '@/models/Job';
import { formatDistanceToNow } from 'date-fns';
import { date } from 'joi';

export default async function handler(req, res) {
  try {
    await connectDBJobPortal();
    const { method, query } = req;
    const { page } = query;
    
    switch (method) {
      case 'GET':
        await getAllJobs(page, res);
        break;
        default:
          res.status(400).json({ success: false, message: 'Invalid Request' });
      }
  } catch (error) {
    console.log('Error connecting to the database:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

    
const getAllJobs = async (page, res) => {
  await connectDBJobPortal();
  try {
    const pageSize = 10; // Adjust the page size as per your requirement
    const skip = (page - 1) * pageSize;

    const jobData = await Job.find({})
      .skip(skip)
      .sort({ createdAt: -1 })
      .limit(pageSize);

    const formattedJobs = jobData.map((job) => {
        const formattedJob = job.toObject();
        formattedJob.job_date = formatDistanceToNow(new Date(job.createdAt), { addSuffix: true });
        return formattedJob;
    });
    console.log('formattedJobs => ', formattedJobs);
    
    return res.status(200).json({
      success: true,
      data: formattedJobs,
      message: 'Jobs Fetched Successfully!',
    });
  } catch (error) {
    console.log('Error in getting jobs:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching jobs.',
    });
  }
};
