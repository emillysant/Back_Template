import * as bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

export const hash = async (
   text: string
): Promise<string> => {
   const rounds = Number(process.env.BCRYPT_COST)
   const salt = await bcrypt.genSalt(rounds);
   const result = await bcrypt.hash(text, salt);
   return result;
}

export const compare = async (
   text: string,
   hash: string
): Promise<boolean> => {
   return bcrypt.compare(text, hash);
}