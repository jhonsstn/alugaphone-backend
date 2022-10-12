export default {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      example: 'guilherme_aparicio@riscao.com.br',
    },
    password: {
      type: 'string',
      example: 'y8OGjLZo11',
    },
  },
  required: ['email', 'password'],
};
