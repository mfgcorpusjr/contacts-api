import type { Response } from "express";

import {
  getAllContactsQuerySchema,
  upsertContactSchema,
} from "./contact.schemas.js";
import type { AuthenticatedRequest } from "../auth/auth.types.js";
import { prisma } from "../../lib/prisma.js";
import type { ContactWhereInput } from "../../generated/prisma/models.js";
import { NotFoundError } from "../../utils/error.js";

export const getAll = async (req: AuthenticatedRequest, res: Response) => {
  const { page, pageSize, search } = getAllContactsQuerySchema.parse(req.query);

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
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.contact.count({
      where,
    }),
  ]);

  res.json({
    success: true,
    data: contacts,
    metadata: {
      page,
      pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
    },
  });
};

export const get = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const contact = await prisma.contact.findUnique({
    where: {
      id: id as string,
      userId: req.user!.id,
    },
  });

  if (!contact) {
    throw new NotFoundError("No contact found.");
  }

  res.json({ success: true, data: contact });
};

export const create = async (req: AuthenticatedRequest, res: Response) => {
  const data = upsertContactSchema.parse(req.body);

  const contact = await prisma.contact.create({
    data: {
      ...data,
      phone: data.phone || null,
      address: data.address || null,
      userId: req.user!.id,
    },
  });

  res.status(201).json({ success: true, data: contact });
};
