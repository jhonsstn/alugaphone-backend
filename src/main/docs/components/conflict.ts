export default {
  description: 'Conflict',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Email already in use',
          },
        },
      },
    },
  },
};
