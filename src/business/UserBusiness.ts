import { UserInputDTO, LoginInputDTO } from "./entities/User";
import { UserDatabase } from "../data/UserDatabase";
import { IdGenerator } from "./services/IdGenerator";
import { HashManager } from "./services/HashManager";
import { Authenticator } from "./services/Authenticator";
import { CustomError } from "./error/CustomError";

const idGenerator = new IdGenerator()
const hashManager = new HashManager()
const authenticator = new Authenticator()
const userDatabase = new UserDatabase()

export class UserBusiness {

   async createUser(user: UserInputDTO) {

      const id = idGenerator.generate();

      const hashPassword = await hashManager.hash(user.password);

      await userDatabase.createUser(
         id,
         user.email,
         user.name,
         hashPassword,
         user.role
      );

      const accessToken = authenticator.generateToken({
         id,
         role: user.role
      });

      return accessToken;
   }

   async getUserByEmail(user: LoginInputDTO) {

      const userFromDB = await userDatabase.getUserByEmail(user.email);

      const passwordIsCorrect = await hashManager.compare(
         user.password,
         userFromDB.password
      );

      const accessToken = authenticator.generateToken({
         id: userFromDB.id,
         role: userFromDB.role
      });

      if (!passwordIsCorrect) {
         throw new CustomError(401, "Invalid credentials!");
      }

      return accessToken;
   }
}