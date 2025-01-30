import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  isSignInWithEmailLink, 
  signInWithEmailLink 
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

import { auth } from "./config.js";

let username = document.querySelector('#name');
let pass = document.querySelector('#password');
let email = document.querySelector('#email');
let subBtn = document.querySelector('#submit');

// ✅ Sign-up Function
subBtn.addEventListener('click', () => {
  if (!email.value || !pass.value) {
      alert('Please fill all fields');
      return;
  }

  createUserWithEmailAndPassword(auth, email.value, pass.value)
      .then((userCredential) => {
          const user = userCredential.user;
          alert(' A verification email has been sent.Please verify your email before logging in.');

    
          return sendEmailVerification(user).then(() => user);
      })
      .then((user) => {
          // ✅ Check if email is verified before allowing login
          let checkVerification = setInterval(() => {
              user.reload().then(() => {
                  if (user.emailVerified) {
                      clearInterval(checkVerification);
                      alert('Email verified! Now you can log in.');
                      window.location = './login.html';
                  }
              });
          }, 3000); // Check every 3 seconds
      })
      .catch((error) => {
          alert(error.message);
      });

  email.value = '';
  pass.value = '';
});

// ✅ Email Link Sign-in Handling
window.addEventListener('DOMContentLoaded', () => {
  if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
          email = window.prompt('Please provide your email for confirmation');
      }

      signInWithEmailLink(auth, email, window.location.href)
          .then((result) => {
              window.localStorage.removeItem('emailForSignIn');
              alert("Successfully signed in with email link!");
              window.location = './dashboard.html'; // Redirect to dashboard
          })
          .catch((error) => {
              alert("Error signing in: " + error.message);
          });
  }
});
