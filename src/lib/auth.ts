import jwt from "jsonwebtoken";

export function verifyToken(req: Request) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) return null;

    const token = authHeader.split(" ")[1];

    try {
        return jwt.verify(token, process.env.JWT_SECRET || "dev_secret_key");
    } catch (err) {
        return null;
    }
}
