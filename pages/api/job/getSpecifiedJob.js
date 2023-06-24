import {connectDBJobPortal} from '@/DB/DbJobProtal';
import Job from '@/models/Job';
// import  User from '@/models/User



export default async function handler({ method, query }, res) {
    await connectDBJobPortal();
  
    switch (method) {
      case 'GET':
        await getSpecifiedJob(query, res);
        break;
      default:
        res.status(400).json({ success: false, message: 'Invalid Request' });
    }
  }
  


const getSpecifiedJob = async (data, res) => {
    const { id } = data;
    console.log(id)
    
  
    try {
      if (!id ) {
        return res.status(400).json({ success: false, message: 'Please Login' });
      }
      const gettingjobs = await Job.findById({_id : id}).populate({path:'user',select: 'name email'}).exec();
      return res.status(200).json({ success: true, data: gettingjobs });
    } catch (error) {
      console.log('Error in getting a specified Job (server) => ', error);
      return res.status(403).json({ success: false, message: 'Something Went Wrong Please Retry login!' });
    }
};
  