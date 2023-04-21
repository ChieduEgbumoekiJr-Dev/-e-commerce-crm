import express from 'express';
import * as path from 'path';
import 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import mongooseService from './common/mongoose.service';
import AnalyticsRoutes from './routes/analytics.routes';
import { AuthConfigService } from './common/auth/auth.config.service';

mongooseService.connect();
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

new AnalyticsRoutes(app);
new AuthConfigService(app).config();

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to users!' });
});

export default app;
