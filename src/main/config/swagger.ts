import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../docs';

export default (app: express.Application) => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
