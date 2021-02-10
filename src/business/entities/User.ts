import { CustomError } from "../error/CustomError";

export class User {
   constructor(
      public readonly id: string,
      public readonly name: string,
      public readonly email: string,
      public readonly password: string,
      public readonly role: UserRole
   ) { }


   static stringToUserRole(input: string): UserRole {
      switch (input) {
         case "NORMAL":
            return UserRole.NORMAL;
         case "ADMIN":
            return UserRole.ADMIN;
         default:
            throw new CustomError(422,"Invalid user role");
      }
   }
}

export interface UserInputDTO {
   email: string;
   password: string;
   name: string;
   role: string;
}

export interface LoginInputDTO {
   email: string;
   password: string;
}

export enum UserRole {
   NORMAL = "NORMAL",
   ADMIN = "ADMIN"
}

export interface AuthenticationData {
   id: string;
   role?: string;
}