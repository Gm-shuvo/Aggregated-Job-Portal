import { connectDBJobPortal } from "@/DB/DbJobProtal";
import validateToken from "@/middleware/tokenValidation";
import AppliedJob from "@/models/ApplyJob";

export const config = {
  api: {
    externalResolver: true,
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  try {
    await connectDBJobPortal();
    const { method } = req;
    switch (method) {
      case "PUT":
        await validateToken(req, res, async () => {
          await change_application_status(req, res);
        });
        break;
      default:
        res.status(400).json({ success: false, message: "Invalid Request" });
    }
  } catch (error) {
    console.log("Error in getting a specifed Job job (server) => ", error);
    return res.status(403).json({
      success: false,
      message: "Something Went Wrong Please Retry login !",
    });
  }
}

const change_application_status = async (req, res) => {
  const data = req.body;
  const { status, id } = data;

  if (!id)
    return res.status(400).json({ success: false, message: "Please Login" });

  try {
    const gettingjobs = await AppliedJob.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Status Updated Successfully ",
      data: gettingjobs,
    });
  } catch (error) {
    console.log("Error in getting a specifed Job job (server) => ", error);
    return res.status(403).json({
      success: false,
      message: "Something Went Wrong Please Retry login !",
    });
  }
};
