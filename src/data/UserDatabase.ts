import { BaseDatabase } from "./BaseDatabase";
import { User } from "../business/entities/User";
import { CustomError } from "../business/error/CustomError";

export class UserDatabase extends BaseDatabase {

   private static TABLE_NAME = "user";

   private static toUserModel(user: any): User {
      return new User(
         user.id,
         user.name,
         user.email,
         user.password,
         User.stringToUserRole(user.role)
      );
   }

   public async createUser(
      id: string,
      email: string,
      name: string,
      password: string,
      role: string
   ): Promise<void> {
      try {
         await BaseDatabase.connection
            .insert({
               id,
               email,
               name,
               password,
               role
            })
            .into(UserDatabase.TABLE_NAME);
      } catch (error) {
         throw new CustomError(500, "An unexpected error ocurred");
      }
   }

   public async getUserByEmail(email: string): Promise<User> {
      try {
         const result = await BaseDatabase.connection
            .select("*")
            .from(UserDatabase.TABLE_NAME)
            .where({ email });

         return UserDatabase.toUserModel(result[0]);
      } catch (error) {
         throw new CustomError(500, "An unexpected error ocurred");
      }
   }
}