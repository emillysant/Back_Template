import { UserInputDTO, LoginInputDTO } from "./entities/User";
import * as userDatabase  from "../data/UserDatabase";
import { generateId } from "./services/IdGenerator";
import { hash, compare } from "./services/HashManager";
import { generateToken, getData } from "./services/Authenticator";

export const createUser = async (user: UserInputDTO) => {

   const id = generateId();

   const hashPassword = await hash(user.password);

   await userDatabase.createUser(
      id,
      user.email,
      user.name,
      hashPassword,
      user.role
   );

   const accessToken = generateToken({
      id,
      role: user.role
   });

   return accessToken;
}

export const getUserByEmail = async (user: LoginInputDTO) => {

   const userFromDB = await userDatabase.getUserByEmail(user.email);

   const passwordIsCorrect = await compare(
      user.password,
      userFromDB.password
   );

   const accessToken = generateToken({
      id: userFromDB.id,
      role: userFromDB.role
   });

   if (!passwordIsCorrect) {
      throw new Error("Invalid credentials!");
   }

   return accessToken;
}
