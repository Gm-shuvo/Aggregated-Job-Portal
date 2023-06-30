import { connectDBJobPortal } from "@/DB/DbJobProtal";
import validateToken from "@/middleware/tokenValidation";
import Job from "@/models/Job";
import User from "@/models/User";
import { formatDistanceToNow } from "date-fns";
import { Types } from "mongoose";
import { isValidObjectId } from "mongoose";

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
          await getPostedJobs(req, res);
        });
        break;
      default:
        res.status(400).json({ success: false, message: "Invalid Request" });
        break;
    }
  } catch (error) {
    console.log("Error in getPostedJobs (server) => ", error);
    return res.status(403).json({
      success: false,
      message: "Something Went Wrong. Please Retry login!",
    });
  }
}

const getPostedJobs = async (req, res) => {
  const { id } = req.query;

  console.log("id getPostedJobs=> ", id);

  if (!id) {
    return res.status(400).json({ success: false, message: "Please Login" });
  }

  const _id = isValidObjectId(id) ? new Types.ObjectId(id) : null;

  try {
    const gettingJobs = await Job.find({ user: _id })
      .populate({ path: "user", select: "name email", model: User })
      .exec();

    const formattedJobs = gettingJobs.map((job) => {
      const formattedJob = job.toObject();
      formattedJob.job_date = formatDistanceToNow(new Date(job.createdAt), {
        addSuffix: true,
      });
      return formattedJob;
    });

    return res
      .status(200)
      .json({
        success: true,
        data: formattedJobs,
        message: "Successfully get all posted jobs",
      });
  } catch (error) {
    console.log("Error in getting a specified Job job (server) => ", error);
    return res.status(403).json({
      success: false,
      message: "Something Went Wrong. Please Retry login!",
    });
  }
};
