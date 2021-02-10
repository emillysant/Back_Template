import { connection } from "./BaseDatabase";
import { stringToUserRole, User } from "../business/entities/User";

const TABLE_NAME = "user";

const toUserModel = (user: any): User => ({
   id: user.id,
   name: user.name,
   email: user.email,
   password: user.password,
   role: stringToUserRole(user.role)
})

export const createUser = async(
   id: string,
   email: string,
   name: string,
   password: string,
   role: string
): Promise<void> => {
   try {
      await connection
         .insert({
            id,
            email,
            name,
            password,
            role
         })
         .into(TABLE_NAME);
   } catch (error) {
      throw new Error("An unexpected error ocurred");
   }
}

export const getUserByEmail = async (email: string): Promise<User> => {
   try {
      const result = await connection
         .select("*")
         .from(TABLE_NAME)
         .where({ email });

      return toUserModel(result[0]);
   } catch (error) {
      throw new Error("An unexpected error ocurred");
   }
}