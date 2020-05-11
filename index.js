const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');

const index = express();
              // request and response
index.get('/', (req, res) => {
  res.send('Hello');
});

index.listen(3000, () => console.log('server started...'));