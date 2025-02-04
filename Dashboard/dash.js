import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { auth, db } from "../Main/config.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// User check
onAuthStateChanged(auth, (user) => {
  if (user) {
    getDatafirestore();
  } else {
    window.location = "../auth/login.html";
  }
});

let logBtn = document.querySelector(".logout");
let userinp = document.querySelector("#userinput");
let tasklist = document.querySelector("#taskList");
let addBtn = document.querySelector(".addBtn");

// Logout Function
logBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      alert("Logout successfully");
      window.location = "../auth/login.html";
    })
    .catch((error) => {
      alert(error.message);
    });
});

// Add Data to Firestore
addBtn.addEventListener("click", async (evt) => {
  evt.preventDefault();
  if (!userinp.value) {
    alert("Please enter a task");
    return;
  }

  try {
    const docRef = await addDoc(collection(db, "todos"), {
      userUid: auth.currentUser.uid,
      task: userinp.value,
      timestamp: new Date(),
    });
    userinp.value = "";
    console.log("Document written with ID: ", docRef.id);
    getDatafirestore();
  } catch (e) {
    console.error("Error adding document: ", e);
  }
});

let alltodos = [];
// Fetch Data from Firestore
let getDatafirestore = async () => {
  alltodos.length = 0 ;
  const q = query(
    collection(db, "todos"),
    where("userUid", "==", auth.currentUser.uid)
  );
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    alltodos.unshift({ ...doc.data(), docID: doc.id });
  });
  tasklist.innerHTML = ""; // Clear task list
  alltodos.forEach((item) => {
    tasklist.innerHTML += `
      <li>${item.task}
      <span>
        <button class="delBtn" >Delete</button>
        <button class="update">Update</button>
      </span>
      </li>
    `;
  });
};

