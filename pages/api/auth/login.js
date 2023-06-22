import { connectDBJobPortal } from '@/DB/DbJobProtal';
import User from '@/models/User';
import Joi from 'joi';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export default async function handler(req, res) {
  await connectDBJobPortal();

  const { email, password } = req.body;

  console.log(email, password);

  try {
    const { error } = schema.validate({ email, password });

    if (error) {
      return res.status(401).json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });
    }

    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.status(401).json({ success: false, message: 'Account not Found' });
    }

    const isMatch = await compare(password, checkUser.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect Email or Password' });
    }

    const token = jwt.sign({ id: checkUser._id, email: checkUser.email }, process.env.JWT_SECRET, {expiresIn: '1d'});
    const finalData = { token, user: checkUser };
    return res.status(200).json({ success: true, message: 'Login Successful', finalData });
  } catch (error) {
    console.log('Error in login (server) => ', error);
    return res.status(500).json({ success: false, message: 'Something Went Wrong. Please Retry Later!' });
  }
}
