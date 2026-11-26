import { Router } from "express";

import { getContacts, getContact } from "./contact.controllers.js";
import { authenticate } from "../auth/auth.middleware.js";

const contactRoutes = Router();

contactRoutes.use(authenticate);

contactRoutes.get("/", getContacts);
contactRoutes.get("/:id", getContact);

export default contactRoutes;
