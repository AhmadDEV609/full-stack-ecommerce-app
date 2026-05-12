import jwt from 'jsonwebtoken'

const auth = async (req, res, next) => {
    try {
        const token = req.cookies?.token
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" })
        }
        const decoded = jwt.verify(token, process.env.Secret_Auth_key)

        req.user = decoded
        console.log("cookies:", req.cookies);
        next()
    } catch (error) {
        console.log(error)

        return res.status(401).json({ message: "Unauthorized: Invalid or expired token" })
    }
}

export default auth