import type { Response } from "express";

import { getContactsQuerySchema } from "./contact.schemas.js";
import type { AuthenticatedRequest } from "../auth/auth.types.js";
import { prisma } from "../../lib/prisma.js";
import type { ContactWhereInput } from "../../generated/prisma/models.js";

export const getContacts = async (req: AuthenticatedRequest, res: Response) => {
  const { page, pageSize, search } = getContactsQuerySchema.parse(req.query);

  const where: ContactWhereInput = {
    userId: req.user!.id,
    ...(search && {
      OR: [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [contacts, totalItems] = await prisma.$transaction([
    prisma.contact.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where,
      orderBy: {
        lastName: "asc",
      },
    }),

    prisma.contact.count({
      where,
    }),
  ]);

  res.json({
    success: true,
    data: contacts,
    metadata: {
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
      page,
      pageSize,
    },
  });
};
