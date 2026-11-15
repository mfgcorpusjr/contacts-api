import { Router } from "express";

import * as authControllers from "./auth.controllers.js";

const router = Router();

router.post("/sign-up", authControllers.signUp);
router.post("/sign-in", authControllers.signIn);

export default router;
