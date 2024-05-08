// Create web server
// Create /comments route
// Get comments from database
// Send comments back to client

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');
const collection = "comments";
const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());

// Get comments from database
app.get('/getComments', (req, res) => {
    db.getDB().collection(collection).find({}).toArray((err, documents) => {
        if (err)
            console.log(err);
        else {
            console.log(documents);
            res.json(documents);
        }
    });
});

// Update comments in database
app.put('/:id', (req, res) => {
    const commentID = req.params.id;
    const userInput = req.body;

    db.getDB().collection(collection).findOneAndUpdate({ _id: db.getPrimaryKey(commentID) }, { $set: { comment: userInput.comment } }, { returnOriginal: false }, (err, result) => {
        if (err)
            console.log(err);
        else
            res.json(result);
    });
});

// Create comments in database
app.post('/', (req, res) => {
    const userInput = req.body;
    db.getDB().collection(collection).insertOne(userInput, (err, result) => {
        if (err)
            console.log(err);
        else
            res.json({ result: result, document: result.ops[0] });
    });
});

// Delete comments in database
app.delete('/:id', (req, res) => {
    const commentID = req.params.id;
    db.getDB().collection(collection).findOneAndDelete({ _id: db.getPrimaryKey(commentID) }, (err, result) => {
        if (err)
            console.log(err);
        else
            res.json(result);
    });
});

db.connect((err) => {
    if (err) {
        console.log('Unable to connect to database');
        process.exit(1);
    } else {
        app.listen(3000, () => {
            console.log('Connected to database, app listening on port 3000');
        });
    }
});