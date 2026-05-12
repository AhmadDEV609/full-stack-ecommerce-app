export const isUser = (req, res, next) => {
    if (req.user.role !== "user") {
        return res.status(403).json({
            success: false,
            message: "Only users allowed"
        });
    }
    next();
};


export const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Only admin allowed"
        });
    }
    next();
};