import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { auth, db } from "./config.js";
import {
  collection,
  addDoc,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

let addBtn = document.querySelector(".addBtn");
let userinp = document.querySelector("#userinput");
let tasklist = document.querySelector("#taskList");
// let Alltodo = [];

// User Authentication Check
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log(uid);
  } else {
    window.location = "./login.html";
  }
});

// Logout Function
const logout = document.querySelector(".logout");
logout.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      alert("Logout Successfully");
      window.location = "./login.html";
    })
    .catch(() => {
      alert("Something went wrong");
    });
});

// getdata
let getdatafromfire = async () => {
  const querySnapshot = await getDocs(collection(db, "todos"));
  let Alltodo = []; // Clear previous todos array to avoid duplicates
  querySnapshot.forEach((doc) => {
    Alltodo.push(doc.data());
  });
  tasklist.innerHTML = ""; // Clear task list before adding new data
  Alltodo.forEach((item) => {
    tasklist.innerHTML += `<li>${item.task} <button class="delBtn">Delete</button></li>`;
  });
};

getdatafromfire();

// Add Todo Function
addBtn.addEventListener("click", async (eve) => {
  eve.preventDefault();
  if (!userinp.value.trim()) {
    alert("Please enter a task");
    return;
  }

  try {
    const docRef = await addDoc(collection(db, "todos"), {
      uid: auth.currentUser.uid,
      task: userinp.value,
    });
    userinp.value = ""; // Clear input after adding
    getdatafromfire(); // Fetch updated todos
  } catch (e) {
    console.error("Error adding document: ", e);
  }
});
