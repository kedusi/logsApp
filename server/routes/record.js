const express = require('express');

const recordRoutes = express.Router();

const dbo = require('../db/conn');

const ObjectId = require('mongodb').ObjectId;

// get all records
recordRoutes.route('/record').get(function (req, res) {
    let db_connect = dbo.getDb('logs');
    db_connect
        .collection('records')
        .find({})
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

// get a single record by id
recordRoutes.route('/record/:id').get(function(req, res) {
    let db_connect = dbo.getDb();
    let myQuery = {_id: ObjectId(req.params.id)};
    db_connect
        .collection('records')
        .findOne(myQuery, function(err, result) {
            if(err) throw err;
            res.json(result);
        });
});

// create a record
recordRoutes.route('/record/add').post(function(req, res) {
    let db_connect = dbo.getDb();
    let myObj = {
        equipment: req.body.equipmentName,
        user: req.body.userName,
        timestamp: req.body.timestamp || Date.now(),
        log: req.body.logBody
    };
    db_connect.collection('records').insertOne(myObj, function(err, result) {
        if(err) throw err;
        res.json(result);
    });
});

// update a record by id
recordRoutes.route('/update/:id').post(function(req, res) {
    let db_connect = dbo.getDb();
    let myQuery = {_id: ObjectId(req.params.id)};
    let newValues = {
        $set: {
            equipment: req.body.equipmentName,
            user: req.body.userName,
            timestamp: req.body.timestamp,
            lob: req.body.logBody
        }
    };
    db_connect
        .collection('records')
        .updateOne(myQuery, newValues, function(err, result) {
            if(err) throw err;
            console.log('1 record updated');
            res.json(result);
        });
});

// delete a record
recordRoutes.route('/delete/:id').delete(function(req, res) {
    let db_connect = dbo.getDb();
    let myQuery = {_id: ObjectId(req.params.id)};
    db_connect.collection('records').deleteOne(myQuery, function(err, result) {
        if(err) throw err;
        console.log('1 document deleted');
        res.json(result);
    });
});

module.exports = recordRoutes;