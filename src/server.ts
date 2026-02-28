import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import { customSwaggerOptions, swaggerSpec } from '@config';
import { errorMiddleware, notFoundMiddleware } from '@middlewares';
import { UserRoutes,AuthRoutes } from '@routes';
import { logFactory } from '@utils';

const app = express();
const logger = logFactory({})

app.use(helmet());
app.use(cors());
app.use(
  morgan('dev', {
    stream: {
      write: (message) => {
        process.stdout.write(`morgan - ${message}`);
      },
    },
  }),
);

app.use(express.json());
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, customSwaggerOptions));
app.get('/swagger.json', (req, res) => res.json(swaggerSpec));

app.use('/auth', AuthRoutes);
app.use('/users', UserRoutes);

app.get('/', (req, res) => {
  res.send('Hello Bun + Express!');
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  logger.info(`Server is running on http://localhost:${process.env.PORT}`);
});
