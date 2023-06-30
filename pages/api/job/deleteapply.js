import { connectDBJobPortal } from "@/DB/DbJobProtal";
import validateToken from "@/middleware/tokenValidation";
import ApplyJob from "@/models/ApplyJob";
import Joi from "joi";
import { Types, isValidObjectId } from "mongoose";

export const config = {
    api: {
      externalResolver: true,
      bodyParser: true,
    },
};

export default async function handler(req, res) {
  try{
    await connectDBJobPortal();

    switch (req.method) {
      case "POST":
        await validateToken(req, res, async () => {
          await delete_job(req, res);
        }
        );
        break;

      default:
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }catch(error){
    console.log("Error in apply job (server) => ", error);
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong Please Retry login !",
    });
  }
}


export const delete_job = async (req, res) => {
  const id = req.body.id;
  console.log("🚀 ~ file: deleteapply.js:41 ~ constdelete_job= ~ id:", id)


  if(!id){
    return res.status(400).json({
      success: false,
      message: "Invalid Request",
    });
  }
  try{
  const _id  = isValidObjectId(id) ? new Types.ObjectId(id) : null;
  const delete_apply_job = await ApplyJob.findByIdAndDelete(_id);

  console.log("🚀 ~ file: deleteapply.js:53 ~ constdelete_job= ~ delete_apply_job:", delete_apply_job)
  
  return res.status(200).json({
    success: true,
    message: "Job Deleted Successfully",
  });
  }catch(error){
    console.log("Error in delete apply job (server) => ", error);
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong Please Retry login !",
    });
  }
}