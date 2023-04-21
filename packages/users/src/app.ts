import express from 'express';
import * as path from 'path';
import 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import UsersRoutes from './routers/users.routers';
import mongooseService from './common/mongoose.service';
import { AuthConfigService } from './common/auth/auth.config.service';
import { AuthRoutes } from './common/auth/auth.routes';
import ErrorHandler from './middleware/error-handler';
import { SwaggerConfig } from './swagger.config';

export const PORT = +process.env.PORT || 3333;
export const HOST = process.env.HOST || 'localhost';

mongooseService.connect();
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

new SwaggerConfig(app, HOST, PORT);

new UsersRoutes(app);

new AuthConfigService(app).config();
new AuthRoutes(app);
new ErrorHandler(app);

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to users!' });
});

export default app;
