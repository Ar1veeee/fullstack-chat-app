import jwt from "jsonwebtoken"
export const generateToken = (userId: any, res: any): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("Invalid Token")
    }
    const token = jwt.sign({userId}, secret, {
        expiresIn: "7d",
    })
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 100,
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
    });
    return token
}