import { Router } from "express";
import urlsRoute from "./urls.routes.js";
import userRoute from "./user.routes.js";


const router = Router();

router.use(userRoute)
router.use(urlsRoute)

export default router;