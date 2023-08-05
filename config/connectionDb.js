const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  console.log('Database connected', connect.connection.host, connect.connection.name);

  return connect.connection;
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;
