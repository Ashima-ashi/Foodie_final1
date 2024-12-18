const mongoose = require("mongoose");
const { MONGODB_URI } = require("./config");

function ConnectMongoDB(url = process.env.MONGODB_URI){
    return mongoose.connect(url);
}

module.exports  = {
    ConnectMongoDB,
}
