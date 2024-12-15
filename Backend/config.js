require('dotenv').config();

const config = {
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/foodie",
    PORT: process.env.PORT || 5000,
    HOST: process.env.HOST || "0.0.0.0"
};

module.exports = config;
