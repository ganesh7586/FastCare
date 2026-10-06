import jwt from 'jsonwebtoken';

//User authentication middleware
const authUser = async (req, res, next) => {
    try {
        let { token } = req.headers;
        if (!token) {
            return res.json({ success: false, message: 'Not Authorized. User Login Again' });
        }
        if (token.startsWith('Bearer ')) {
            token = token.slice(7);
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!req.body) req.body = {};
        req.body.userId = token_decode.id;
        req.userId = token_decode.id;
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export default authUser;
