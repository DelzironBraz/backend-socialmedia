import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.header("Authorization");

        if (!token) res.status(403).json({ error: err.message });

        if (token.startsWith("Bearer ")) return token.slice(7, token.length).trimLeft();

        const verified = await jwt.verify(token, process.env.JWT_SECRET);

        req.user = verified;

        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};