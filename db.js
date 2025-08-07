const mongoose = require('mongoose');
const env = require('dotenv');
env.config();

const connectdb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Db connected");
    } catch (error) {
        console.log("Db Not connected");
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectdb;