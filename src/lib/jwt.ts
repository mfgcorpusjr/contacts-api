import jwt from "jsonwebtoken";

import type { JwtPayload } from "jsonwebtoken";

export const signToken = (payload: JwtPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1d" });
};
