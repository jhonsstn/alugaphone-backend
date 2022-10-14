export default {
  get: {
    tags: ['Subscription'],
    summary: 'API to get subscriptions by user email',
    description: 'This route can only be executed by **authenticated users**',
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/getSubscriptionsByEmailResponseSchema',
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
