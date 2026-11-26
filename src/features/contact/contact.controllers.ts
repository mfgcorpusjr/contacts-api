import type { Response } from "express";

import {
  getContactsQuerySchema,
  upsertContactSchema,
} from "./contact.schemas.js";
import type { AuthenticatedRequest } from "../auth/auth.types.js";
import { prisma } from "../../lib/prisma.js";
import type {
  ContactWhereInput,
  ContactWhereUniqueInput,
} from "../../generated/prisma/models.js";
import { NotFoundError } from "../../utils/error.js";

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
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
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

export const createContact = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const data = upsertContactSchema.parse(req.body);

  const contact = await prisma.contact.create({
    data: {
      ...data,
      phone: data.phone || null,
      address: data.address || null,
      userId: req.user!.id,
    },
  });

  res.status(201).json({
    success: true,
    data: contact,
  });
};

export const getContact = async (req: AuthenticatedRequest, res: Response) => {
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

  res.json({
    success: true,
    data: contact,
  });
};

export const updateContact = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { id } = req.params;

  const where: ContactWhereUniqueInput = {
    id: id as string,
    userId: req.user!.id,
  };

  const existingContact = await prisma.contact.findUnique({
    where,
  });

  if (!existingContact) {
    throw new NotFoundError("No contact found.");
  }

  const data = upsertContactSchema.parse(req.body);

  const contact = await prisma.contact.update({
    data: {
      ...data,
      phone: data.phone || null,
      address: data.address || null,
    },
    where,
  });

  res.json({
    success: true,
    data: contact,
  });
};
