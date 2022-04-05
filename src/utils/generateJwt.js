import jwt from 'jsonwebtoken';
import config from '../config/config.js';

function generateToken(user) {
    const token = jwt.sign(
        { username: user.username, id: user._id },
        config.jwt.secret,
        {
            expiresIn: config.jwt.time,
        }
    );
    return token;
}

export { generateToken };
