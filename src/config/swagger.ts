import swaggerJsdoc, { type Options } from 'swagger-jsdoc';
import type { SwaggerUiOptions } from 'swagger-ui-express';

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: process.env.SWAGGER_NAME || 'My API',
      version: '1.0.0',
      description: process.env.SWAGGER_DESCRIPTION || 'Express API Documentation',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/**/*.ts'],
};

export const customSwaggerOptions: SwaggerUiOptions = {
  swaggerOptions: {
    urls: [{ url: '../swagger.json', name: 'Swagger JSON' }],
  },
};

export const swaggerSpec = swaggerJsdoc(options);
