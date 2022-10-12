export default {
  description: 'Invalid request',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Missing email param',
          },
        },
      },
    },
  },
};
