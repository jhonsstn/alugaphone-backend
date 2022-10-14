export default {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      example: 'guilherme_aparicio@riscao.com.br',
    },
    document: {
      type: 'string',
      example: '34481980052',
    },
    productId: {
      type: 'string',
      example: '6347577409446f1ac78b9974',
    },
    productCapacity: {
      type: 'number',
      example: 128,
    },
  },
  required: ['email', 'document', 'productId', 'productCapacity'],
};
