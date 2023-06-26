import mongoose from "mongoose";
import { formatDistanceToNow } from "date-fns";

const JobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    job_title: {
      type: String,
      required: true,
    },
    job_type: {
      type: String,
      required: true,
      trim: true,
    },
    job_level: {
      type: String,
      required: true,
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
    created_At: {
      type: Date,
      default: Date.now,
    },
    source: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Virtual getter for job_date
JobSchema.virtual("job_date").get(function () {
  return formatDistanceToNow(this.created_At, { addSuffix: true });
});

const Job = mongoose.models.Job || mongoose.model("Job", JobSchema);

export default Job;
