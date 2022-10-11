export default {
  port: process.env.PORT ?? 3001,
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://localhost:27017/allugator',
  salt: process.env.SALT ?? 12,
  secret: process.env.SECRET ?? 'secret',
};
