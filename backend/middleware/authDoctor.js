import jwt from 'jsonwebtoken';

// Doctor authentication middleware
const authDoctor = async (req, res, next) => {
    try {
        const { token, dtoken } = req.headers;
        let dToken = dtoken || token;
        if (!dToken) {
            return res.json({ success: false, message: 'Not Authorized. Doctor Login Again' });
        }
        if (dToken.startsWith('Bearer ')) {
            dToken = dToken.slice(7);
        }
        const token_decode = jwt.verify(dToken, process.env.JWT_SECRET);
        req.docId = token_decode.id;
        if (!req.body) req.body = {};
        req.body.docId = token_decode.id;
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export default authDoctor;
