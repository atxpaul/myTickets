import dotenv from 'dotenv';
if (process.env.NODE_ENV == 'production') {
    dotenv.config();
} else {
    dotenv.config({ path: '.env.test' });
}

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
    jwt: {
        secret: process.env.JWT_SECRET,
        time: process.env.JWT_TIME,
    },
    swagger: {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'myTickets API with Swagger',
                description:
                    'Endpoints and documentation for myTickets API with Swagger',
            },
        },
        apis: ['./docs/**/*.yaml'],
    },
};
export default config;
