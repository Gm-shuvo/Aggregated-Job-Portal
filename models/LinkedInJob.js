import mongoose from 'mongoose';
import DbLinkedIn from '@/pages/api/db2/connection';

const JobSchema = new mongoose.Schema({
  job_title: {
    type: String,
    required: true,
  },
  job_types: {
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

const linkedInJob =  DbLinkedIn.models.linkedInJob || DbLinkedIn.model('linkedInJob', JobSchema);

export default linkedInJob;
