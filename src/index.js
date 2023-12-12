import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import winston from 'winston';
import connectDatabase from './database.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import workOrderRoutes from './routes/workOrderRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import productItemRoutes from './routes/productItemRoutes.js';
import productModelRoutes from './routes/productModelRoutes.js';
import { startCronJobs } from './schedule/cronJobs.js';
import { initializeSocketIo } from './socket.js';
dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
connectDatabase();
app.use(bodyParser.json());
app.use(compression());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://code.jquery.com", "https://cdn.jsdelivr.net", "https://stackpath.bootstrapcdn.com"],
      styleSrc: ["'self'", "https://stackpath.bootstrapcdn.com"]
    }
  }
}));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/workorders', workOrderRoutes);
app.use('/', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/productitems', productItemRoutes);
app.use('/api/productmodels', productModelRoutes);
startCronJobs();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = initializeSocketIo(server);
global.io = io;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const logger = winston.createLogger({
  // winston configuration here
});
