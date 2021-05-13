var ObjectID = require('mongodb').ObjectID;

module.exports = function (app, db) {
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
                res.header("Access-Control-Allow-Origin", "*");
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
            const d = new Date(
                st.substring(0, 4) +
                "-" +
                st.substring(4, 6) +
                "-" +
                st.substring(6, 8)
            );
            const isWeekend = d.getDay() === 5 || d.getDay() === 6;
            return {
                id: id,
                displayText: dispText,
                isDone: false,
                isSkipped: isWeekend,
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
                res.header("Access-Control-Allow-Origin", "*");
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
        const filterDetail = {
            id: req.query.id
        };

        if ((req.query.replaceWithDefault === undefined || req.query.replaceWithDefault === false) &&
            (req.query.restoreBackup === undefined || req.query.restoreBackup === false)) {
            // Has a specific list in mind, doesn't want default. Check to see if exists
            db.collection(colName).findOne(filterDetail, (err, item) => {
                if (err) {
                    console.log(err);
                    res.header("Access-Control-Allow-Origin", "*");
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
                                res.header("Access-Control-Allow-Origin", "*");
                                res.send({ 'error': "error occured" });
                            } else {
                                console.log("Got default  as backup: ", ditem);
                                const st = req.query.id.split('_')[1];
                                ditem.listTitle = st.substring(4, 6) + "/" + st.substring(6, 8);
                                if (category === "weekly")
                                    ditem.listTitle = "Week of " + ditem.listTitle;
                                ditem.id = req.query.id;
                                if (category === "weekly") {
                                    ditem.isSkipped = false;
                                } else {
                                    const d = new Date(
                                        st.substring(0, 4) +
                                        "-" +
                                        st.substring(4, 6) +
                                        "-" +
                                        st.substring(6, 8)
                                    );
                                    const isWeekend = d.getDay() === 5 || d.getDay() === 6;
                                    ditem.isSkipped = isWeekend;
                                }
                                res.header("Access-Control-Allow-Origin", "*");
                                res.send(ditem);
                            }

                        });
                    }

                }
            });
        } else if (req.query.replaceWithDefault !== undefined && req.query.replaceWithDefault) {
            // Want to replace this with the default list. Move old one to backup and return default list
            const newid = req.query.id + "_backup";
            const delDetail = {
                id: newid,
            };
            db.collection(colName).deleteOne(delDetail, (err) => {
                if (err) {
                    console.log(err);
                    res.header("Access-Control-Allow-Origin", "*");
                    res.send({ 'error': "error occured" });
                } else {
                    console.log("deleted old backup successfully");
                    const entry = {
                        $set: {
                            id: newid
                        }
                    };
                    const config = {
                        upsert: true
                    };
                    db.collection(colName).updateOne(filterDetail, entry, config, (err) => {
                        if (err) {
                            console.log(err);
                            res.header("Access-Control-Allow-Origin", "*");
                            res.send({ 'error': "error occured" });
                        } else {
                            console.log("moved to backup successfully");
                        }
                    });
                }
            });

            db.collection(colName).findOne(defaultFilterDetail, (derr, ditem) => {
                if (derr) {

                    console.log(derr);
                    res.header("Access-Control-Allow-Origin", "*");
                    res.send({ 'error': "error occured" });
                } else {
                    console.log("Got default: ", ditem);
                    const st = req.query.id.split('_')[1];
                    ditem.listTitle = st.substring(4, 6) + "/" + st.substring(6, 8);
                    if (category === "weekly")
                        ditem.listTitle = "Week of " + ditem.listTitle;
                    ditem.id = req.query.id;
                    if (category === "weekly") {
                        ditem.isSkipped = false;
                    } else {
                        const d = new Date(
                            st.substring(0, 4) +
                            "-" +
                            st.substring(4, 6) +
                            "-" +
                            st.substring(6, 8)
                        );
                        const isWeekend = d.getDay() === 5 || d.getDay() === 6;
                        ditem.isSkipped = isWeekend;
                    }
                    res.header("Access-Control-Allow-Origin", "*");
                    res.send(ditem);
                }

            });
        } else {
            // Restore a stored default
            const backupid = req.query.id + "_backup";
            const tempid = req.query.id + "_temp";

            const curDetail = {
                id: req.query.id,
            };
            const tmpDetail = {
                id: tempid,
            };
            const backupDetail = {
                id: backupid,
            };

            const curToTmpOp = {
                $set: {
                    id: tempid
                }
            };
            const backupToCurOp = {
                $set: {
                    id: req.query.id
                }
            };
            const tmpToBackupOp = {
                $set: {
                    id: backupid
                }
            };

            const config = {
                returnOriginal: false
            };

            db.collection(colName).findOneAndUpdate(curDetail, curToTmpOp, (err, item1) => {
                if (err) {
                    console.log(err);
                    res.header("Access-Control-Allow-Origin", "*");
                    res.send({ 'error': "error occured" });
                } else {
                    console.log("Move 1 went well...");
                    console.log("Got current item: ", item1);
                    db.collection(colName).findOneAndUpdate(backupDetail, backupToCurOp, config, (err, item) => {
                        if (err) {
                            console.log(err);
                            res.header("Access-Control-Allow-Origin", "*");
                            res.send({ 'error': "error occured" });
                        } else {
                            console.log("Got restored item: ", item);
                            res.header("Access-Control-Allow-Origin", "*");
                            res.send(item.value);

                            if (item1.lastErrorObject.n > 0) {
                                console.log("Performing final move");
                                db.collection(colName).findOneAndUpdate(tmpDetail, tmpToBackupOp, (err) => {
                                    if (err) {
                                        console.log(err);
                                        res.header("Access-Control-Allow-Origin", "*");
                                        res.send({ 'error': "error occured" });
                                    } else {
                                        console.log("Moving done!");
                                    }
                                });
                            } else {
                                console.log("No need for final move");
                            }
                        }
                    });
                }
            });

        }

    });


    app.put('/list', (req, res) => {
        console.log("received update request: ", req.body);

        delete req.body.data._id;
        const details = { 'id': req.body.data.id };
        const entry = {
            $set: {
                ...req.body.data
            }
        };
        const options = {
            upsert: true
        };

        let colName = "days_list";
        let category = "daily";
        if (req.body.data.id.split('_')[0] === "weekly") {
            colName = "weeks_list";
            category = "weekly";
        }

        db.collection(colName).updateOne(details, entry, options, (err) => {
            if (err) {
                console.log(err);
                res.header("Access-Control-Allow-Origin", "*");
                res.send({ 'error': "error occured" });
            } else {
                res.header("Access-Control-Allow-Origin", "*");
                res.send({ success: true });
            }
        });
    });

    app.put('/weeks_info', (req, res) => {
        console.log("received week info update request: ", req.body);

        delete req.body.data._id;
        const details = { 'id': req.body.data.id };
        const entry = {
            $set: {
                ...req.body.data
            }
        };
        const options = {
            upsert: true
        };

        db.collection("weeks_info").updateOne(details, entry, options, (err) => {
            if (err) {
                console.log(err);
                res.header("Access-Control-Allow-Origin", "*");
                res.send({ 'error': "error occured" });
            } else {
                res.header("Access-Control-Allow-Origin", "*");
                res.send({ success: true });
            }
        });
    });

    app.put('/days_info', (req, res) => {
        console.log("received day info update request: ", req.body);

        delete req.body.data._id;
        const details = { 'id': req.body.data.id };
        const entry = {
            $set: {
                ...req.body.data
            }
        };
        const options = {
            upsert: true
        };

        db.collection("days_info").updateOne(details, entry, options, (err) => {
            if (err) {
                console.log(err);
                res.header("Access-Control-Allow-Origin", "*");
                res.send({ 'error': "error occured" });
            } else {
                res.header("Access-Control-Allow-Origin", "*");
                res.send({ success: true });
            }
        });
    });


    app.post('/list', (req, res) => {
        console.log("received post request: ", req.body);

        let colName = "days_list";
        let category = "daily";
        if (req.body.id.split('_')[0] === "weekly") {
            colName = "weeks_list";
            category = "weekly";
        }

        const defaultDetail = {
            id: "default"
        };
        const moveToBackupOp = {
            $set: {
                id: "default_backup"
            }
        }
        const backupDefaultDetail = {
            id: "default_backup"
        };

        const newDefaultEntry = {
            id: "default",
            listTitle: "default",
            listItems: req.body.items
        }

        if (req.body.newDefault !== undefined && req.body.newDefault) {
            //1. delete old backup
            //2. move current default into backup
            //3. insert new backup entry with new list

            db.collection(colName).deleteOne(backupDefaultDetail, (err) => {
                if (err) {
                    console.log(err);
                    res.header("Access-Control-Allow-Origin", "*");
                    res.send({ 'error': "error occured" });
                } else {
                    db.collection(colName).updateOne(defaultDetail, moveToBackupOp, (err) => {
                        if (err) {
                            console.log(err);
                            res.header("Access-Control-Allow-Origin", "*");
                            res.send({ 'error': "error occured" });
                        } else {
                            db.collection(colName).insertOne(newDefaultEntry, (err) => {
                                if (err) {
                                    console.log(err);
                                    res.header("Access-Control-Allow-Origin", "*");
                                    res.send({ 'error': "error occured" });
                                } else {
                                    res.header("Access-Control-Allow-Origin", "*");
                                    res.send({ success: true });
                                }
                            })
                        }
                    });
                }
            });

        } else {
            console.log("Restoring old default entries");

            const curDetail = {
                id: "default"
            }
            const tmpDetail = {
                id: "default_tmp"
            }
            const backupDetail = {
                id: "default_backup"
            }

            const curToTmpOp = {
                $set: {
                    id: "default_tmp"
                }
            }
            const tmpToBackupOp = {
                $set: {
                    id: "default_backup"
                }
            }
            const backupToCurOp = {
                $set: {
                    id: "default"
                }
            }

            db.collection(colName).findOneAndUpdate(curDetail, curToTmpOp, (err, item1) => {
                if (err) {
                    console.log(err);
                    res.header("Access-Control-Allow-Origin", "*");
                    res.send({ 'error': "error occured" });
                } else {
                    console.log("Move 1 went well...");
                    console.log("Got current item: ", item1);
                    db.collection(colName).findOneAndUpdate(backupDetail, backupToCurOp, (err) => {
                        if (err) {
                            console.log(err);
                            res.header("Access-Control-Allow-Origin", "*");
                            res.send({ 'error': "error occured" });
                        } else {
                            res.header("Access-Control-Allow-Origin", "*");
                            res.send({ success: true });

                            if (item1.lastErrorObject.n > 0) {
                                console.log("Performing final move");
                                db.collection(colName).findOneAndUpdate(tmpDetail, tmpToBackupOp, (err) => {
                                    if (err) {
                                        console.log(err);
                                        res.header("Access-Control-Allow-Origin", "*");
                                        res.send({ 'error': "error occured" });
                                    } else {
                                        console.log("Moving done!");
                                    }
                                });
                            } else {
                                console.log("No need for final move");
                            }
                        }
                    });
                }
            });
        }
    });



    app.put('/lists/:id', (req, res) => {
        console.log("in unused put func");
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        const note = { title: req.body.title, body: req.body.body };
        db.collection("notes").updateOne(details, note, (err) => {
            if (err) {
                console.log(err);
                res.header("Access-Control-Allow-Origin", "*");
                res.send({ 'error': "error occured" });
            } else {
                res.header("Access-Control-Allow-Origin", "*");
                res.send(note);
            }
        });
    });

    app.post('/lists', (req, res) => {
        console.log("in unused post func");
        const note = { title: req.body.title, body: req.body.body };
        db.collection("notes").insertOne(note, (err, result) => {
            if (err) {
                console.log(err);
                res.header("Access-Control-Allow-Origin", "*");
                res.send({ 'error': "error occured" });
            } else {
                res.header("Access-Control-Allow-Origin", "*");
                res.send(result.ops[0]);
            }

        });
    });

    app.delete('/lists/:id', (req, res) => {
        console.log("in unused delete func");
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        db.collection("notes").deleteOne(details, (err, item) => {
            if (err) {
                console.log(err);
                res.header("Access-Control-Allow-Origin", "*");
                res.send({ 'error': "error occured" });
            } else {
                res.header("Access-Control-Allow-Origin", "*");
                res.send('deleted ' + id + ' successfully');
            }

        });
    });


};

