import components from './components';
import paths from './paths';
import schemas from './schemas';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Allugator API',
    description: 'User accounts API',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost:3001/api',
      description: 'Development server',
    },
  ],
  paths,
  schemas,
  components,
};
