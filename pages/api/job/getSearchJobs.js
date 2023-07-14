import { connectDBJobPortal } from "@/DB/DbJobProtal";
import Job from "@/models/Job";
import Linkedinjob from "@/models/Linkedinjob";
import User from "@/models/User";
import mongoose from "mongoose";

export default async function handler(req, res) {
  try {
    await connectDBJobPortal();
    // console.log('req', req);
    const { method } = req;
    switch (method) {
      case "GET":
        await getSearchJobs(req, res);
        break;
      default:
        res.status(400).json({ success: false, message: "Invalid Request" });
    }
  } catch (error) {
    console.log("Error in getting a job (server) => ", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Something Went Wrong Please Retry login  !",
      });
  }
}

const getSearchJobs = async (req, res) => {
  const filter = {};
  Object.keys(req.query).forEach((param) => {
    if (req.query[param]) {
      if (param === "q") {
        filter.job_title = { $regex: req.query[param], $options: "i" };
      }
        // if(param === "q"){
        //   filter.company_name = { $regex: req.query[param], $options: "i" };  
        // }
      if(param === "loc"){
        filter.job_location = { $regex: req.query[param], $options: "i" };  
      }
      if(param === "jt"){
        filter.job_type = req.query[param];  
      }
      if(param === "jl"){
        filter.job_level = req.query[param];  
      }
    }
  });
  console.log("filter", filter);


  
  try {
    const jobs = await Job.find({...filter}).populate({path:'user', select: 'name email _id', model: User}).sort({created_At: 'asc'});
    const linkedInJobs = await mongoose.connection.db.collection('linkedinjobs').find({...filter}).limit(5).toArray();

    console.log("jobs", jobs);
    console.log("linkedInJobs", linkedInJobs);

    return res.status(200).json({ success: true, data: jobs, message: "Jobs Found Successfully!" });
  } catch (error) {
    console.log("Error in getting jobs (server) => ", error);
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong. Please Retry!",
    });
  }
};

