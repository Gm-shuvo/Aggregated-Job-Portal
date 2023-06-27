import { connectDBJobPortal } from '@/DB/DbJobProtal';
import { connection, Types } from 'mongoose';
import Job from '@/models/Job';
import User from '@/models/User';
import { formatDistanceToNow } from 'date-fns';

export default async function handler({ method, query }, res) {
  try {
    switch (method) {
      case 'GET':
        await getSpecifiedLinkedJob(query, res);
        break;
      default:
        res.status(400).json({ success: false, message: 'Invalid Request' });
    }
  } catch (error) {
    console.log('Error connecting to the database:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

const getSpecifiedLinkedJob = async (data, res) => {
  const { id } = data;
  const _id = new Types.ObjectId(id);
  if(!_id){
    return res.status(400).json({ success: false, message: 'Invalid Job ID format' });
  }
  console.log(_id);
  await connectDBJobPortal();
  try {

    const jobData = await Job.findById(_id).populate({path: 'user', model: User}).exec();

    if (!jobData) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    jobData.job_date = formatDistanceToNow(new Date(jobData.createdAt), { addSuffix: true });

    console.log('formattedJob => ', jobData);

    return res.status(200).json({ success: true, data: jobData, message: 'Job Fetched Successfully!' });
  } catch (error) {
    console.log('Error in getting a specified Job (server) => ', error);

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ success: false, message: 'Invalid Job ID format' });
    }

    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
