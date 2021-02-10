export type User = {

   id: string,
   name: string,
   email: string,
   password: string,
   role: UserRole
}


export const stringToUserRole = (input: string): UserRole => {
   switch (input) {
      case "NORMAL":
         return UserRole.NORMAL;
      case "ADMIN":
         return UserRole.ADMIN;
      default:
         throw new Error("Invalid user role");
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