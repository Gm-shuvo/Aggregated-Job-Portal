import mongoose from "mongoose";

const LinkedinJobSchema = new mongoose.Schema({
  apply_link: {
    type: String,
    required: true,
  },
  company_name: {
    type: String,
    required: true,
  },
  job_description: {
    type: String,
    required: true,
  },
  job_level: {
    type: String,
    required: true,
  },
  job_location: {
    type: String,
    required: true,
  },
  job_title: {
    type: String,
    required: true,
  },
  job_type: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  job_date: {
    type: Date,
    required: true,
  },
});

const LinkedinJob = mongoose.model("Linkedinjob", LinkedinJobSchema);

export default LinkedinJob;
