import {  onAuthStateChanged , signOut  } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { auth,db } from "./config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";



onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      console.log(uid);
    } else {
      window.location = './login.html';
    }
  });

    const logout = document.querySelector('.logout');
    logout.addEventListener('click', () => {
        signOut(auth).then(() => {
           alert('Logout Successfully');
           window.location = './login.html';
          }).catch((error) => {
         alert('Something went wrong');
          });
          
    })


    let addBtn =document.querySelector('.addBtn')
    let userinp = document.querySelector('#userinput')

    addBtn.addEventListener('click' , async (eve) =>{
      eve.preventDefault();
      console.log(userinp.value);
      console.log(auth.currentUser.uid);
      
      try {
        const docRef = await addDoc(collection(db, "todos"), {
          uid: auth.currentUser.uid,
          task: userinp.value,
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      
    })