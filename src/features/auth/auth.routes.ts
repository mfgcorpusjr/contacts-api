import { Router } from "express";

import { signUp, signIn, me } from "./auth.controllers.js";
import { authenticate } from "./auth.middleware.js";

const authRoutes = Router();

authRoutes.post("/sign-up", signUp);
authRoutes.post("/sign-in", signIn);
authRoutes.get("/me", authenticate, me);

export default authRoutes;
