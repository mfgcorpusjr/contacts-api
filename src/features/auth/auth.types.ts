import type { Request } from "express";

export type JWTPayload = {
  id: string;
};

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}
