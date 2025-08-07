const env = require('dotenv');
env.config();

const express = require('express');
const app = express();
const route = require('./routes/route');
const connectdb = require('./db');

const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/', route);

app.get('/', (req, res) => {
    res.send("Hello");
});

// Connect to DB first, then start server
connectdb().then(() => {
    app.listen(port, () => {
        console.log("Server started on port", port);
    });
}).catch((err) => {
    console.error("Failed to connect to DB:", err);
});