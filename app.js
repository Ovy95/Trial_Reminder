const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path')

const nodemailer = require('nodemailer');
let cron = require('node-cron');

const app = express();
var messagebird = require('messagebird')('8TnQekO4w47Zd6JHLSDzYghY6');


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
  // This is whats going to be pushed in the email so its using the form details as you can see plus whatever else you want in there
  const output = `
  
  <p>You have a new contact request</p>
  <h3>Trail Reminder</3>
  <ul>
  <li>Company Name: ${req.body.name}</li>
  <li>Website: ${req.body.company}</li>
  <li>Email: ${req.body.email}</li>
  <li>Phone: ${req.body.phone}</li>
  </ul>
  <h3>Message</h3>
  <p>${req.body.message}</p>
  `;
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({ 
      
      // THis domain name 
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      // service: 'gmail',
      auth: {
        user: '', // generated ethereal user  // Current hasn't got the email and password saved needs to be saved into an enviroment
        pass: ''// generated ethereal password
      },
      // This allows us to run it locally and send off the email to the cleint in local mode
      tls:{
        rejectUnauthorized:false
      }
    });
    //saves the value stored to send that email back to them
    let email = (req.body.email)
    // send mail with defined transport object
    let mailOptions = ({
      from: 'freetrailerreminder@gmail.com', // sender address
      to: email, // email they put in the form
      subject: "Free TRAIL REMINDER", // Subject line
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
      'body': `This is a reminder message about the free trailer ending for ${req.body.company} is tomorrow. Here is the message you wrote ${req.body.message}.
      All the best TRAIL REMINDER making trails free again` 
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
app.listen(3000, () => console.log('server started...'));