const { render } = require('ejs');
const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');
require('dotenv').config();

const app = express();

const dbURI = 'mongodb+srv://'+ process.env.DB_USER +':'+ process.env.DB_PASSWORD + '@learningmongocluster.x9flm.mongodb.net/LearningNodeJS?retryWrites=true&w=majority';
mongoose.connect(dbURI)
    .then((result) => {
        console.log("Connected to MongoDB!");
        app.listen(process.env.PORT || 3000);
    })
    .catch((err) => console.log(err));

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    fs.appendFileSync(
        './logs/log.txt', 
        req.method + " " + req.url + " " + req.ip + " " + new Date().toUTCString() + "\n", 
        (err) => {
            if(err) {
                console.log("Erro ao fazer o log!");
            }
    });
    next();
});

app.get('/', (req, res) => {
    res.redirect('/blogs');
});

app.use('/blogs', blogRoutes);

app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});