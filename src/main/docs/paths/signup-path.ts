export default {
  post: {
    tags: ['Account'],
    summary: 'API to create a user',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/signUpParamsSchema',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/signInResponseSchema',
            },
          },
        },
      },
      400: {
        $ref: '#/components/badRequest',
      },
      500: {
        $ref: '#/components/serverError',
      },
    },
  },
};
