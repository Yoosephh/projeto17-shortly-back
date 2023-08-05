import { Router } from "express";
import {createUrl, sendUrl, redirectUser, deleteUrl, rankUrls} from "../controllers/urls.controllers.js"
import { validateSchemas } from "../middlewares/validateSchema.middleware.js";
import { checkUrlSchema } from "../schemas/urls.schema.js";
const urlsRoute = Router();

urlsRoute.post("/urls/shorten", validateSchemas(checkUrlSchema), createUrl)

urlsRoute.get("/urls/:id", sendUrl)

urlsRoute.get("/urls/open/:shortUrl", redirectUser)

urlsRoute.delete("/urls/:id", deleteUrl)
urlsRoute.get("/ranking", rankUrls)

export default urlsRoute;