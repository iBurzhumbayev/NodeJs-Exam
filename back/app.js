const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const usersRouter = require('./routers/usersRouter');
const postsRouter = require('./routers/postsRouter')
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb+srv://admin:admin@cluster0.7rqq8rd.mongodb.net/?retryWrites=true&w=majority', (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log('server started');
        app.use('/users', usersRouter);
        app.use('/posts', postsRouter);
        app.listen(8080);
    }
});


