import { connectDBJobPortal } from '@/DB/DbJobProtal';
import validateToken from '@/middleware/tokenValidation';
import Job from '@/models/Job';
import Joi from 'joi';

const schema = Joi.object({
  user: Joi.required(),
  job_title: Joi.string().required(),
  job_types: Joi.string().valid('fulltime', 'parttime', 'remote').required(),
  company_name: Joi.string().required(),
  job_location: Joi.string().required(),
  job_description: Joi.string().required(),
});

export default async function handler(req, res) {
  await connectDBJobPortal();
  const { method } = req;
  switch (method) {
    case 'POST':
      await validateToken(req, res, async () => {
        await postAJob(req, res);
      });
      break;
    default:
      res.status(400).json({ success: false, message: 'Invalid Request' });
  }
}

const postAJob = async (req, res) => {
  await connectDBJobPortal();
  const data = req.body;

  const {
    user,
    job_title,
    job_types,
    company_name,
    job_location,
    job_description,
  } = data;

  // console.log('data => ', data);

  const { error } = schema.validate({
    user,
    job_title,
    job_types,
    company_name,
    job_location,
    job_description,
  });

  // console.log('error => ', error);

  if (error)
    return res
      .status(401)
      .json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });

  try {
    const creatingJob = await Job.create({
      user,
      job_title,
      job_types,
      company_name,
      job_location,
      job_description,
    });
    return res.status(200).json({ success: true, message: 'Job Posted Successfully!' });
  } catch (error) {
    console.log('Error in posting a job (server) => ', error);
    return res
      .status(500)
      .json({ success: false, message: 'Something Went Wrong. Please Retry!' });
  }
}
