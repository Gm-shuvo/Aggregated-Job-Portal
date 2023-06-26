import {connectDBJobPortal} from '@/DB/DbJobProtal';
import validateToken from '@/middleware/tokenValidation';
import Job from '@/models/Job';
import User from '@/models/User';
import { formatDistanceToNow } from 'date-fns';
// import  User from '@/models/User



export default async function handler(req, res) {
    await connectDBJobPortal();
    const { method, query } = req;
    switch (method) {
      case 'GET':
        await validateToken(req, res, async () => {
          await getSpecifiedJob(query, res);
        });
        break;
      default:
        res.status(400).json({ success: false, message: 'Invalid Request' });
    }
  }
  


// Assuming you are passing the `_id` value as a query parameter
const getSpecifiedJob = async (data, res) => {
  const { id } = data;
  console.log(id);

  try {
    if (!id) {
      return res.status(400).json({ success: false, message: 'Please Login' });
    }
    
    const gettingjobs = await Job.findById(id).populate({ path: 'user', select: 'name email', model: User }).exec();

    gettingjobs.forEach(doc => {
      doc.job_date = formatDistanceToNow(new Date(doc.created_At), { addSuffix: true });
    });

    return res.status(200).json({ success: true, data: gettingjobs });
  } catch (error) {
    console.log('Error in getting a specified Job (server) => ', error);
    return res.status(403).json({ success: false, message: 'Something Went Wrong Please Retry login!' });
  }
};

  