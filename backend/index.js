const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config()
const PORT = 4000;

app.use(cors({ origin: true }));

app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))

mongoose.connect('mongodb+srv://shahiddgk:2llbsPlUaTIsb48H@cluster0.rxm2atp.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

app.use("/basic",require("./routes/basic"));
app.use("/nurse", require("./routes/basic/nurse"));
app.use("/patient", require("./routes/basic/patient"));
app.use("/level", require("./routes/basic/level"));
app.use("/rota", require("./routes/rota"));
app.use("/leave", require("./routes/leave"));

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});