import { connectDBJobPortal } from "@/DB/DbJobProtal";
import mongoose from "mongoose";

export default async function handler(req, res) {
  try{
    await connectDBJobPortal();
    const { method, query } = req;
    const { page } = query;

    switch (method) {
      case 'GET':
          await getAllLinkedInJobs(page, res);
        break;
      default:
        res.status(400).json({ success: false, message: 'Invalid Request' });
        break;
    }
    } catch (error) {
      console.log('Error connecting to the database:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const getAllLinkedInJobs = async (page, res) => {
  try {
    const pageSize = 20; // Adjust the page size as per your requirement
    const skip = (page - 1) * pageSize;
    
    const jobData = await mongoose.connection.db.collection('linkedinjobs')
      .find({})
      .skip(skip)
      .limit(pageSize)
      .sort({ _id: -1 })
      .toArray();
    
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
