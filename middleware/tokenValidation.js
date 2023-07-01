import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const validateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  try {
    if (!token) {
      throw new Error('Unauthorized');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded;
    
    next();
  } catch (error) {
    console.log('Error in validating token (server) => ', error);
    return res.status(401).json({ success: false, error: error.name, message: 'Unauthorized Please login' });
  }
};

export default validateToken;
