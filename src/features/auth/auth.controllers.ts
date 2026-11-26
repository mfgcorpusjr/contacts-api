import type { Request, Response } from "express";

import { signUpSchema, signInSchema } from "./auth.schemas.js";
import type { AuthenticatedRequest } from "./auth.types.js";
import { hashPassword, comparePassword } from "../../lib/bcrypt.js";
import { signToken } from "../../lib/jwt.js";
import { prisma } from "../../lib/prisma.js";
import { BadRequestError, UnAuthorizedError } from "../../utils/error.js";

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

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = signInSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new UnAuthorizedError("Invalid email or password.");
  }

  const isValidPassword = await comparePassword(password, user.password);

  if (!isValidPassword) {
    throw new UnAuthorizedError("Invalid email or password.");
  }

  const token = signToken({ id: user.id });

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    },
  });
};

export const me = async (req: AuthenticatedRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    select: {
      id: true,
      email: true,
      name: true,
    },
    where: {
      id: req.user!.id,
    },
  });

  res.json({
    success: true,
    data: user,
  });
};
