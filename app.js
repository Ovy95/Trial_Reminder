const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path')
const nodemailer = require('nodemailer');

const app = express();

// view engine setup 
app.engine('handlebars', exphbs());
app.set('view engine','handlebars');

// static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


              // request and response
app.get('/', (req, res) => {
  res.render('contact', {layout: false});
});

app.post('/send', (req, res) => { 
  const output = `
  <p>You have a new contact request</p>
  <h3> Contact details</3>
  <ul>
  <li>Name: ${req.body.name}</li>
  <li>Company: ${req.body.company}</li>
  <li>Email: ${req.body.email}</li>
  <li>Phone: ${req.body.phone}</li>
  </ul>
  <h3>Message</h3>
  <p>${req.body.message}</p>
  `; 
  console.log(req.body)
});

app.listen(3000, () => console.log('server started...'));