import { connectDBJobPortal } from "@/DB/DbJobProtal";
import Joi from "joi";
import AppliedJob from "@/models/ApplyJob";
import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";
import User from "@/models/User";

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

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET, 
});

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
        throw err;
      }

      const { name: [name], email: [email], about: [about], job: [job], user: [user] } = fields;
      console.log("🚀 ~ file: applyJob.js:62 ~ form.parse ~ user:", user)
      console.log("🚀 ~ file: applyJob.js:62 ~ form.parse ~ job:", job)
      console.log("🚀 ~ file: applyJob.js:62 ~ form.parse ~ about:", about)
      console.log("🚀 ~ file: applyJob.js:62 ~ form.parse ~ email:", email)
      console.log("🚀 ~ file: applyJob.js:62 ~ form.parse ~ name:", name)
      console.log("🚀 ~ file: applyJob.js:62 ~ form.parse ~ user:", user)
      console.log("🚀 ~ file: applyJob.js:62 ~ form.parse ~ fields:", files.cv)

      const { error } = schema.validate({ name, email, about, job, user });
      if (error) {
        return res.status(401).json({
          success: false,
          message: error.details[0].message.replace(/['"]+/g, ""),
        });
      }

      const cvFile = files.cv[0].filepath;
      console.log("🚀 ~ file: applyJob.js:79 ~ form.parse ~ cvFile:", cvFile)

      try {
        // Upload the CV file to Cloudinary
        const cloudinaryUpload = await cloudinary.uploader.upload(cvFile, {
          folder: "job_portal/uploads",
          resource_type: "image",
        });

        const cvUrl = cloudinaryUpload.secure_url;
        console.log("🚀 ~ file: applyJob.js:81 ~ form.parse ~ cvUrl:", cvUrl)

        // Create the job application
        const jobApplication = {
          name,
          email,
          about,
          job,
          user,
          cv: cvUrl,
        };

        // Check if the user has already applied for this job
        const jobApplicationExists = await AppliedJob.findOne({
          email,
          user,
          job,
        });

        if (jobApplicationExists) {
          return res.status(401).json({
            success: false,
            message: "You have already applied for this job!",
          });
        }

        // Create a new job application document
        const newJobApplication = await AppliedJob.create(jobApplication);

        // Update the user's profile with the CV URL if the user is of type 'candidate'
        const userObj = await User.findById(user);

        if (userObj.type === "candidate") {
          await User.updateOne({ _id: user }, { cv: cvUrl });
        }

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
