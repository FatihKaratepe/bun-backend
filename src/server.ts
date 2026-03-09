import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

import { accessLogStream, customSwaggerOptions, swaggerSpec } from '@config';
import { errorMiddleware, notFoundMiddleware } from '@middlewares';
import { AuthRoutes, UserRoutes, CompanyRoutes } from '@routes';
import { logFactory } from '@utils';

const app = express();
const logger = logFactory({});

// ========================
// 1️⃣ SECURITY MIDDLEWARE
// ========================

// Basic security headers
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
    },
  }),
);

// Enable CORS (production: restrict origin)
app.use(cors());
// app.use(
//   cors({
//     origin: ['https://'], // production origin
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true,
//   }),
// );

// ========================
// 2️⃣ RATE LIMITING (Brute-force / DOS protection)
// ========================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// ========================
// 3️⃣ LOGGING
// ========================
app.use(
  morgan('combined', {
    stream: {
      write: (message) => {
        process.stdout.write(`morgan - ${message}`);
        accessLogStream.write(message);
      },
    },
  }),
);

// ========================
// 4️⃣ BODY PARSING
// ========================
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ========================
// 5️⃣ STATIC / SWAGGER / FAVICON
// ========================
app.use(express.static(path.join(process.cwd(), 'public')));
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, customSwaggerOptions));
app.get('/swagger.json', (req, res) => res.json(swaggerSpec));

// ========================
// 6️⃣ ROUTES
// ========================
app.use('/auth', AuthRoutes);
app.use('/users', UserRoutes);
app.use('/company', CompanyRoutes);

app.get('/', (req, res) => {
  res.send('Hello Bun + Express!');
});

// ========================
// 7️⃣ 404 & ERROR HANDLING
// ========================
app.use(notFoundMiddleware);
app.use(errorMiddleware);

// ========================
// 8️⃣ START SERVER
// ========================
app.listen(process.env.PORT, () => {
  logger.info(`Server is running on http://localhost:${process.env.PORT}`);
});
