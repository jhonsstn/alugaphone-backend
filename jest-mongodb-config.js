module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '6.0.2',
      skipMD5: true,
    },
    instance: {
      dbName: 'jest',
    },
    autoStart: false,
  },
};
