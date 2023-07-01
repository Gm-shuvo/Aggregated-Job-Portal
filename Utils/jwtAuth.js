import jwt from "jsonwebtoken";

import dotenv from 'dotenv';
dotenv.config();

export const tokenGenerate =(payload)=>{ 
    const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
    
  ) 
  return token
};