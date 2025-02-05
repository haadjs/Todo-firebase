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
  updateDoc ,
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
      swal("", "You Succesfully Log out!", "success");;
     
    }).then(() => {
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
    swal("PLease Enter a Task!");

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
  const delBtns = document.querySelectorAll(".delBtn");

  delBtns.forEach((btn, index) => {
    btn.addEventListener("click", async () => {
      // Confirmation dialog
      const willDelete = await Swal.fire({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this task!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it",
        dangerMode: true,
      });
  
      if (willDelete.isConfirmed) {
        let docID = alltodos[index].docID;
        await deleteDoc(doc(db, "todos", docID));
        alltodos.splice(index, 1);
        
        // Show success message
        await Swal.fire("Deleted!", "Your task has been deleted.", "success");
  
        // Refresh data after deletion
        getDatafirestore();
      }
    });
  });
  

  const updBtns = document.querySelectorAll(".update");
  updBtns.forEach((btn, index) => {
    btn.addEventListener("click", async () => {
      let docId = alltodos[index].docID;
      swal("Write something here:", {
        content: "input",
      })
      .then((value) => {
        swal(`You typed: ${value}`);
      });
      let updateTask = prompt("Change your Task");
      if (!updateTask) {
        return;
      }
      const washingtonRef = doc(db, "todos", docId);
      await updateDoc(washingtonRef, {
        task: updateTask,
      });
      alltodos[index].task = updateTask;
      getDatafirestore();
    });
  });
}
