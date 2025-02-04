import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { auth } from "../Main/config.js";
  import {
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";


// onAuthStateChanged(auth, (user) => {
//   if (user) {
//   } else {
//     window.location = '/Dashboard/dashbord.html';
//   }
// });


// initialize all variables
let username = document.querySelector("#name");
let pass = document.querySelector("#password");
let email = document.querySelector("#email");
let subBtn = document.querySelector("#submit");


// Sign-up Function
subBtn.addEventListener("click", () => {
  if (!email.value || !password.value) {
    alert("Please fill the fields");
    return;
  }

  signInWithEmailAndPassword(auth, email.value, pass.value)
    .then((userCredential) => {
      const user = userCredential.user;
      alert("succesfully Loged In");
      window.location = "../Dashboard/dashbord.html";
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });

  email.value = "";
  pass.value = "";
});
