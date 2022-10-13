export default {
  get: {
    tags: ['Product'],
    summary: 'API to get all products',
    parameters: [
      {
        in: 'path',
        name: 'productId',
        description: 'Id of the product to return',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/getProductByIdResponseSchema',
            },
          },
        },
      },
      204: {
        $ref: '#/components/noContent',
      },
    },
  },
};
