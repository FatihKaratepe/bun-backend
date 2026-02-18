import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import { swaggerSpec } from '@config';
import { errorMiddleware, notFoundMiddleware } from '@middlewares';
import { UserRoutes } from '@routes';

const app = express();
const PORT = 3000;

app.use(helmet());
app.use(cors());
app.use(
  morgan('dev', {
    stream: {
      write: (message) => {
        process.stdout.write(`morgan - ${message}`);
      },
    },
  })
);
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/users', UserRoutes);

app.get('/', (req, res) => {
  res.send('Hello Bun + Express!');
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
