import express from 'express';
import setMiddlewares from './middlewares';
import setRoutes from './routes';
import setSwagger from './swagger';

const app = express();
setSwagger(app);
setMiddlewares(app);
setRoutes(app);

export default app;
