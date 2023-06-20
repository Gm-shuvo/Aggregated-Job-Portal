import DbLinkedIn from "@/pages/api/db2/connection";

export default async function handler (req, res) {
  const { method } = req;
  switch (method) {
    case 'GET':
        await getAllLinkedInJobs(req, res);
      break;
    default:
      res.status(400).json({ success: false, message: 'Invalid Request' });
      break; // Add a break statement here
  }
};


const getAllLinkedInJobs = async (req, res) => {
  try {
    // const db = await DbLinkedIn.connect(DBSCRAPY_URL);
    const collect =  DbLinkedIn.db.collection('linkedInJobs');
    const jobData = await collect.find({}).toArray();

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

