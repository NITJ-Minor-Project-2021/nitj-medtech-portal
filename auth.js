
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword,sendEmailVerification,sendPasswordResetEmail,onAuthStateChanged,signOut,updateProfile  } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";



const firebaseConfig = {
  apiKey: "AIzaSyBBwpCQDyzCSqYAzZF3IuZF3ZZWnmNdG58",
  authDomain: "nn-game-guidez-71846.firebaseapp.com",
  projectId: "nn-game-guidez-71846",
  storageBucket: "nn-game-guidez-71846.appspot.com",
  messagingSenderId: "306262593963",
  appId: "1:306262593963:web:b351376beef1fe6c0a82ee",
  measurementId: "G-4JMKFE5SVR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);



const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    if (user.emailVerified) {
      // User is logged in and email is verified
      const uid = user.uid;
      const role = user.displayName;
    if (role === 'Doctor') {
      setupUI(user,true,true);
    }
    else
      setupUI(user,true,false);
    } else {
      // User is logged in, but email is not verified
      // Sign the user out and show a message
      signOut(auth).then(() => {
        alert('Email is not verified. Please verify your email and log in again.');
      });
    }
  } else {
    // User is not logged in
    setupUI();
  }
});




const signupdoctorForm = document.querySelector('#signupdoctor-form');
// Declare user in a broader scope

signupdoctorForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let user; 
  // get user info
  const email = signupdoctorForm['signupdoctor-email'].value;
  const password = signupdoctorForm['signupdoctor-password'].value;
  const role = signupdoctorForm['roles'].value;

  // sign up the user
  const auth = getAuth();

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      user = userCredential.user; // Assign user in the broader scope

      // Update user profile with the role
      return updateProfile(user, { displayName: role });
    })
    .then(() => {
      const modal = document.querySelector('#modal-signupdoctor');
      M.Modal.getInstance(modal).close();
      signupdoctorForm.reset();

      // Now that user is defined in the broader scope, send email verification
      return sendEmailVerification(user);
    })
    .then(() => {
      console.log('Email sent');
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert('Email already registered');
      // Handle other error cases here
    });
});






// const signupdoctorForm = document.querySelector('#signupdoctor-form');
// signupdoctorForm.addEventListener('submit', (e) => {
//   e.preventDefault();

//   // get user info
//   const email = signupdoctorForm['signupdoctor-email'].value;
//   const password = signupdoctorForm['signupdoctor-password'].value;
//   const role = signupdoctorForm['roles'].value; 

//   // sign up the user
//   const auth = getAuth();

//   createUserWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       const user = userCredential.user;

//       // Update user profile with the role
//       return updateProfile(user, { displayName: role });
//     })
//     .then(() => {
//       const modal = document.querySelector('#modal-signupdoctor');
//       M.Modal.getInstance(modal).close();
//       signupdoctorForm.reset();
//       return sendEmailVerification(user);
//     })
//     .then(() => {
//       console.log('Email sent');
//     })
//     .catch((error) => {
//       console.log('Error sending email verification:', error);
//     });
// });















// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;
  const role = 'Patient'; // 

  // sign up the user
  const auth = getAuth();

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const modal = document.querySelector('#modal-signup');
  M.Modal.getInstance(modal).close();
  signupForm.reset();

  const auth = getAuth();
sendEmailVerification(auth.currentUser)
.then(() => {
  
console.log("email sent");
return updateProfile(user, { displayName: role })
.then(() => {
  console.log('User profile updated with role:', role);
})
});
})
.catch((error) => {
  const errorCode = error.code;
  const errorMessage = error.message;
  alert("Email already registered");
  // ..
});
});


// // logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
e.preventDefault();
const auth = getAuth();
signOut(auth).then(() => {
  
alert("Logged out");

}).catch((error) => {
  // An error happened.
});
});


const logout1 = document.querySelector('#logout1');
logout1.addEventListener('click', (e) => {
e.preventDefault();
const auth = getAuth();
signOut(auth).then(() => {
  
alert("Logged out");

}).catch((error) => {
  // An error happened.
});
});






// // login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
e.preventDefault();

// get user info
const email = loginForm['login-email'].value;
const password = loginForm['login-password'].value;

// log the user in
const auth = getAuth();
signInWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
  
  const user = userCredential.user;
  if(user.emailVerified){
  // close the signup modal & reset form
  const modal = document.querySelector('#modal-login');
  M.Modal.getInstance(modal).close();
  loginForm.reset();
  alert(email+" Login Successfully");
}})
.catch(error => {
  alert('Authentication failed. Please check your email and password.'); // Show an alert for authentication failure
  const modal = document.querySelector('#modal-login');
  M.Modal.getInstance(modal).close();
  loginForm.reset();
});
});



var resetform = document.querySelector("#reset");
reset.addEventListener("click", (e) => {
  e.preventDefault();
  var email = document.getElementById("resetemail").value; // Get the email value

  const auth = getAuth();
  sendPasswordResetEmail(auth, email)
    .then(() => {
      const modal = document.querySelector('#modal-password');
      M.Modal.getInstance(modal).close();
      // resetform.reset();
      alert("Reset link sent!");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      if (errorCode === "auth/invalid-email") {
        alert("Invalid email address. Please provide a valid email.");
      } else if (errorCode === "auth/user-not-found") {
        alert("Email address not registered.");
      } else {
        alert("Password reset failed. Please try again later.");
        console.error("Firebase Error Code:", errorCode);
        console.error("Firebase Error Message:", errorMessage);
      }
    });
});



