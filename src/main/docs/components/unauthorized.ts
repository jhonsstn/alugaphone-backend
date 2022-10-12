export default {
  description: 'Unauthorized',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Unauthorized',
          },
        },
      },
    },
  },
};
