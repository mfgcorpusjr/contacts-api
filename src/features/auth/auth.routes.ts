import { Router } from "express";

import * as authControllers from "./auth.controllers.js";
import { authenticate } from "./auth.middleware.js";

const router = Router();

router.post("/sign-up", authControllers.signUp);
router.post("/sign-in", authControllers.signIn);
router.get("/me", authenticate, authControllers.me);

export default router;
