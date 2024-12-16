require('dotenv').config();

const config = {
    MONGODB_URI:  "mongodb+srv://ashimagarg118:9817820258@cluster0.6w2zv.mongodb.net/Foodie?retryWrites=true&w=majority&appName=Cluster0",
    PORT: process.env.PORT || 5000,
    HOST: process.env.HOST || "0.0.0.0"
};

module.exports = config;
