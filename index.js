const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/connectionDb');
const errorHandler = require('./middleware/errorHandler');
const userRouter = require('./routes/userRoute');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.use(morgan('combined'));

// Set CORS headers to allow requests from your frontend application's base URL (https://incomminings.com)
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'https://incomminings.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Error handling middleware
app.use(errorHandler);

connectDB();

app.get('/api', (req, res) => {
  res.send('Welcome to my API!');
});

app.use('/api/users', userRouter);

const port = process.env.PORT || 5000; // You can use any port you prefer
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port}`);
});
