import { connectDBJobPortal } from "@/DB/DbJobProtal";
import validateToken from "@/middleware/tokenValidation";
import AppliedJob from "@/models/ApplyJob";
import User from "@/models/User";
import { Types } from "mongoose";
import { isValidObjectId } from "mongoose";

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};

export default async function handle(req, res) {
  try {
    await connectDBJobPortal();
    const { method } = req;
    switch (method) {
      case "GET":
        await validateToken(req, res, async () => {
          await getAllApplicationsOfSpecifiedJob(req, res);
        });
        break;
      default:
        res.status(400).json({ success: false, message: "Invalid Request" });
    }
  } catch (error) {
    console.log("Error in getting a specifed Job job (server) => ", error);
    return res.status(403).json({
      success: false,
      message: "Something Went Wrong Please Retry login  !",
    });
  }
}

const getAllApplicationsOfSpecifiedJob = async (req, res) => {
  const {id} = req.query;

  if (!id)
    return res.status(400).json({ success: false, message: "Please Login" });

  const _id = isValidObjectId(id) ? new Types.ObjectId(id) : null;

  try {
    const gettingjobs = await AppliedJob.find({ job: _id }).populate({path:"user" ,select: "name email", model: User});
    return res.status(200).json({ success: true, data: gettingjobs });
  } catch (error) {
    console.log("Error in getting a specifed Job job (server) => ", error);
    return res.status(403).json({
      success: false,
      message: "Something Went Wrong Please Retry login  !",
    });
  }
};
