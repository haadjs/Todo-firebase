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
  updateDoc,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Logout Button Fix
let logBtn = document.querySelector(".logout-btn");
let userinp = document.querySelector("#userinput");
let tasklist = document.querySelector("#taskList");
let addBtn = document.querySelector(".addBtn");

// Fetch Data from Firestore
let alltodos = [];

let getDatafirestore = async () => {
  alltodos.length = 0;
  const q = query(
    collection(db, "todos"),
    where("userUid", "==", auth.currentUser.uid)
  );
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    alltodos.unshift({ ...doc.data(), docID: doc.id });
  });

  tasklist.innerHTML = ""; // Clear task list
  alltodos.forEach((item, index) => {
    tasklist.innerHTML += `
      <li>${item.task}
      <span>
        <button class="delBtn" data-id="${index}">Delete</button>
        <button class="update" data-id="${index}">Update</button>
      </span>
      </li>
    `;
  });

  // Delete Task
  document.querySelectorAll(".delBtn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const index = e.target.getAttribute("data-id");
      const docID = alltodos[index].docID;

      const willDelete = await Swal.fire({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this task!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it",
      });

      if (willDelete.isConfirmed) {
        await deleteDoc(doc(db, "todos", docID));
        await Swal.fire("Deleted!", "Your task has been deleted.", "success");
        getDatafirestore();
      }
    });
  });

  // Update Task
  document.querySelectorAll(".update").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const index = e.target.getAttribute("data-id");
      const docID = alltodos[index].docID;
      let updateTask = prompt("Change your Task");

      if (!updateTask) return;

      await updateDoc(doc(db, "todos", docID), { task: updateTask });
      getDatafirestore();
    });
  });
};

// Check User Authentication
onAuthStateChanged(auth, (user) => {
  if (user) {
    getDatafirestore();
  } else {
    window.location = "../auth/login.html";
  }
});

// Logout Function
logBtn.addEventListener("click", () => {
  signOut(auth)
    alert("You have been logged out")
    .then(() => {
      window.location = "../auth/login.html";
    })
    .catch((error) => alert(error.message));
});

// Add Task
addBtn.addEventListener("click", async (evt) => {
  evt.preventDefault();
  if (!userinp.value) {
    Swal.fire("Please Enter a Task!");
    return;
  }

  try {
    await addDoc(collection(db, "todos"), {
      userUid: auth.currentUser.uid,
      task: userinp.value,
      timestamp: new Date(),
    });
    userinp.value = "";
    getDatafirestore();
  } catch (e) {
    console.error("Error adding document: ", e);
  }
});
