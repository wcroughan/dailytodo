const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const db = require('./config/db');
const cors = require('cors');

const app = express();
const port = 8081;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const client = new MongoClient(db.url, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    if (err) {
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        console.log("error connecting");
        console.log(err);
        client.close();
    } else {
        console.log("Connected to Mongo!")
        const mydb = client.db("testdb");
        try {
            mydb.command({ ping: 1 });
            require('./app/routes')(app, mydb);
            app.listen(port, () => { console.log('We are live on ' + port); });
        } catch (err) {
            console.log("ping didn't work", err);
            client.close();
        }

    }
});


