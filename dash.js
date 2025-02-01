import { onAuthStateChanged , signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { auth, db } from "./config.js";
import { collection, addDoc, getDocs , deleteDoc  } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js"; 
// User check
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;

  } else {
   window.location = './login.html'
  }
});

let logBtn = document.querySelector('.logout')
let userinp = document.querySelector('#userinput')
let tasklist = document.querySelector('#taskList')
let addBtn = document.querySelector('.addBtn')

// Logout Function
logBtn.addEventListener('click' , () => {
  signOut(auth).then(() => {
    alert('logout successfully')
    window.location = './login.html'
  }).catch((error) => {
    alert(error)
  });
})



// set data Function
addBtn.addEventListener('click' , async (evt) =>{
  evt.preventDefault()
  if (!userinp.value ){
    alert('Please enter a task')
    return; 
  }

  try {
    const docRef = await addDoc(collection(db, "todos"), {
      userUid: auth.currentUser.uid,
      task:userinp.value,
     Timestamp: new Date(),
    });
    userinp.value = ''
    console.log("Document written with ID: ", docRef.id);
getDatafirestore()
  } catch (e) {
    console.error("Error adding document: ", e);
  }


})


// get data Function
let getDatafirestore = async () =>{
  let alltodos = [];
  const querySnapshot = await getDocs(collection(db, "todos"));
  querySnapshot.forEach((doc) => {
  alltodos.unshift(doc.data());
});
tasklist.innerHTML = ''
  alltodos.forEach((item) =>{
    tasklist.innerHTML += ` 
         <li>
          ${item.task}
          <span>
            <button class="delBtn">Delete</button>
          </span>
        </li> `;
  })
}
getDatafirestore()

// delete data Function
let delBtn = document.querySelector('.delBtn')

delBtn.addEventListener('click', async () =>{
  await deleteDoc(doc(db, "todos", userUid));

})

