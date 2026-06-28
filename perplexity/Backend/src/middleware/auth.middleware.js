import jwt from 'jsonwebtoken';

export function authUser(req, res, next) {

    const token = req.cookies.token;

    console.log("TOKEN:", token)
    console.log("JWT_SECRET:", process.env.JWT_SECRET)

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            err: "No token provided"
        })
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("DECODED:", decoded)

        req.user = decoded;

        next();

    } catch (err) {

        console.log("JWT ERROR:", err.message)

        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            err: "Invalid token"
        })
    }
}