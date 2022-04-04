import dotenv from 'dotenv';
dotenv.config();

const config = {
    adminMail: process.env.ADMIN_MAIL,
    adminPhone: process.env.ADMIN_PHONE,
    isAdmin: true,
    storage: 'firebase',
    mongodb: {
        url: process.env.MONGO_URL,
        options: {
            serverSelectionTimeoutMS: 5000,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    firebase: {
        uri: 'db/myticketsproject-firebase-adminsdk.json',
        options: {
            type: 'service_account',
            project_id: process.env.FIREBASE_PROJECT_ID,
            private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
            private_key: process.env.FIREBASE_PRIVATE_KEY,
            client_email: process.env.FIREBASE_EMAIL,
            client_id: process.env.FIREBASE_CLIENT_ID,
            auth_uri: 'https://accounts.google.com/o/oauth2/auth',
            token_uri: 'https://oauth2.googleapis.com/token',
            auth_provider_x509_cert_url:
                'https://www.googleapis.com/oauth2/v1/certs',
            client_x509_cert_url: process.env.FIREBASE_CERT,
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
    twilio: {
        numberFrom: process.env.TWILIO_FROM,
        whatsappFrom: process.env.TWILIO_FROM_WHATSAPP,
        accountSid: process.env.TWILIO_SID,
        authToken: process.env.TWILIO_TOKEN,
    },
};
export default config;
