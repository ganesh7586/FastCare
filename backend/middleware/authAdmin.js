import jwt from 'jsonwebtoken';

const authAdmin = (req, res, next) => {
    try {
        const { atoken, authorization } = req.headers;
        const aToken = atoken || (authorization?.startsWith('Bearer ') ? authorization.slice(7) : '');

        if (!aToken) {
            return res.status(401).json({ success: false, message: 'Admin login is required.' });
        }

        const decoded = jwt.verify(aToken, process.env.JWT_SECRET);

        if (decoded.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Admin session is invalid. Please log in again.' });
        }

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Admin session is invalid or has expired. Please log in again.' });
    }
};

export default authAdmin;
