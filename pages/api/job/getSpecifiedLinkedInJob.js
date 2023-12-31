import { connectDBJobPortal } from '@/DB/DbJobProtal';
import { connection, Types } from 'mongoose';

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
  if(!_id){
    return res.status(400).json({ success: false, message: 'Invalid Job ID format' });
  }
  console.log(_id);
  try {

    const jobData = await connection.db.collection('linkedinjobs').findOne({ _id: _id });
    // const linkedInJobs = await mongoose.connection.db.collection('linkedinjobs').find({...filter}).limit(5).toArray();

    if (!jobData) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    console.log('formattedJob specificLinkedInJobs => ', jobData);

    return res.status(200).json({ success: true, data: jobData });
  } catch (error) {
    console.log('Error in getting a specified Job (server) => ', error);

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ success: false, message: 'Invalid Job ID format' });
    }

    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
