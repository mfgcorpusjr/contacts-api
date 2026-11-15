import { Router } from "express";

import * as contactControllers from "./contact.controllers.js";
import { authenticate } from "../auth/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/", contactControllers.getAll);
router.get("/:id", contactControllers.get);
router.post("/", contactControllers.create);
router.patch("/:id", contactControllers.update);

export default router;
