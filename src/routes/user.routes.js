import { Router } from "express";
import {signUp, signIn, sendUser} from "../controllers/user.controllers.js"
import { validateSchemas } from "../middlewares/validateSchema.middleware.js";
import { signInSchema, signUpSchema } from "../schemas/auth.schema.js";
const userRoute = Router();

userRoute.post("/signup", validateSchemas(signUpSchema), signUp)

userRoute.post("/signin", validateSchemas(signInSchema), signIn)

userRoute.get("/users/me",  sendUser)

export default userRoute;