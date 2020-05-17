const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path')

const nodemailer = require('nodemailer');
let cron = require('node-cron');

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
  // This is whats going to be pushed in the email so its using the form details as you can see plus whatever else you want in there
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

  //This just prints out the form infomation just to check
  console.log(req.body)
  
  // This saves the email from the form then sends it 
  let email = (req.body.email)
  // Just checks the email
  console.log(email)
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({ 
      
      // THis domain name 
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      // service: 'gmail',
      auth: {
        user: , // generated ethereal user
        pass: // generated ethereal password
      },
      // This allows us to run it locally and send off the email to the cleint in local mode
      tls:{
        rejectUnauthorized:false
      }
    });

    // send mail with defined transport object
    let mailOptions = ({
      from: 'freetrailerreminder@gmail.com', // sender address
      to: email, // list of receivers
      subject: "Free TRAIL REMINDER", // Subject line
      text: "Hello world?", // plain text body
      html: output // html body
    });

    // This will send an email every min when app is running
    //     # ┌────────────── second (optional)
    //  # │ ┌──────────── minute
    //  # │ │ ┌────────── hour
    //  # │ │ │ ┌──────── day of month
    //  # │ │ │ │ ┌────── month
    //  # │ │ │ │ │ ┌──── day of week
    //  # │ │ │ │ │ │
    //  # │ │ │ │ │ │
    //  # * * * * * *
    //https://github.com/node-cron/node-cron
    cron.schedule('* * * * *', () => {
      console.log('email sent ever MIN');
        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
            console.log("Message sent: %s", info.messageId);
          }
        });
    });
    res.render('contact',{layout: false,msg:'Email has been sent'});
  });
  cron.schedule('* * * * *', () => {
    console.log('running a task every MInitue');
 });
app.listen(3000, () => console.log('server started...'));