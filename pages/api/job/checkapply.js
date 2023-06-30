import { connectDBJobPortal } from "@/DB/DbJobProtal";
import validateToken from "@/middleware/tokenValidation";
import Joi from "joi";
import { Types, isValidObjectId } from "mongoose";
import AppliedJob from "@/models/ApplyJob";

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
          await apply_check(req, res);
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

export const apply_check = async (req, res) => {
  const id = req.body.id;
  const userId = req.userId.id;



  console.log("req.body", req);

  console.log("job_id", id);
  console.log("user_id", userId);

  if (!id || !userId) {
    console.log("Invalid Request");
    return res.status(400).json({
      success: false,
      message: "Invalid Request",
    });

  }

  const user_id = isValidObjectId(userId)
    ? new Types.ObjectId(userId)
    : null;
  const job_id = isValidObjectId(id) ? new Types.ObjectId(id) : null;
  

  try {
    const appliedAlready = await AppliedJob.findOne({
      job: job_id,
      user: user_id,
    });

    

    console.log("appliedAlready",appliedAlready);

    if (appliedAlready) {
      return res.status(200).json({
        success: true,
        message: "This Job is Already in applyed",
      });
  } else {
    return res.status(200).json({
      success: false,
      message: "This Job is not in applyed",
    });
  }
    
  } catch (error) {
    console.log("Error in Apply a job (server) => ", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please retry.",
    });
  }
};
