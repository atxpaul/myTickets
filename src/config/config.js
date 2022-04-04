import dotenv from 'dotenv';
dotenv.config();

const config = {
    adminMail: process.env.ADMIN_MAIL,
    mongodb: {
        url: process.env.MONGO_URL,
        options: {
            serverSelectionTimeoutMS: 5000,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    session: {
        secret: process.env.SESSION_SECRET,
        cookie: {
            httpOnly: false,
            secure: false,
            maxAge: 10 * 60 * 1000,
        },
        rolling: true,
        resave: true,
        saveUninitialized: false,
    },
    gmail: {
        sender: process.env.GMAIL_USER,
        password: process.env.GMAIL_PASSWORD,
    },
};
export default config;
