export default {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      example: '6347577409446f1ac78b9976',
    },
    name: {
      type: 'string',
      example: 'iPhone 13 Pro Max',
    },
    prices: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          capacity: {
            type: 'string',
            example: '128',
          },
          price: {
            type: 'number',
            example: 4.397,
          },
        },
      },
    },
    imageUrl: {
      type: 'string',
      example:
        'https://yacare-products-image.s3.sa-east-1.amazonaws.com/iphone/4x/iPhone+13+Pro+Max.png',
    },
  },
};
