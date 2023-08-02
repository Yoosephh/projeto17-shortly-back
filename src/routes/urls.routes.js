import { Router } from "express";
import {createUrl, sendUrl, redirectUser, deleteUrl} from "../controllers/urls.controllers.js"
const urlsRoute = Router();

urlsRoute.post("/urls/shorten", createUrl)

urlsRoute.get("/urls/:id", sendUrl)

urlsRoute.get("/urls/open/:shortUrl", redirectUser)

urlsRoute.delete("/urls/:id", deleteUrl)

export default urlsRoute;