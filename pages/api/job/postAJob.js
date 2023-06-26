import { connectDBJobPortal } from '@/DB/DbJobProtal';
import validateToken from '@/middleware/tokenValidation';
import Job from '@/models/Job';
import { formatDistanceToNow } from 'date-fns';
import Joi from 'joi';

const schema = Joi.object({
  job_title: Joi.string().required(),
  job_type: Joi.string().valid('Full-time', 'Part-time', 'Remote', 'Intern').required(),
  job_level: Joi.string().required(),
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
  const data = req.body;
  const userId = req.userId;
  console.log('userId => ', userId);
  const {
    job_title,
    job_type,
    job_level,
    company_name,
    job_location,
    job_description,
  } = data;

  console.log('data => ', data);

  const { error } = schema.validate({
    job_title,
    job_type,
    job_level,
    company_name,
    job_location,
    job_description,
  });

  console.log('error => ', error);

  if (error)
    return res
      .status(401)
      .json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });

  try {
    // const job_date = formatDistanceToNow(new Date(), { addSuffix: true });

    const source = "JobBit";

    console.log('userId?.id => ', userId?.id);
    // console.log('job_date => ', job_date);
    console.log('source => ', source);

    const createdJob = await Job.create({
      user: userId?.id,
      job_title,
      job_type,
      job_level,
      company_name,
      job_location,
      job_description,
      source,
    });

    console.log('createdJob => ', createdJob);

    return res.status(200).json({ success: true, message: 'Job Posted Successfully!', data: createdJob });
  } catch (error) {
    console.log('Error in posting a job (server) => ', error);
    return res
      .status(500)
      .json({ success: false, message: 'Something Went Wrong. Please Retry!' });
  }
}
