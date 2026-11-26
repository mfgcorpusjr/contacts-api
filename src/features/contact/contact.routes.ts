import { Router } from "express";

import { getContacts } from "./contact.controllers.js";
import { authenticate } from "../auth/auth.middleware.js";

const contactRoutes = Router();

contactRoutes.use(authenticate);

contactRoutes.get("/", getContacts);

export default contactRoutes;
