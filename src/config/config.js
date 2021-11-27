const config = {
  isAdmin: true,
  storage: 'mongodb',
  mongodb: {
    url: 'mongodb://localhost/ecommerce',
    options: {
      serverSelectionTimeoutMS: 5000,
    },
  },
};
export default config;
