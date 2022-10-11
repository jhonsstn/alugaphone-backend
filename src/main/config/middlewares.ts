import cors from 'cors';
import express from 'express';

export default (app: express.Application): void => {
  app.use(express.json());
  app.use(cors());
};
