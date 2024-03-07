const express = require('express');
const cors = require('cors');
require('dotenv').config()

const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors());

//Routes
app.use('/nasa',require('./routes/nasa'));

app.listen(PORT, function (error) {

    if (error) {
        console.log('Something went wrong', error);
    } else {
        console.log('Server is listening on port' + PORT);
    }
});
