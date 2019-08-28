// Import express
let express = require('express');

var bodyParser = require('body-parser');
// var cors=require('cors');

// Initialize the app
let app = express();
// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


//setup database config
var mysql = require('mysql');
var config = require('./config.json');

var pool = mysql.createPool({
  host: config.dbhost,
  user: config.dbuser,
  password: config.dbpassword,
  database: config.dbname
});


//Api explanation page
app.get('/api', function (req, res) {
  var connection = pool.getConnection(function (err, connection) {
    if (err) {
      return console.log("connection error");
    }
    else {
      console.log("conncection fine");
      res.json({
        urlExplanation: 'Hello World with Japanese Te Form API',
        verbs: 'send get request to /verbs will get all the te form verbs and assoicated data;',
        'verb/id': 'send get request to /verbs/id for specified word information by id',
        'verb/id': 'you also can send delete,update,put request to modify the specified word'
      });

      // process.exit();      
    }
  });
});


//get all the data from the api/verbs
app.get('/api/verbs', function (req, res) {
  var connection = pool.getConnection(function (err, connection) {
    if (err) {
      return console.log("connection error");
    }
    else {
      console.log("conncection fine");
      connection.query('SELECT * from verbs', function (error, results, fields) {
        // And done with the connection.
        connection.release();
        // Handle error after the release.
        if (error) throw error;
        else console.log(results);
        res.json(results);

      });
    }
  });
});

//get specified verb
app.get('/api/verbs/:id', function (req, res) {
  let id = req.params.id;
  // console.log(id);
  var connection = pool.getConnection(function (err, connection) {
    if (err) {
      return console.log("connection error");
    }
    else {

      console.log("conncection fine");
      if (!id) {
        return res.status(400).send({ error: true, message: 'Please provide verb id' });
      }
      connection.query('SELECT * from verbs where verbId=?', id, function (error, results, fields) {
        // And done with the connection.
        connection.release();
        // Handle error after the release.
        if (error) throw error;
        else console.log(results);
        res.json(results);

      });
    }
  });
});

//add a new verb
app.post('/api/verbs/', function (req, res) {
  var verbEng = req.body.verbEng;
  var verbJap = req.body.verbJap;
  var verbTeForm = req.body.verbTeForm;
  // console.log(verbEng);
  // console.log(verbJap);
  // console.log(verbTeForm);
  // console.log(id);

  var connection = pool.getConnection(function (err, connection) {
    if (err) {
      return console.log("connection error");
    }
    else {
      console.log("conncection fine");
      connection.query(`INSERT INTO verbs (verbEng, verbJap, verbTeForm) VALUE ("${verbEng}", "${verbJap}", '${verbTeForm}')`, function (error, results, fields) {
        // And done with the connection.
        connection.release();
        // Handle error after the release.
        if (error) throw error;
        else console.log(results);
        res.json(results);
        // process.exit();
      });
    }
  });
});


app.put('/api/verbs/:id', function (req, res) {
  var verbEng = req.body.verbEng;
  var verbJap = req.body.verbJap;
  var verbTeForm = req.body.verbTeForm;
  var verbId = req.body.verbId;
  // console.log(verbEng);
  // console.log(verbJap);
  // console.log(verbTeForm);
  // console.log(verbId);

  var connection = pool.getConnection(function (err, connection) {
    if (err) {
      return console.log("connection error");
    }
    else {
      console.log("conncection fine");
      connection.query(`UPDATE verbs SET verbEng = '${verbEng}', verbJap = '${verbJap}', verbTeForm = '${verbTeForm}' WHERE verbId = '${verbId}'`, function (error, results, fields) {
        // And done with the connection.
        connection.release();
        // Handle error after the release.
        if (error) throw error;
        else console.log(results);
        res.json(results);
      });
    }
  });
});



//delete the verb by id
app.delete('/api/verbs/:id', function (req, res) {
  let id = req.params.id;
  // console.log(id);
  var connection = pool.getConnection(function (err, connection) {
    if (err) {
      return console.log("connection error");
    }
    else {

      console.log("conncection fine");
      if (!id) {
        return res.status(400).send({ error: true, message: 'Please provide verb id' });
      }
      connection.query('DELETE from verbs where verbId=?', id, function (error, results, fields) {
        // And done with the connection.
        connection.release();
        // Handle error after the release.
        if (error) throw error;
        else console.log(results);
        res.json(results);
      });
    }
  });
});


// Setup server port
var port = process.env.PORT || 8080;

// Send message for default URL
// app.get('/', (req, res) => res.send('Hello World with Express'));

// app.get('/api', (req, res) => res.send('Hello World with Express'));

// Launch app to listen to specified port
app.listen(port, function () {
  console.log("Running API on port " + port);
});



