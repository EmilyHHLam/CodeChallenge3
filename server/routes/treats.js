var express = require("express");
var router = express.Router();
var pg = require("pg");

var config = {
  database: "chi", // name of your database
  host: "localhost", //where is your database?
  port: 5432, // port for the database
  max: 10, // how many connections at one time
  idleTimeoutMillis: 30000 //30 seconds to connect
};

var pool = new pg.Pool(config);
// GET /treats
router.get('/', function (req, res) {
  pool.connect(function (err, client, done) {
    if (err) {
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      done();
      return;
    }
    /** ---- YOUR CODE BELOW ---- **/
    // Add pg and pSQL code here to get treats from the treatDB
    client.query('SELECT * FROM "treats";',
               function(queryError, result){
      done();
        if(queryError) {
          console.log('Error making query.');
          res.send(500);
        } else {
          console.log(result); // Good for debugging
          res.send(result.rows);
        }//end 2nd set of if statement
      }); //end the function to select query
  });
});

/** ---- YOUR CODE BELOW ---- **/
// POST /treats
router.post('/', function(req, res){
  console.log(req.body);
  var cakeName = req.body.name;
  var cakeDesc = req.body.description;
  var cakePic = req.body.pic;
  // var employeeID = req.body.employee_id;
  pool.connect(function(errorConnectingToDatabase, db, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database.');
      res.send(500);
    } else {
      // We connected!!!!

      db.query('INSERT INTO "treats" ("name", "description", "pic")' +
               ' VALUES ($1,$2, $3);',
                [cakeName, cakeDesc, cakePic], function(queryError, result){
        done();
        if(queryError) {
          console.log('Error making query.');
          res.send(500);
        } else {
          res.sendStatus(201);
        }
      });
    }
  });
});

// PUT /treats/<id>
router.put('/:id', function(req, res){
  var id = req.params.id;
  var cakeName = req.body.name;
  var cakeDesc = req.body.description;
  var cakePic = req.body.pic;

  console.log(req.body);
  console.log('id=' + id);


  pool.connect(function(errorConnectingToDatabase, db, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database.');
      res.send(500);
    } else {
      // We connected!!!!
      db.query('UPDATE "treats" SET "name" = $1, "description"= $2, "pic" = $3 WHERE "id"=$4;',
      [cakeName, cakeDesc, cakePic, id], function(queryError, result){
        done();
        if(queryError) {
          console.log('Error making query.');
          res.send(500);
        } else {
          res.sendStatus(202);
        }
      });
    }
  });
});

// DELETE /treats/<id>
router.delete('/:id', function(req, res){
  console.log('id =' + req.params.id);
  var id = req.params.id;

  pool.connect(function(errorConnectingToDatabase, db, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database.');
      res.send(500);
    } else {
      // We connected!!!!
      db.query('DELETE FROM "treats" WHERE "id" = ' + id + ';', function(queryError, result){
        done();
        if(queryError) {
          console.log('Error making query.');
          res.send(500);
        } else {
          res.sendStatus(202);
        }
      });
    }
  });
});

/** ---- DO NOT MODIFY BELOW ---- **/
module.exports = router;
