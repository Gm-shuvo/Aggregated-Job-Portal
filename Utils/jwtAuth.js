import jwt from "jsonwebtoken";

export const tokenGenerate =(payload)=>{ 
    const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
    
  ) 
  return token
};