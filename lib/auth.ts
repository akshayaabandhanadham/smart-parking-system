import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export const signToken = (payload: any) => {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    throw new Error("Unauthorized");
  }
};