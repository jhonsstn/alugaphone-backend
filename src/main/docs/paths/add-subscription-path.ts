export default {
  get: {
    tags: ['Subscription'],
    summary: 'API to add a subscriptions',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/addSubscriptionParamsSchema',
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
              $ref: '#/schemas/addSubscriptionResponseSchema',
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
