const http = require('http');
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const requestContext = require('../lib/middleware/request-context.middleware.js');
const app = express();
const serverPort = process.env.SERVER_PORT || 8080;

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/*
 * Routes
 */
{{#each @root.swagger.endpoints}}
{{#endsWith @root.swagger.basePath '/'}}
app.use('{{@root.swagger.basePath}}{{..}}', require('./routes/{{..}}.route.js'));
{{else}}
app.use('{{@root.swagger.basePath}}/{{..}}', require('./routes/{{..}}.route.js'));
{{/endsWith}}
{{/each}}

// catch 404
app.use((req, res, next) => {
  console.error(`Error 404 on ${req.url}.`);
  res.status(404).send({ status: 404, error: 'Not found' });
});

// catch errors
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const msg = err.error || err.message;
  //console.error(`Error ${status} (${msg}) on ${req.method} ${req.url} with payload ${req.body}.`);
  console.error(err);
  res.status(status).send({ status, error: "There was an error."});
});

http.createServer(app).listen(serverPort, () => {
  console.info(
    "{{@root.swagger.info.title}} is listening on port %d (http://localhost:%d)",
    serverPort,
    serverPort
  );
});
