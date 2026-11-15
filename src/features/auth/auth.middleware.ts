import type { Response, NextFunction } from "express";

import type { AuthenticatedRequest } from "./auth.types.js";
import { verifyToken } from "../../lib/jwt.js";
import { UnauthorizedError } from "../../utils/error.js";

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    next(new UnauthorizedError("Access token is required."));
  }

  const [scheme, token] = authorization?.split(" ") || [];

  if (scheme !== "Bearer" || !token) {
    next(new UnauthorizedError("Access token is required."));
  }

  try {
    const { id } = verifyToken(token as string);
    req.user = { id };
    next();
  } catch (error) {
    next(new UnauthorizedError("Invalid or expired access token."));
  }
};
