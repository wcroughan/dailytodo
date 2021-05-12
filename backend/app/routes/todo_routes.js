var ObjectID = require('mongodb').ObjectID;

module.exports = function (app, db) {
    app.get('/lists/:id', (req, res) => {
        const id = req.params.id;
        console.log("Received get request for id: ", id);
        const details = { '_id': new ObjectID(id) };
        db.collection("notes").findOne(details, (err, item) => {
            if (err) {
                console.log(err);
                res.send({ 'error': "error occured" });
            } else {
                res.send(item);
            }

        });
    });

    app.get('/weeks_info', (req, res) => {
        console.log("Received week get request", req.query);

        generateWeek = function (id) {
            const st = id.split('_')[1];
            let dispText = st.substring(4, 6) + "/" + st.substring(6, 8);
            // console.log(dispText);
            if (dispText.substring(0, 1) === "_") dispText = dispText.substring(1, 5);
            return {
                id: id,
                displayText: dispText,
                isDone: false,
                isSkipped: false,
            }
        };
        let item = {};
        const dates = req.query.dates.split(',');

        const filterDetail = {
            id: {
                $in: dates
            }
        };
        db.collection("weeks_info").find(filterDetail, (err, cursor) => {
            if (err) {
                console.log(err);
                res.send({ 'error': "error occured" });

            } else {
                cursor.forEach(element => {
                    console.log("checking elem with id ", element)
                    item[element.id] = element;
                }, () => {
                    for (date of dates) {
                        if (item[date] === undefined)
                            item[date] = generateWeek(date);
                    }
                    console.log("sending back item", item);

                    res.header("Access-Control-Allow-Origin", "*");
                    res.send(item);
                });
            }

        });

    });
    app.get('/days_info', (req, res) => {
        console.log("Received day get request", req.query);

        generateDay = function (id) {
            const st = id.split('_')[1];
            let dispText = st.substring(4, 6) + "/" + st.substring(6, 8);
            // console.log(dispText);
            if (dispText.substring(0, 1) === "_") dispText = dispText.substring(1, 5);
            return {
                id: id,
                displayText: dispText,
                isDone: false,
                isSkipped: false,
            }
        };
        let item = {};
        const dates = req.query.dates.split(',');

        const filterDetail = {
            id: {
                $in: dates
            }
        };
        db.collection("days_info").find(filterDetail, (err, cursor) => {
            if (err) {
                console.log(err);
                res.send({ 'error': "error occured" });

            } else {
                cursor.forEach(element => {
                    console.log("checking elem with id ", element)
                    item[element.id] = element;
                }, () => {
                    for (date of dates) {
                        if (item[date] === undefined)
                            item[date] = generateDay(date);
                    }
                    console.log("sending back item", item);

                    res.header("Access-Control-Allow-Origin", "*");
                    res.send(item);
                });
            }

        });

    });


    app.post('/lists', (req, res) => {
        const note = { title: req.body.title, body: req.body.body };
        db.collection("notes").insertOne(note, (err, result) => {
            if (err) {
                console.log(err);
                res.send({ 'error': "error occured" });
            } else {
                res.send(result.ops[0]);
            }

        });
    });

    app.delete('/lists/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        db.collection("notes").deleteOne(details, (err, item) => {
            if (err) {
                console.log(err);
                res.send({ 'error': "error occured" });
            } else {
                res.send('deleted ' + id + ' successfully');
            }

        });
    });

    app.put('/lists/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        const note = { title: req.body.title, body: req.body.body };
        db.collection("notes").updateOne(details, note, (err) => {
            if (err) {
                console.log(err);
                res.send({ 'error': "error occured" });
            } else {
                res.send(note);
            }

        });
    });

};

