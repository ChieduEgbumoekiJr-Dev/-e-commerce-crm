import { Application } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';

export class SwaggerConfig {
  constructor(app: Application, HOST: string, PORT: number) {
    const swaggerDefinition = {
      openapi: '3.0.3',
      info: {
        title: 'USERS API', // Title of the documentation
        version: '1.0.0', // Version of the app
        description: 'The Users REST API', // short description of the app
      },
      host: `${HOST}:${PORT}`, // the host or url of the app (use .env to manage different env)
      basePath: '/', // the base path of your endpoints
      components: {
        schemas: {
          User: {
            type: 'object',
            required: [
              'email',
              'username',
              'firstName',
              'lastName',
              'auth0Id',
              'permissionLevel',
              'gender',
              'birthday',
              'picture',
              'status',
              'addresses',
            ],
            properties: {
              email: {
                type: 'string',
                description: 'User email address',
              },
              auth0Id: {
                type: 'string',
                description: 'User auth0 id',
              },
              username: {
                type: 'string',
                description: 'User username',
              },
              firstName: {
                type: 'string',
                description: 'User first name',
              },
              lastName: {
                type: 'string',
                description: 'User last name',
              },
              phone: {
                type: 'string',
                description: 'User phone number',
              },
              picture: {
                type: 'string',
                description: 'User picture',
              },
              birthday: {
                type: 'string',
                format: 'date',
                description: 'User birth day',
              },
              permissionLevel: {
                type: 'string',
                enum: ['super-admin', 'admin', 'member'],
                description: 'User permission',
              },
              gender: {
                type: 'string',
                description: 'User birth day',
              },
              status: {
                type: 'string',
                enum: ['active', 'closed'],
                description: 'User status',
              },
              addresses: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Address',
                },
                minItems: 1,
                description: 'User addresses',
              },
            },
          },
          Address: {
            type: 'object',
            required: ['address', 'city', 'postalCode', 'primary', 'label'],
            properties: {
              address: {
                type: 'string',
                description: 'Address',
              },
              city: {
                type: 'string',
                description: 'Address City',
              },
              postalCode: {
                type: 'string',
                description: 'Address Postal code',
              },
              state: {
                type: 'string',
                description: 'Address State',
              },
              primary: {
                type: 'boolean',
                description: 'Primary address',
              },
              label: {
                type: 'string',
                description: 'Address label',
              },
            },
          },
        },
        securitySchemes: {
          Bearer: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            value: 'Bearer <JWT token here>',
          },
        },
      },
      tags: [
        {
          name: 'Users',
          description: 'The users managing API',
        },
      ],
    };
    const options = {
      swaggerDefinition,
      // this is a sample, but you can change as you wish
      apis: [__dirname + '/**/docs/*.yaml'],
      //__dirname + '/**/docs/*.yaml'
    };
    const swaggerSpec = swaggerJSDoc(options);
    // you can change /docs to any endpoint that you would like to serve the swagger documentation
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }
}
