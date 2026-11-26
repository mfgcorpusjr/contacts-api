import type { Request, Response } from "express";

import { signUpSchema } from "./auth.schemas.js";
import { hashPassword } from "../../lib/bcrypt.js";
import { signToken } from "../../lib/jwt.js";
import { prisma } from "../../lib/prisma.js";
import { BadRequestError } from "../../utils/error.js";

export const signUp = async (req: Request, res: Response) => {
  const { email, password, name } = signUpSchema.parse(req.body);

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new BadRequestError("Email already exists.");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  const token = signToken({ id: user.id });

  res.status(201).json({
    success: true,
    data: {
      user,
      token,
    },
  });
};
