import jwt from "jsonwebtoken";

type Role = "admin" | "user";

export const withAuth = (
  handler: (req: Request, user: any) => Promise<Response>,
  role?: Role
) => {
  return async (req: Request) => {
    try {
      const authHeader = req.headers.get("authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as any;

      if (!decoded?.id || !decoded?.role) {
        return Response.json({ error: "Invalid token" }, { status: 401 });
      }

      if (role && decoded.role !== role) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }

      return handler(req, decoded);
    } catch {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  };
};