import { Router } from "express";

import { signUp, signIn } from "./auth.controllers.js";

const authRoutes = Router();

authRoutes.post("/sign-up", signUp);
authRoutes.post("/sign-in", signIn);

export default authRoutes;
