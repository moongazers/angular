var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var swaggerJSDoc = require('swagger-jsdoc');

var mongoUri = 'mongodb://localhost/noderest';
mongoose.connect(mongoUri);

var db = mongoose.connection;
db.on('error', function() {
	throw new Error('unabled to connect to database at ' + mongoUri);
});

var app = express();

// swagger definition
var swaggerDefinition = {
  info: {
    title: 'Sigfig RPT Swagger API',
    version: '1.0.0',
    description: 'Rest APIs for the front end programming test',
  },
  host: 'localhost:3001',
  basePath: '/',
};

// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./*.js', './models/*.js'],
};

// initialize swagger-jsdoc
app.swaggerSpec = swaggerJSDoc(options);


app.configure(function() {
	app.use(express.bodyParser());
	app.use('/swagger', express.static('../swagger'));
	app.use('/testCode', express.static('../testCode'));
  app.use('/curtis', express.static('../curtisCaliTestCode'));
  app.use('/angular-rpt', express.static('../angular-rpt'));
  app.use('/aishwara', express.static('../aishwara'));
	app.use('/marcus', express.static('../marcus'));
  app.use('/vince', express.static('../vince'));

});

require('./models/company.js');
require('./models/person.js');

require('./routes.js')(app);

app.listen(3001);
console.log('Listening on port 3001...');
