import dotenv from 'dotenv';
dotenv.config();

const config = {
  isAdmin: true,
  storage: 'firebase',
  mongodb: {
    url: 'mongodb://localhost/ecommerce',
    options: {
      serverSelectionTimeoutMS: 5000,
    },
  },
  firebase: {
    uri: 'db/myticketsproject-firebase-adminsdk-35s3z-60c3a17421.json',
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
};
export default config;
