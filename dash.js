// import {
//   onAuthStateChanged,
//   signOut,
// } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
// import { auth, db } from "./config.js";
// import {
//   collection,
//   addDoc,
//   getDocs,
//   query,
//   where,
// } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// let addBtn = document.querySelector(".addBtn");
// let userinp = document.querySelector("#userinput");
// let tasklist = document.querySelector("#taskList");
// // let Alltodo = [];

// // User Authentication Check
// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     const uid = user.uid;
//     console.log(uid);
//     getdatafromfire(user)
//   } else {
//     window.location = "./login.html";
//   }
// });

// // Logout Function
// const logout = document.querySelector(".logout");
// logout.addEventListener("click", () => {
//   signOut(auth)
//     .then(() => {
//       alert("Logout Successfully");
//       window.location = "./login.html";
//     })
//     .catch(() => {
//       alert("Something went wrong");
//     });
// });

// // getdata
// let getdatafromfire = async (user) => {
//   if (!user) {
//     console.error("User not logged in");
//     return;
//   }

//   try {
//     const q = query(
//       collection(db, "todos"),
//       where("uid", "==", user.uid)
//     );

//     const querySnapshot = await getDocs(q);
//     const todos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
//     console.log("User Todos:", todos);

//   } catch (error) {
//     console.error("Error fetching todos:", error);
//   }
// };// getdatafromfire();

// // Add Todo Function
// addBtn.addEventListener("click", async (eve) => {
//   eve.preventDefault();
//   if (!userinp.value.trim()) {
//     alert("Please enter a task");
//     return;
//   }

//   try {
//     const docRef = await addDoc(collection(db, "todos"), {
//       uid: auth.currentUser.uid,
//       task: userinp.value,
//       Timestamp : new Date()
//     });
//     userinp.value = ""; 
//     getdatafromfire(user);  
//   } catch (e) {
//     console.error("Error adding document: ", e);
//   }
// });



import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { auth, db } from "./config.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

let addBtn = document.querySelector(".addBtn");
let userinp = document.querySelector("#userinput");
let tasklist = document.querySelector("#taskList");

// User Authentication Check
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User ID:", user.uid);
    getdatafromfire(user); // ✅ User ko pass karo taake function me error na aaye
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

// ✅ Get data only when user is logged in
let getdatafromfire = async (user) => {
  if (!user) {
    console.error("User not logged in");
    return;
  }
 let allTodos = []
  try {
    const q = query(
      collection(db, "todos"),
      where("uid", "==", user.uid) // ✅ Corrected field name
    );

    const querySnapshot = await getDocs(q);
    const todos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // ✅ Show data in console
    console.log("User Todos:", todos);
    const gettodo = allTodos.push(...todos)
    console.log(gettodo);
  tasklist.innerHTML = ''
    allTodos.forEach((item) =>{
      tasklist.innerHTML += `<li>${item.task}</li>`
    })
    
    

  } catch (error) {
    console.error("Error fetching todos:", error);
  }
};

// Add Todo Function
addBtn.addEventListener("click", async (eve) => {
  eve.preventDefault();
  if (!userinp.value.trim()) {
    alert("Please enter a task");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("User not logged in!");
    return;
  }

  try {
    await addDoc(collection(db, "todos"), {
      uid: user.uid, // ✅ Use user.uid safely
      task: userinp.value,
      Timestamp: new Date()
    });

    userinp.value = ""; 
    getdatafromfire(user); // ✅ Call function with user data
  } catch (e) {
    console.error("Error adding document: ", e);
  }
});
