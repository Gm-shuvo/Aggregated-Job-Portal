import { connectDBJobPortal } from '@/DB/DbJobProtal';
import validateToken from '@/middleware/tokenValidation';
import Job from '@/models/Job';
import Joi from 'joi';

const schema = Joi.object({
  job_title: Joi.string().required(),
  
  company_name: Joi.string().required(),
  job_location: Joi.string().required(),
  job_description: Joi.string().required(),
});

export default async function handler(req, res) {
  await connectDBJobPortal();
  const { method } = req;
  switch (method) {
    case 'PUT':
      await validateToken(req, res, async () => {
        await editPostAJob(req, res);
      });
      break;
    default:
      res.status(400).json({ success: false, message: 'Invalid Request' });
  }
}

const editPostAJob = async (req, res) => {
  const data = req.body;
  const userId = req.userId?.id;
  const {
    id, // ID of the job to update
    job_title,
    company_name,
    job_location,
    job_description,
  } = data;

  console.log('data => ', data);

  // Validate the input data using the Joi schema
  const { error } = schema.validate({
    job_title,
    company_name,
    job_location,
    job_description,
  });

  if (error) {
    return res
      .status(401)
      .json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });
  }

  try {
    // Find the job by ID and update its fields
    const updatedJob = await Job.findOneAndUpdate(
      { _id: id, user: userId },
      {
        job_title,
        company_name,
        job_location,
        job_description,
      },
      { new: true } // Return the updated job document
    );

    if (!updatedJob) {
      return res.status(404).json({ success: false, message: 'Job not found or unauthorized' });
    }

    return res.status(200).json({ success: true, message: 'Job Updated Successfully!', data: updatedJob });
  } catch (error) {
    console.log('Error in updating a job (server) => ', error);
    return res
      .status(500)
      .json({ success: false, message: 'Something Went Wrong. Please Retry!' });
  }
};
