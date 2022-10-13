export default {
  get: {
    tags: ['Product'],
    summary: 'API to get all products',

    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/getProductsResponseSchema',
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
