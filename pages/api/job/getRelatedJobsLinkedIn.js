import { connectDBJobPortal } from '@/DB/DbJobProtal';
import validateToken from '@/middleware/tokenValidation';
import mongoose from 'mongoose';

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
    }
    catch (error) {
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

  console.log('filter', filter);

  try {
    
    const jobs = await mongoose.connection.db.collection('linkedinjobs').find({...filter}).limit(5).toArray();

    return res.status(200).json({ success: true, data: jobs, message: 'Related Jobs' });
  } catch (error) {
    console.log('Error in getting a job (server) => ', error);
    return res.status(500).json({ success: false, message: 'Something Went Wrong. Please Retry login!' });
  }
}
