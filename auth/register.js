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

// ✅ Sign-up Function
subBtn.addEventListener("click", () => {
  if (!email.value || !pass.value) {
    swal("Please Fill All Fields", "", "error");
    return;
  }

  createUserWithEmailAndPassword(auth, email.value, pass.value)
    .then((userCredential) => {
      const user = userCredential.user;
      alert(
        " A verification email has been sent.Please verify your email before logging in."
      );

      return sendEmailVerification(user).then(() => user);
    })
    .then((user) => {
      // ✅ Check if email is verified before allowing login
      let checkVerification = setInterval(() => {
        user.reload().then(() => {
          if (user.emailVerified) {
            clearInterval(checkVerification);
            alert("Email verified! Now you can log in.");
            window.location = "../auth/login.html";
          }
        });
      }, 2000); // Check every 3 seconds
    })
    .catch((error) => {
      alert(error.message);
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
