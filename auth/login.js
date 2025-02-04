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
    swal("Please Fill All Fields", "", "error");
    return;
  }

  signInWithEmailAndPassword(auth, email.value, pass.value)
    .then((userCredential) => {
      const user = userCredential.user;
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "You  have successfully logged in",
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        window.location = "../Dashboard/dashbord.html";
      });
    })
    .catch((error) => {
      const errorMessage = error.message;
      Swal.fire({
        title: "",
        text: errorMessage,
        icon: "error",
      });
    });

  email.value = "";
  pass.value = "";
});
