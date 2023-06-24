import mongoose from 'mongoose';
// import DbLinkedIn from '@/pages/api/db2/connection';

const LinkedInJobSchema = new mongoose.Schema({
  job_title: {
    type: String,
    required: true,
  },
  job_type: {
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
  },
  job_date: {
    type: String,
    trim: true,
  },
  apply_link: {
    type: String,
    required: true,
  },
  job_description: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const linkedInJob =  mongoose.models.linkedInJob || mongoose.model("linkedInJob", LinkedInJobSchema);

export default linkedInJob;
