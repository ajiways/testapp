export const statisticsUploadApiSchema = {
  type: 'object',
  properties: {
    image: {
      type: 'string',
      format: 'binary',
      description: 'Изображение',
    },
  },
};
