import type { Request } from "express";

import type { JWTPayload } from "../../lib/jwt.js";

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}
