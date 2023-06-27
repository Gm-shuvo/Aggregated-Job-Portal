import { connectDBJobPortal } from "@/DB/DbJobProtal";
import validateToken from "@/middleware/tokenValidation";
import BookMarkJob from "@/models/Bookmark";
import Joi from "joi";
import { Types, isValidObjectId } from "mongoose";

export const config = {
  api: {
    externalResolver: true,
    bodyParser: true,
  },
};

const schema = Joi.object({
  user: Joi.required(),
  job: Joi.required(),
});

export default async function handler(req, res) {
  try {
    await connectDBJobPortal();

    // const jobId = req.body?.jobId;

    // console.log("req.body", jobId);

    switch (req.method) {
      case "POST":
        await validateToken(req, res, async () => {
          await bookmark_A_job(req, res);
        });
        break;
      case "GET":
        await validateToken(req, res, async () => {
          await getBookmark_jobs(req, res);
        });
        break;
      case "DELETE":
        await validateToken(req, res, async () => {
          await delete_bookmark_job(req, res);
        });
        break;
      default:
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.log("Error in bookmarking a job (server) => ", error);
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong Please Retry login !",
    });
  }
}

export const bookmark_A_job = async (req, res) => {
  
  const id = req.body.id;
  const userId = req.userId;

  // console.log("req.body", req)

  const user_id = isValidObjectId(userId?.id) ? new Types.ObjectId(userId?.id) : null;
  const job_id = isValidObjectId(id)?  new Types.ObjectId(id) : null;

  console.log("user_id", user_id);
  console.log("job_id", job_id);
  
  if (!user_id || !job_id) {
    return res.status(400).json({
      success: false,
      message: "Please Login...",
    });
  }


  try {
    const bookmarkingJob = await BookMarkJob.create({ job: job_id, user: user_id });
    return res.status(200).json({
      success: true,
      message: "Job Bookmarked successfully!",
    });
  } catch (error) {
    console.log("Error in bookmarking a job (server) => ", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please retry.",
    });
  }
};


export const getBookmark_jobs = async (req, res) => {
  const userId = req.query.id;

  if (!userId)
    return res.status(400).json({ success: false, message: "Please Login" });
  try {
    const getBookMark = await BookMarkJob.find({ user: userId })
      .populate("job")
      .populate("user");
    return res.status(200).json({
      success: true,
      message: "Job Bookmarked successfully !",
      data: getBookMark,
    });
  } catch (error) {
    console.log("Error in getting book mark Job (server) => ", error);
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong Please Retry Later !",
    });
  }
};

export const delete_bookmark_job = async (req, res) => {
  const id = req.body;
  if (!id)
    return res.status(400).json({ success: false, message: "Please Login" });
  try {
    const deleteBookmark = await BookMarkJob.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ success: true, message: "Job removed successfully !" });
  } catch (error) {
    console.log("Error in deleting book mark Job (server) => ", error);
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong Please Retry Later !",
    });
  }
};
