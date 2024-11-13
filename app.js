require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const encrypt = require('mongoose-encryption');
const session = require('express-session');
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect(process.env.MONGO_URI);

const userSchema=new mongoose.Schema({
  email:String,
  password:String,
  role:String,
  // username:String
})

userSchema.plugin(passportLocalMongoose);

const User=mongoose.model("User",userSchema);




passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//authentication

app.get('/', function (req, res) {
  if(req.isAuthenticated()){
    res.redirect("/dashboard");
  } else {
    // Fetch guidelines, doctors, camp details, and hospitals
    Promise.all([Guidelines.find({}), Doctor.find({}), Camp.find({}), Hospital.find({})])
      .then(([guidelines, doctors, camps, hospitals]) => {
        // Reverse the order of guidelines before rendering the main page
        const reversedGuidelines = guidelines.reverse();
        // Get current date
        const currentDate = new Date();
        // Separate upcoming and past camps
        const upcomingCamps = [];
        const pastCamps = [];
        camps.forEach(camp => {
          if (camp.campDate > currentDate) {
            upcomingCamps.push(camp);
          } else {
            pastCamps.push(camp);
          }
        });
        // Sort upcoming camps by date
        upcomingCamps.sort((a, b) => a.campDate - b.campDate);
        // Combine upcoming and past camps
        const sortedCamps = upcomingCamps.concat(pastCamps);
        res.render('main', { guidelines: reversedGuidelines, doctors: doctors, camps: sortedCamps, hospitals: hospitals });
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Internal Server Error');
      });
  }
});















app.use(function(req, res, next) {
  Doctor.find({})
    .then(doctors => {
      // Store doctors in res.locals for access in templates
      res.locals.doctors = doctors;
      next();
    })
    .catch(err => {
      console.log("Error fetching doctors:", err);
      next(err); // Pass error to error handling middleware
    });
});


// Route to render dashboard for patients


app.get("/dashboard", function(req, res) {
  if (req.isAuthenticated()) {
    // Fetch guidelines, doctors, camps, and feedback
    Promise.all([Guidelines.find({}), Doctor.find({}), Camp.find({}), Feedback.find({}).sort({ createdAt: -1 }), Hospital.find({})])
      .then(([guidelines, doctors, camps, feedbacks, hospitals]) => {
        // Reverse the order of guidelines before rendering the dashboard page
        const reversedGuidelines = guidelines.reverse();
        // Get current date
        const currentDate = new Date();
        // Separate upcoming and past camps
        const upcomingCamps = [];
        const pastCamps = [];
        camps.forEach(camp => {
          if (camp.campDate > currentDate) {
            upcomingCamps.push(camp);
          } else {
            pastCamps.push(camp);
          }
        });
        // Sort upcoming camps by date
        upcomingCamps.sort((a, b) => a.campDate - b.campDate);
        // Combine upcoming and past camps
        const sortedCamps = upcomingCamps.concat(pastCamps);
        // Render dashboard based on user role
        let disease_name = "";
        User.findOne({ username: req.user.username })
          .then(function(authenticatedUser) {
            if (authenticatedUser) {
              const userRole = authenticatedUser.role;
              if (userRole === 'patient') {
                res.render("loggedpatient", { guidelines: reversedGuidelines, doctors: res.locals.doctors, camps: sortedCamps, hospitals: hospitals, disease: disease_name });
              } else if (userRole === 'doctor') {
                res.render("loggeddoctor", { guidelines: reversedGuidelines, doctors: res.locals.doctors, camps: sortedCamps, hospitals: hospitals });
              } else {
                res.render("loggedadmin", { guidelines: reversedGuidelines, doctors: res.locals.doctors, camps: sortedCamps, feedbacks: feedbacks, hospitals: hospitals });
              }
            }
          })
          .catch(err => {
            console.log("Error finding user:", err);
            res.redirect("/");
          });
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        res.redirect("/");
      });
  } else {
    res.redirect("/");
  }
});











app.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});


app.post("/register", function(req, res) {
  User.register({ username: req.body.id, email: req.body.email, role: "patient" }, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      // Return more details about the error in the response
      return res.status(400).json({ success: false, message: "Registration failed", error: err.message });
    } else {
        console.log("done");
        res.redirect("/dashboard");
      ;
    }
  });
});




app.post("/login",function(req,res){

  const user=new User({
      username:req.body.username,
      password:req.body.password,
  });

  req.logIn(user,function(err){
      if(err){
          console.log(err)
      }
      else{
          passport.authenticate("local")(req,res,function(){
            res.redirect("/dashboard");
          });
      }
  })
});


//authentication


// Set up Multer storage
const storage = multer.diskStorage({
 destination: 'public/uploads/',
 filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
 },
});


const guidelinesStorage = multer.diskStorage({
  destination: 'public/guidelines/',
  filename: function (req, file, cb) {
    cb(null, file.originalname + path.extname(file.originalname));
  },
});


const upload = multer({ storage: storage });
const guidelinesUpload = multer({ storage: guidelinesStorage });

//camps details

const campSchema = new mongoose.Schema({
  campName: {
    type: String,
    required: true
  },
  campDate: {
    type: Date,
    required: true
  }
});

const Camp = mongoose.model('Camp', campSchema);


app.post('/submitcamp', (req, res) => {
  const name=req.body.campname;
  const date=req.body.campdate;

  const newCamp = new Camp({
    campName:name,
    campDate:date
  });

  newCamp.save()
    .then(() => {
      console.log('Camp saved successfully');
      res.redirect('/dashboard');
    })
    .catch((err) => {
      console.error('Error saving camp:', err);
      res.status(500).send('Error saving camp');
    });
});





//prescription

const prescriptionSchema = new mongoose.Schema({
  patientName: String,
  medications: [
    {
      name: String,
      dosage: String,
      frequency: String,
    },
  ],
  labTests: [String],
  prescriptionDate: {
    type: Date,
    default: new Date().setUTCHours(0, 0, 0, 0), // Set to the current date with time set to midnight     
  },
  prescriptionTime: {
    type: String,
    default: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
});

prescriptionSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields: ["medications", "labTests"]});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

app.post('/prescriptions', async (req, res) => {
try {
  const { patientName, medications, labTests, prescriptionDate, prescriptionTime } = req.body;

  const newPrescription = new Prescription({
    patientName,
    medications,
    labTests,
    prescriptionDate,
    prescriptionTime,
  });

  const savedPrescription = await newPrescription.save();
  res.redirect("/dashboard");
} catch (error) {
  console.error(error);
  res.status(500).send('Internal Server Error');
}
});


app.get('/prescriptions', async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const authenticatedUser = await User.findOne({ username: req.user.username });

      if (authenticatedUser) {
        const userRole = authenticatedUser.role;
        if (userRole !== 'patient') {
          // Doctors don't have access to prescriptions
          res.render('noAccess'); // You can create a specific page for no access
        } else {
          // Find all prescriptions for the given username
          try {
            const prescriptions = await Prescription.find({ patientName: req.user.username }).sort({
              prescriptionDate: -1,
              prescriptionTime: -1,
            }).exec(); // Execute the query and get the result

            console.log(prescriptions);
            res.render("prescriptions", { prescriptions: prescriptions });
          } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
          }
        }
      }
    } else {
      res.redirect('/');
    }
  } catch (err) {
    console.log(err);
    res.redirect("/dashboard");
  }
});


// var disease_name="";

//prediction disease

app.post('/predictions', function(req, res) {
  console.log(req.body);

  const { spawn } = require("child_process");
  const childPython = spawn("python", ["pred.py", req.body.symptom1, req.body.symptom2, req.body.symptom3, req.body.symptom4, req.body.symptom5]);
  let jsonData = "";

  childPython.stdout.on("data", (data) => {
    jsonData += data.toString(); // Accumulate data as it comes
    console.log(`stdout : ${data}`);
  });

  childPython.stderr.on("data", (data) => {
    console.error(`stderr : ${data}`);
  });

  childPython.on("close", async (code) => {
    console.log(`child process exited with code :  ${code}`);
  disease_name = jsonData;
    // Send the predicted disease back to the client
    res.json({ disease: disease_name });
  });
});



//add hospital
const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  site: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
});


const Hospital= mongoose.model('Hospital', hospitalSchema);

app.post('/add_hospital', (req, res) => {
  const { name, site, location } = req.body;

  // Create a new hospital instance
  const newHospital = new Hospital({
    name,
    site,
    location,
  });

  // Save the hospital instance to the database
  newHospital.save()
    .then((hospital) => {
      console.log('Hospital saved successfully:', hospital);
      res.redirect("/dashboard");
    })
    .catch((error) => {
      console.error('Error saving hospital:', error);
      res.status(500).send('Internal Server Error');
    });
});





//feedback

const feedbackSchema = new mongoose.Schema({
  feedback: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a model using the schema
const Feedback = mongoose.model('Feedback', feedbackSchema);

app.post('/submitFeedback', (req, res) => {
  // Extract feedback from the request body
  const { feedback } = req.body;

  // Create a new Feedback object
  const newFeedback = new Feedback({
    feedback: feedback
  });

  // Save the feedback to the database
  newFeedback.save()
    .then(() => {
      // Feedback saved successfully
      res.redirect('/dashboard');
    })
    .catch(err => {
      // Error occurred while saving feedback
      console.error('Error saving feedback:', err);
      res.status(500).json({ error: 'An error occurred while saving feedback.' });
    });
});









// Mongoose schema
const reportSchema = new mongoose.Schema({
 username: String,
 filename: String,
});


const Report = mongoose.model('Report', reportSchema);


const guidelinesSchema = new mongoose.Schema({
  filename: String,
});

const Guidelines = mongoose.model('Guidelines', guidelinesSchema);



// Handle file upload
app.post('/upload', upload.array('file'), function (req, res) {

  
    const username = req.body.username;
    const files = req.files;
   
    files.forEach(file => {
       const newReport = new Report({
         username: username,
         filename: file.filename,
       });
   
       newReport.save().then(() => {
         console.log('Report saved successfully!');
         res.redirect('/dashboard');
       }).catch(err => {
         console.log(err);
       });
    });
   });


   
   app.post('/guidelines-upload', guidelinesUpload.array('file'), function (req, res) {
    const files = req.files;

    files.forEach(file => {
    const newGuidelines = new Guidelines({
      filename: file.filename,
    });
    newGuidelines.save().then(() => {
      console.log('Guidelines saved successfully!');
      res.redirect('/dashboard');
    }).catch(err => {
      console.log(err);
      
    });
  });
});




//view reports

app.get('/reports', function (req, res) {
  if (req.isAuthenticated()) {
    User.findOne({ username: req.user.username}).then(function(authenticatedUser){
    if(authenticatedUser){
      const userRole = authenticatedUser.role;
      if (userRole !== 'patient') {
        // Doctors don't have access to reports
        res.render('noAccess'); // You can create a specific page for no access
      } else {
        // Find all reports for the given username
        Report.find({ username: req.user.username })
          .then(reports => {
            // Render a page with the list of reports
            res.render('userFiles', { username: req.user.username, reports: reports });
          })
          .catch(err => {
            console.error(err);
            res.status(500).send('Internal Server Error');
          });
      }
    }
    
  }).catch(err => {
    console.log(err);
    res.redirect("/dashboard");
  })}
   else {
    res.redirect('/');
  }
});

//view reports



//Available doctor

     app.get('/book-appointment', function (req, res) {
      if (req.isAuthenticated()) {
        User.findOne({ username: req.user.username}).then(function(authenticatedUser){
          if(authenticatedUser){
            const userRole = authenticatedUser.role;
            if (userRole !== 'patient') {
              // Doctors don't have access to reports
              res.render('noAccess'); // You can create a specific page for no access
            } else {
              // Find all reports for the given username
              Doctor.find().then(function (doctor) {
                res.render('appointmentForm', { user: req.user.username, doctors: doctor });
            }).catch(function (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            });
            }
          }
        }).catch(err => {
          console.log(err);
     
          res.redirect("/dashboard");
        })
      } else {
        res.redirect('/'); // Redirect to the home page if not authenticated
      }
      } );

//Available doctor
    


   //adding doctor
const doctorSchema=new mongoose.Schema({
   doctoremail: String,
   doctorname: String,
   doctorid:String,
   availability: String,
   qualification:String,
   designation:String,
   timeSlots: [String]
});

const Doctor=mongoose.model('Doctor',doctorSchema);

//DOCTOR ADD to docotordb and userdb 

app.post('/addDoctor', function(req, res) {
        const username = req.body.id;
   const email=req.body.email;
   const password=req.body.password;
   const role="doctor";
   const name=req.body.name;
   let l="available";
   const qualification=req.body.qualification;
   const designation=req.body.designation;

   const newDoctor=new Doctor({
     doctoremail:email,
     doctorname:name,
     availability:l,
     doctorid:username,
     designation:designation,
     qualification:qualification,
     timeSlots: ['10:00 AM - 11:00 AM', '2:00 PM - 3:00 PM', '5:00 PM - 6:00 PM']
   }) 
   
   newDoctor.save().then(function(){
    console.log("doctor saved");
   });

    
      User.register({username: req.body.id,email: req.body.email,role:role},password,function(err,user){
        if(err){
            console.log(err);
            res.redirect("/dashboard");
        }
        else{
          console.log("done admin");
        res.redirect("/dashboard");
        }
    })
    

});

//DOCTOR ADD



//appointment store

const appointmentSchema = new mongoose.Schema({
   username: String,
   doctorname: String,
   date: Date,
   timeSlot: String
 });
 
 const Appointment = mongoose.model('Appointment', appointmentSchema);

 //appointment create

 app.post('/:username/book-appointment', function (req, res) {
   const username = req.params.username;
   const doctorname = req.body.doctor; 
   const date = req.body.date;
   const timeSlot = req.body.timeSlot;
 
   // Create a new appointment
   const newAppointment = new Appointment({
      username: username,
      doctorname: doctorname,
      date: date,
      timeSlot: timeSlot,
    });

   newAppointment.save().then(() => {
      console.log('Appointment saved successfully!');
      // Redirect to a success page or handle as needed
      res.redirect('/dashboard');
    })
    .catch((err) => {
      console.error(err);
      // Handle the error, maybe redirect to an error page
      res.status(500).send('Internal Server Error');
    });
});

 //appointment create



//view appointments patient and doctor

app.get('/view-appointments', function (req, res) {
  if (req.isAuthenticated()) {

    User.findOne({ username: req.user.username}).then(function(authenticatedUser){
      if(authenticatedUser){
        const userRole = authenticatedUser.role;
        if (userRole === 'admin') {
          // Doctors don't have access to reports
          res.render('noAccess'); // You can create a specific page for no access
        }
        else if(userRole === 'doctor'){

          Doctor.findOne({ doctorid: req.user.username})
   .then(doctor => {
     const doctorname = doctor.doctorname;
     Appointment.find({ doctorname: doctorname })
     .sort({ date: 'desc' })
         .then(appointments => {
           // Render a page with the list of appointments, including patient names
           res.render('doctorviewAppointments', { doctorname: doctorname, appointments: appointments });
         })
         .catch(err => {
            console.error(err);
            res.status(500).send('Internal Server Error');
          });
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Internal Server Error');
      });
        }
        else{

          Appointment.find({ username: req.user.username })
          .sort({ date: 'desc' })
          .then(appointments => {
            // Render a page with the list of appointments
            res.render('viewAppointments', { username: req.user.username, appointments: appointments });
          })
          .catch(err => {
            console.error(err);
            res.status(500).send('Internal Server Error');
          });

        }
      }
    }).catch(err => {
      console.log(err);

      res.redirect("/dashboard");
    })
  } else {
    res.redirect('/'); // Redirect to the home page if not authenticated
  }
 });

 //view appointments patient  





// Endpoint to handle availability form submission
 app.post('/availability', (req, res) => {

  const availability = req.body.availability;
  const username = req.isAuthenticated() ? req.user.username : null;
  // Update the availability of the doctor in the database
  Doctor.findOneAndUpdate({ doctorid: username }, { availability: availability }, { new: true })
      .then(updatedDoctor => {
          if (!updatedDoctor) {
              return res.status(404).send('Doctor not found');
          }

          console.log('Doctor availability updated successfully:', updatedDoctor);
          res.redirect('/dashboard');
      })
      .catch(error => {
          console.error('Error updating doctor availability:', error);
          res.status(500).send('Internal Server Error');
      });
});





app.listen(3000, function () {
 console.log('Server started on port 3000');
});