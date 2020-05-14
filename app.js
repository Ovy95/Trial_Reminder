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
        // Added this to git without email and password loggin needed
      },
      // This allows us to run it locally and send off the email to the cleint in local mode
      tls:{
        rejectUnauthorized:false
      }
    });

    // send mail with defined transport object
    let info = transporter.sendMail({
      from: '', // sender address
      to: email, // list of receivers
      subject: "Free TRAIL REMINDER", // Subject line
      text: "Hello world?", // plain text body
      html: output // html body
    });

    // transporter.sendMail(info,(error, info) => {
    //   if(error) {
    //     return console.log(error);
    //   }
    //   console.log("1")
    // console.log("Message sent: %s", info.messageId);
    // console.log("3")
    // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // // });
  
    
    res.render('contact',{layout: false,msg:'Email has been sent'});
  });

app.listen(3000, () => console.log('server started...'));