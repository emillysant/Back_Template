import express from "express";
import * as userController  from "../UserController";


export const userRouter = express.Router();

userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);