import { connectDBJobPortal } from "@/DB/DbJobProtal";
import Joi from "joi";
import AppliedJob from "@/models/ApplyJob";
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
// import validateToken from "@/middleware/tokenValidation";

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  about: Joi.string().required(),
  job: Joi.string().required(),
  user: Joi.string().required(),
});

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
      case "POST":
        await applyToJob(req, res);
        break;
      default:
        res.status(400).json({ success: false, message: "Invalid Request" });
    }
  } catch (error) {
    console.log("Error in getting a specified Job (server) => ", error);
    return res.status(403).json({
      success: false,
      message: "Something Went Wrong. Please Retry login!",
    });
  }
}

const applyToJob = async (req, res) => {
  try {
    
    const form = formidable({ multiples: false });

    form.header = req.headers;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        // console.log("Error", err);
        throw err;
      }

      // console.log("🚀 ~ file: applyJob.js:61 ~ form.parse ~ fields", fields);
      console.log("🚀 ~ file: applyJob.js:61 ~ form.parse ~ files", files);

      const { name: [name], email: [email], about:[about], job: [job], user: [user] } = fields;

      const { error } = schema.validate({ name, email, about, job, user });
      if (error) {
        console.log("Error", error);

        return res.status(401).json({
          success: false,
          message: error.details[0].message.replace(/['"]+/g,""),
          
        });
      }

      // console.log("files", files);
      const cvFile = files.cv[0].filepath;
      // console.log("cvFile", cvFile);
      const originalFileName  = files.cv[0].originalFilename
            
      console.log("🚀 ~ file: applyJob.js:79 ~ form.parse ~ originalFileName:", originalFileName)
      const fileExtension = path.extname(originalFileName);
      // console.log("🚀 ~ file: applyJob.js:81 ~ form.parse ~ fileExtension:", fileExtension)
      const randomString = crypto.randomBytes(6).toString("hex");
      // console.log("🚀 ~ file: applyJob.js:83 ~ form.parse ~ randomString:", randomString)
      const fileName = `${originalFileName.replace(
        fileExtension,
        ""
      )}_${randomString}${fileExtension}`;
      console.log("🚀 ~ file: applyJob.js:88 ~ form.parse ~ fileName:", fileName)
      
      
      const newPath = path.join(process.cwd(), "public", "uploads", fileName);

      // await fs.rename(cvFile, newPath);
      await fs.copyFile(cvFile, newPath);
      await fs.unlink(cvFile);

      const jobApplication = {
        name,
        email,
        about,
        job,
        user,
        cv: fileName,
      };
      try{
      const jobApplicationExists = await AppliedJob.findOne({
        email, user, job});

      if (jobApplicationExists) {
        return res.status(401).json({
          success: false,
          message: "You have already applied for this job!",
        });
      }

      console.log("jobApplication", jobApplication);

      const newJobApplication = await AppliedJob.create(jobApplication);
      return res.status(200).json({
        success: true,
        message: "Job application submitted successfully!",
      });
      
    } catch (error) {
      console.log("Error in apply job (server) => ", error);
      return res.status(403).json({
        success: false,
        message: "Something Went Wrong. Please Retry login!",
      });
    }
    });
  } catch (error) {
    console.log("Error in apply job (server) => ", error);
    
  }
};
