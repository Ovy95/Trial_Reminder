require('dotenv').config(); 
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path')
const PORT = process.env.PORT || 5000

const nodemailer = require('nodemailer');
let cron = require('node-cron');

const app = express();
var messagebird = require('messagebird')(process.env.API_KEY); 

app.engine('handlebars', exphbs());
app.set('view engine','handlebars');

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


              // request and response
app.get('/', (req, res) => {
  res.render('contact', {layout: false});
});

app.post('/send', (req, res) => { 
  const output = `
  <h3>Trial Reminder</3>
  <ul>
  <li>Company Name: ${req.body.name}</li>
  <li>Website: ${req.body.company}</li>
  </ul>
  <p>This is a reminder message about the free trial ending for ${req.body.name} is tomorrow. Here is a link to the website ${req.body.company}.</p>
  <h3>Custom Message you wrote</h3>
  <p> ${req.body.message}</p>
  <br>
  <p>
  All the best Trial Reminder.
  Making trials free again</p>
  `;
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({ 
      
      // THis domain name 
      // host: 'trialreminder.herokuapp.com/',
      // port: 587,
      // secure: false, // true for 465, false for other ports
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL, 
        pass: process.env.PASSWORD
      },
      // This allows us to run it locally and send off the email to the cleint in local mode
      // tls:{
      //   rejectUnauthorized:false
      // }
    });
    
    let email = (req.body.email)
    let mailOptions = ({
      from: process.env.EMAIL, // sender address
      to: email, // email they put in the form
      subject: "Trial REMINDER", // Subject line
      text: "", // plain text body
      html: output // html body
    });

    // Date value being stored
    let date = (req.body.picker)
    let month = date.substring(5,7);
    let day = date.substring(8,10);
    let year = date.substring(0,4);
    // Time values being stored
    let time = (req.body.time)
    let hours = time.substring(0,2);
    let minute = time.substring(3,5);
    console.log(` Will be sent at ${hours};${minute} on the ${day}/${month}`)

    let phoneNumber = (req.body.phone)
    var params = {
      'originator': 'MessageBird',
      'recipients': [`${phoneNumber}`],
      'body': `This is a reminder message about the free trial ending for ${req.body.company} is tomorrow. Here is the message you wrote ${req.body.message}.
      All the best Trial Reminder.
       Making trials free again` 
    };
    let scheduledSMS = cron.schedule(`${minute} ${hours} ${day} ${month} * `, () => {
    messagebird.messages.create(params, function (err, response) {
      if (err) {
        return console.log(err);
      }
      console.log(response);
    });
    scheduledSMS.destroy();
    });

    let scheduledEmails = cron.schedule(`${minute} ${hours} ${day} ${month} * `, () => {
        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
            console.log("Message sent: %s", info.messageId);
          }
        });
        // This stops emails stops yearly emails
      scheduledEmails.destroy();
    });
    // This is a confirmation message printed out on the screen to say date and time message will be sent.
    res.render('contact',{layout: false,msg:`Your reminder will be sent to you at ${time} on the ${day}/${month}/${year}` });
  });
app.listen(PORT, () => console.log(`server started... on ${ PORT}`));