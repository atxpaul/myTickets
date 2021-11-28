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
    uri: 'myticketsproject-firebase-adminsdk-35s3z-60c3a17421.json',
  },
};
export default config;
