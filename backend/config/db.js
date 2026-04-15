const mongoose = require('mongoose');

/**
 * Connects to the MongoDB database using the connection string in .env
 */
const connectDB = async () => {
  try {
    // In newer Mongoose versions, options like useNewUrlParser are default, but good to be explicit
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;