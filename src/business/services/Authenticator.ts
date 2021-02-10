import * as jwt from "jsonwebtoken";
import { AuthenticationData } from "../entities/User";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (
   input: AuthenticationData,
   expiresIn: string = process.env.JWT_EXPIRES_IN!
): string =>{
   const token = jwt.sign(
      input,
      process.env.JWT_KEY as string,
      {
         expiresIn,
      }
   );
   return token;
}

export const getData = (
   token: string
): AuthenticationData =>{

   const payload = jwt.verify(
      token, process.env.JWT_KEY as string
   ) as AuthenticationData;

   const result = {
      id: payload.id,
      role: payload.role
   };

   return result;
}
