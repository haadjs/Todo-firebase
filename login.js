import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { auth } from "./config.js";

let username = document.querySelector("#name");
let pass = document.querySelector("#password");
let email = document.querySelector("#email");
let subBtn = document.querySelector("#submit");

subBtn.addEventListener("click", () => {
  if (!email.value || !password.value) {
    alert("Please fill the fields");
    return;
  }

  signInWithEmailAndPassword(auth, email.value, pass.value)
    .then((userCredential) => {
      const user = userCredential.user;
      alert("succesfully Loged In");
      window.location = "./dashbord.html";
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });

  email.value = "";
  pass.value = "";
});
