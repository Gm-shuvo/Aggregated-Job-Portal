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


    switch (req.method) {
      
      case "POST":
        await validateToken(req, res, async () => {
          await bookmark_check(req, res);
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

export const bookmark_check = async (req, res) => {
  
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
    const checkAlreadyBookmarked = await BookMarkJob.findOne({ job: job_id, user: user_id });

    console.log("checkAlreadyBookmarked", checkAlreadyBookmarked)

    if (checkAlreadyBookmarked?._id) {
      return res.status(200).json({
        success: true,
        message: "This Job is Already in Bookmark",
      });
    }
  } catch (error) {
    console.log("Error in bookmarking a job (server) => ", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please retry.",
    });
  }
};

