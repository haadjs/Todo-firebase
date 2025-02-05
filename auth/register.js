import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

import { auth, provider } from "../Main/config.js";

let username = document.querySelector("#name");
let pass = document.querySelector("#password");
let email = document.querySelector("#email");
let subBtn = document.querySelector("#submit");

//  Sign-up Function
subBtn.addEventListener("click", () => {
  if (!email.value || !pass.value) {
    swal("Please Fill All Fields", "", "error");
    return;
  }

  createUserWithEmailAndPassword(auth, email.value, pass.value)
    .then((userCredential) => {
      const user = userCredential.user;
      swal( "Your Email Verification is Send \n Check your Email after you log In ",);

      return sendEmailVerification(user).then(() => user);
    })
    .then((user) => {
      let checkVerification = setInterval(() => {
        user.reload().then(() => {
          if (user.emailVerified) {
            clearInterval(checkVerification);
            swal("Good job!", "Email Verifired! Now you Log In", "success");
            window.location = "../auth/login.html";
          }
        });
      }, 2000);
    })
    .catch((error) => { 
      swal( error.message, "error" );
    });

  email.value = "";
  pass.value = "";
});

let loggoogle = document.querySelector(".loginbtn");

loggoogle.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      window.location = "../Dashboard/dashbord.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
    });
});
