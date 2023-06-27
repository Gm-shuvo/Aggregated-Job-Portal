import { connectDBJobPortal } from '@/DB/DbJobProtal';
import validateToken from '@/middleware/tokenValidation';
import Job from '@/models/Job';
import { formatDistanceToNow } from 'date-fns';

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    await connectDBJobPortal();
    const { method, query } = req;
    switch (method) {
      case 'GET':
        await validateToken(req, res, async () => {
          await getRelatedJobs(query, res);
        });
        break;
      default:
        res.status(400).json({ success: false, message: 'Invalid Request' });
    }
  } catch (error) {
    console.log('Error connecting to the database:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

const getRelatedJobs = async (query, res) => {
  const { t, l } = query;

  const filter = {};
  if (t) {
    filter.job_type = t;
  }
  if (l) {
    filter.job_level = l;
  }

  try {
    const jobs = await Job.find(filter).limit(5);

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ success: false, message: 'Jobs not found' });
    }

    const formattedJobs = jobs.map((job) => {
      const formattedJob = job.toObject();
      formattedJob.job_date = formatDistanceToNow(job.createdAt, { addSuffix: true });
      return formattedJob;
    });

    console.log('formattedJobsRelatedJob => ', formattedJobs);

    return res.status(200).json({ success: true, data: formattedJobs, message: 'Related Jobs' });
  } catch (error) {
    console.log('Error in getting jobs (server) => ', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
