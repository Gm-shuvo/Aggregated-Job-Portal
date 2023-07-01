import { connectDBJobPortal } from "@/DB/DbJobProtal";
import validateToken from "@/middleware/tokenValidation";
import BookMarkJob from "@/models/Bookmark";
import Joi from "joi";
import { Types, isValidObjectId } from "mongoose";

import Job from "@/models/Job";
import User from "@/models/User";
import Linkedinjob from "@/models/Linkedinjob";


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
  const s = req.body.s;
  const userId = req.userId;

  if (!id || !userId?.id) {
    return res.status(400).json({
      success: false,
      message: "Please Login...",
    });
  }

  const user_id = isValidObjectId(userId?.id) ? new Types.ObjectId(userId?.id) : null;
  const job_id = isValidObjectId(id)?  new Types.ObjectId(id) : null;

  console.log("user_id", user_id);
  console.log("job_id", job_id);
  console.log("source", s);

  try {
    const bookmarkingJob = await BookMarkJob.create({ job: job_id, user: user_id, source: s });
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
  const userId = req.userId;

  const user_id = isValidObjectId(userId?.id) ? new Types.ObjectId(userId?.id) : null;

  try {
    const getBookMark = await BookMarkJob.aggregate([
      {
        $match: { user: user_id }
      },
      {
        $lookup: {
          from: 'linkedinjobs', // The name of the LinkedIn jobs collection
          localField: 'job',
          foreignField: '_id',
          as: 'linkedinJob'
        }
      },
      {
        $lookup: {
          from: 'jobs', // The name of the jobs collection
          localField: 'job',
          foreignField: '_id',
          as: 'job'
        }
      },
      {
        $addFields: {
          job: {
            $cond: {
              if: { $eq: ['$source', 'LinkedIn'] },
              then: '$linkedinJob',
              else: '$job'
            }
          }
        }
      },
      {
        $unwind: '$job'
      },
      {
        $lookup: {
          from: 'users', // The name of the users collection
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      }
    ]);

    return res.status(200).json({
      success: true,
      message: 'Bookmarked jobs fetched successfully!',
      data: getBookMark
    });
  } catch (error) {
    console.log('Error in getting bookmarked jobs (server) => ', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later!'
    });
  }
};





export const delete_bookmark_job = async (req, res) => {
  const id = req.body.id  
  
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
