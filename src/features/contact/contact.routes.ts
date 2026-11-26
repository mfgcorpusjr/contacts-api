import { Router } from "express";

import {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
} from "./contact.controllers.js";
import { authenticate } from "../auth/auth.middleware.js";

const contactRoutes = Router();

contactRoutes.use(authenticate);

contactRoutes.get("/", getContacts);
contactRoutes.post("/", createContact);
contactRoutes.get("/:id", getContact);
contactRoutes.patch("/:id", updateContact);
contactRoutes.delete("/:id", deleteContact);

export default contactRoutes;
