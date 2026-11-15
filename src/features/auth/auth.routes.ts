import { Router } from "express";

import * as authControllers from "./auth.controllers.js";

const router = Router();

router.post("/sign-up", authControllers.signUp);

export default router;
