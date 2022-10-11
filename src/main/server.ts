/* eslint-disable no-console */
import MongoHelper from '../database/helpers/mongo-helper';
import env from './config/env';

MongoHelper.connect(env.mongoUrl as string)
  .then(async () => {
    const app = (await import('./config/app')).default;
    app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`));
  })
  .catch(console.error);
