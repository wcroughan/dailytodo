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
                    // console.log("checking elem with id ", element)
                    item[element.id] = element;
                }, () => {
                    for (date of dates) {
                        if (item[date] === undefined)
                            item[date] = generateWeek(date);
                    }
                    // console.log("sending back item", item);

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
                    // console.log("checking elem with id ", element)
                    item[element.id] = element;
                }, () => {
                    for (date of dates) {
                        if (item[date] === undefined)
                            item[date] = generateDay(date);
                    }
                    // console.log("sending back item", item);

                    res.header("Access-Control-Allow-Origin", "*");
                    res.send(item);
                });
            }

        });

    });



    app.get('/list', (req, res) => {
        console.log("Received list get request", req.query);

        let colName = "days_list";
        let category = "daily";
        if (req.query.id.split('_')[0] === "weekly") {
            colName = "weeks_list";
            category = "weekly";
        }

        const defaultFilterDetail = {
            id: "default"
        };

        if (req.query.default === undefined || req.query.default === false) {
            // Has a specific list in mind, doesn't want default. Check to see if exists
            const filterDetail = {
                id: req.query.id
            };
            db.collection(colName).findOne(filterDetail, (err, item) => {
                if (err) {
                    console.log(err);
                    res.send({ 'error': "error occured" });
                } else {
                    console.log("Mongo sent back this:", item);

                    if (item !== null) {
                        res.header("Access-Control-Allow-Origin", "*");
                        res.send(item);
                    } else {
                        db.collection(colName).findOne(defaultFilterDetail, (derr, ditem) => {
                            if (derr) {
                                console.log(derr);
                                res.send({ 'error': "error occured" });
                            } else {
                                console.log("Got default  as backup: ", ditem);
                                const st = req.query.id.split('_')[1];
                                ditem.listTitle = st.substring(4, 6) + "/" + st.substring(6, 8);
                                if (category === "weekly")
                                    ditem.listTitle = "Week of " + ditem.listTitle;
                                ditem.id = req.query.id;
                                res.header("Access-Control-Allow-Origin", "*");
                                res.send(ditem);
                            }

                        });
                    }

                }
            });
        } else {
            db.collection(colName).findOne(defaultFilterDetail, (derr, ditem) => {
                if (derr) {

                    console.log(derr);
                    res.send({ 'error': "error occured" });
                } else {
                    console.log("Got default  as backup: ", ditem);
                    const st = req.query.id.split('_')[1];
                    ditem.listTitle = st.substring(4, 6) + "/" + st.substring(6, 8);
                    ditem.id = req.query.id;
                    res.header("Access-Control-Allow-Origin", "*");
                    res.send(ditem);
                }

            });
        }

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

