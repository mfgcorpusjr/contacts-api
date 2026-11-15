import type { Response } from "express";

import type { AuthenticatedRequest } from "../auth/auth.types.js";
import { prisma } from "../../lib/prisma.js";

export const getAll = async (req: AuthenticatedRequest, res: Response) => {
  const contacts = await prisma.contact.findMany({
    where: {
      userId: req.user!.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json({ success: true, data: contacts });
};
