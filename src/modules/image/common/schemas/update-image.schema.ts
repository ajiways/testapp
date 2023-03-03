export const statisticsUpdateApiSchema = {
  type: 'object',
  properties: {
    imageId: { type: 'string', description: 'Id изображения' },
    image: {
      type: 'string',
      format: 'binary',
      description: 'Изображение',
    },
  },
};
