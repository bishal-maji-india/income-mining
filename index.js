const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/connectionDb');
const errorHandler = require('./middleware/errorHandler');
const userRouter = require('./routes/userRoute');



const app = express();

app.use(express.json());
app.use(bodyParser.json());
// app.use(cors());
app.use(cors({
  origin: 'https://incomminings.com' // Adjust to include your full domain
}));

app.use(morgan('combined'));

// Error handling middleware
app.use(errorHandler);

connectDB();

app.get('/api', (req, res) => {
  res.send('Welcome to my API!');
});

app.use('/api/users', userRouter);
app.use('/api/users',userRouter)

const port = process.env.PORT ||5000; // You can use any port you prefer
app.listen(port,'0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port}`);
});
