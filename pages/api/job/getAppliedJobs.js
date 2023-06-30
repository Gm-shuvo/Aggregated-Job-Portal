import { connectDBJobPortal } from "@/DB/DbJobProtal";
import validateToken from "@/middleware/tokenValidation";
import ApplyJob from "@/models/ApplyJob";
import User from "@/models/User";
import Job from "@/models/Job";
import { Types } from "mongoose";

export const config = { 
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    await connectDBJobPortal();
    const { method } = req;
    switch (method) {
      case "GET":
        await validateToken(req, res, async () => {
          await getAppliedJobs(req, res);
        });
        break;
      default:
        res.status(400).json({ success: false, message: "Invalid Request" });
    }
  } catch (error) {
    console.log("Error in getting a specified Job (server) => ", error);
    return res
      .status(403)
      .json({
        success: false,
        message: "Something Went Wrong. Please Retry login!",
      });
  }
}

const getAppliedJobs = async (req, res) => {
  
  const id = req.userId.id;
  const _id = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : null;

  if (!_id) {
    return res.status(400).json({ success: false, message: 'Invalid Job ID format' });
  }

  
  try {
    
    const gettingAppliedJobs = await ApplyJob.find({ user: _id })
      .populate({ path: "user", model: User })
      .populate({ path: "job", model: Job });
    return res.status(200).json({ success: true, data: gettingAppliedJobs , message: "Applied Jobs" });
  } catch (error) {
    console.log("Error in getting applied  job (server) => ", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Something Went Wrong Please Retry login !",
      });
  }
};
