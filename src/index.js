const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const winston = require('winston');
const connectDatabase = require('./database');
const path = require('path');

require('dotenv').config();

const app = express();

// Establish connection to the database
connectDatabase();

app.use(bodyParser.json());
app.use(compression());
app.use(helmet());

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);

const inventoryRoutes = require('./routes/inventoryRoutes');
app.use('/api/inventory', inventoryRoutes);

const workOrderRoutes = require('./routes/workOrderRoutes');
app.use('/api/workorders', workOrderRoutes);

const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/', dashboardRoutes);

const startCronJobs = require('./schedule/cronJobs');

// Start the cron jobs
startCronJobs();

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = require('./socket')(server);
global.io = io;

server.listen(PORT, () => console.log('Server running on port ' + PORT));

const logger = winston.createLogger({
  // winston configuration here
});
