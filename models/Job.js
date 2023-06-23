import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    job_title: {
      type: String,
      required: true,
    },
    job_types: {
      type: String,
      required: true,
      trim: true,
    },
    job_level:{
      type: String,
      required:true,
      trim: true,
    },
    company_name: {
      type: String,
      required: true,
    },
    job_location: {
      type: String,
      required: true,
    },
    job_description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Job = mongoose.models.Job || mongoose.model("Job", JobSchema);

export default Job;
