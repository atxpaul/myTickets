import jwt from 'jsonwebtoken';
import config from '../config/config.js';

function checkAuthentication(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: 'not authenticated',
        });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, config.jwt.secret, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                error: 'not authorized',
            });
        }

        req.user = { username: decoded.username, id: decoded.id };
        next();
    });
}

export default checkAuthentication;
