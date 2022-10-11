export default {
  port: process.env.PORT ?? 3001,
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://localhost:27017/allugator',
};
