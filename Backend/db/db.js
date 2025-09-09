const mongoose = require('mongoose');


function connectToDb() {
    mongoose.connect(process.env.DB_CONNECT
    ).then(() => {
       console.log('Connected to DB');
    }).catch(err => console.log(err));
}
const mongoose = require('mongoose');
require('dotenv').config();

function connectToDb() {
  const mongoURI = process.env.DB_CONNECT;

  if (!mongoURI) {
    console.error("❌ DB_CONNECT is not defined in .env");
    process.exit(1);
  }

  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // 10 seconds
  })
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err);
      process.exit(1); // exit the app if DB cannot connect
    });

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected!");
  });
}

module.exports = connectToDb;


module.exports = connectToDb;
