export default {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      example: 'Guilherme Pedro Henrique Aparício',
    },
    email: {
      type: 'string',
      example: 'guilherme_aparicio@riscao.com.br',
    },
    document: {
      type: 'string',
      example: '34481980052',
    },
    password: {
      type: 'string',
      example: 'y8OGjLZo11',
    },
  },
  required: ['name', 'email', 'document', 'password'],
};
