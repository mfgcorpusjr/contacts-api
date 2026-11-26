import { Router } from "express";

import { signUp } from "./auth.controllers.js";

const authRoutes = Router();

authRoutes.post("/sign-up", signUp);

export default authRoutes;
