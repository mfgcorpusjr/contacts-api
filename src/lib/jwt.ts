import jwt from "jsonwebtoken";

type JWTPayload = {
  id: string;
};

export const signToken = (payload: JWTPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
};
