import { connectDBJobPortal } from '@/DB/DbJobProtal';
import { connection, Types } from 'mongoose';
import Job from '@/models/Job';
import User from '@/models/User';
import { formatDistanceToNow } from 'date-fns';

export default async function handler({ method, query }, res) {
  try {
    await connectDBJobPortal();

    switch (method) {
      case 'GET':
        await getSpecifiedJob(query, res);
        break;
      default:
        res.status(400).json({ success: false, message: 'Invalid Request' });
    }
  } catch (error) {
    console.log('Error connecting to the database:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

const getSpecifiedJob = async (data, res) => {
  const { id } = data;
  const _id = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : null;

  if (!_id) {
    return res.status(400).json({ success: false, message: 'Invalid Job ID format' });
  }

  try {
    const jobData = await Job.findById(_id).populate({ path: 'user', model: User }).exec();

    if (!jobData) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const formattedJobDate = formatDistanceToNow(jobData.createdAt, { addSuffix: true });
    const formattedJob = {
      ...jobData.toObject(),
      job_date: formattedJobDate
    };

    console.log('formattedJob specificJobs => ', formattedJob);

    return res.status(200).json({ success: true, data: formattedJob, message: 'Job Fetched Successfully!' });
  } catch (error) {
    console.log('Error in getting a specified Job (server) => ', error);

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ success: false, message: 'Invalid Job ID format' });
    }

    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
