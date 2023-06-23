import { connectDBJobPortal } from "@/DB/DbJobProtal";
import validateToken from "@/middleware/tokenValidation";
import Job from "@/models/Job";
// import User from "@/models/User"

export default async function handler(req, res) {
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
}

const getPostedJobs = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, message: "Please Login" });
  }

  try {
    const gettingJobs = await Job.find({ user: id })
    .populate({ path: "user", select: "name email" })
    .exec();

    return res.status(200).json({ success: true, data: gettingJobs });
  } catch (error) {
    console.log("Error in getting a specified Job job (server) => ", error);
    return res
      .status(403)
      .json({ success: false, message: "Something Went Wrong. Please Retry login!" });
  }
};
