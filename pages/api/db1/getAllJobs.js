import { connectDBJobPortal } from '@/DB/DbJobProtal';
import Job from '@/models/Job';

export default async function handler(req, res) {
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
}

const getAllJobs = async (page, res) => {
  try {
    const pageSize = 10; // Adjust the page size as per your requirement
    const skip = (page - 1) * pageSize;

    const jobData = await Job.find({})
      .skip(skip)
      .limit(pageSize);

    return res.status(200).json({
      success: true,
      data: jobData,
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
