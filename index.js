const loggedOutLinks = document.querySelectorAll('.log-out');
const loggedInLinks = document.querySelectorAll('.log-in');
const loggeddoctor=document.querySelectorAll('.log-doctor')

const setupUI = (user, emailVerified,doctor) => {
    if (user) {
      if (emailVerified) {
        
        if(doctor)
        {
          loggedInLinks.forEach(item => item.style.display = 'none');
          loggeddoctor.forEach(item=> item.style.display='block');
          loggedOutLinks.forEach(item => item.style.display = 'none');
        }
        else{
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');
        loggeddoctor.forEach(item=> item.style.display='none');
        }
      } else {
        // User is logged in, but email is not verified
        loggedInLinks.forEach(item => item.style.display = 'none');
        loggedOutLinks.forEach(item => item.style.display = 'block');
        loggeddoctor.forEach(item=> item.style.display='none');
      }
    } else {
      // User is logged out
      loggedInLinks.forEach(item => item.style.display = 'none');
      loggedOutLinks.forEach(item => item.style.display = 'block');
      loggeddoctor.forEach(item=> item.style.display='none');
    }
  };
  




// setup materialize components

document.addEventListener('DOMContentLoaded', function() {

    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
  
    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);
  
  });