import express, { Request, Response } from "express";
import { compare, hash } from "./services/HashManager";
import { AddressInfo } from "net";
import { generateToken } from "./services/Authenticator";
import { generateId } from "./services/IdGenerator";
import knex from "knex";
import Knex from "knex";
import dotenv from "dotenv";

dotenv.config();

export const connection: Knex = knex({
   client: "mysql",
   connection: {
      host: process.env.DB_HOST,
      port: 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
   },
})


const toUserModel = (user: any): User => ({
   id: user.id,
   name: user.name,
   email: user.email,
   password: user.password,
   role: stringToUserRole(user.role)
})

const app = express();

app.use(express.json());

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

app.post("user/signup", async (req: Request, res: Response) => {
   try {

      const input: UserInputDTO = {
         email: req.body.email,
         name: req.body.name,
         password: req.body.password,
         role: req.body.role
      }

      const id = generateId();

      const hashPassword = await hash(input.password!);

      await connection.insert({
         id:id,
         email:input.email,
         name:input.name,
         password:hashPassword,
         role:input.role
      })
      .into("user");
        
      const token = generateToken({
         id,
         role: input.role
      });

      res.status(200).send({ token });

   } catch (error) {
      res
         .status(error.statusCode || 400)
         .send({ error: error.message });
   }
});

app.post("user/login", async (req: Request, res: Response) => {

   try {

      const loginData: LoginInputDTO = {
         email: req.body.email,
         password: req.body.password
      };

      const result = await connection
      .select("*")
      .from("user")
      .where({ email:loginData.email });
      
      const userFromDB = toUserModel(result[0]);
      
      const passwordIsCorrect = await compare(
         loginData.password,
         userFromDB.password
      );

      const token = generateToken({
         id: userFromDB.id,
         role: userFromDB.role
      });

      if (!passwordIsCorrect) {
         throw new Error("Invalid credentials!");
      }
      res.status(200).send({ token });

   } catch (error) {
      res
         .status(error.statusCode || 400)
         .send({ error: error.message });
   }
});

const server = app.listen(3003, () => {
   if (server) {
      const address = server.address() as AddressInfo;
      console.log(`Servidor rodando em http://localhost:${address.port}`);
   } else {
      console.error(`Falha ao rodar o servidor.`);
   }
});  