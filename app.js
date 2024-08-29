import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } 
from "./auth/firebase_Auth.js";

const DisplayFormPage = ()=>{
    let tabLinks = document.querySelectorAll('.header-btn a');
    let tabContent = document.querySelectorAll('.tabContent');

    tabLinks.forEach((tab, index)=>{
        tab.addEventListener('click', ()=>{
            tabContent.forEach((content)=>{
                content.classList.remove('active');
            })
            tabLinks.forEach((tab)=>{
                tab.classList.remove('active');
            })
            tabLinks[index].classList.add('active');
            tabContent[index].classList.add('active');
        })
    })
}
DisplayFormPage();

let signupFormFields = document.querySelectorAll('#signupForm input');
let SingupBtn = document.getElementById('SingupBtn');

const[SignName, SignEmail, SignPass] = signupFormFields;

const Signup = ()=>{
    event.preventDefault();
    if(SignName.value.trim() !== "" && SignEmail.value.trim() !== "" && SignPass.value.trim() !== ""){
        createUserWithEmailAndPassword(auth, SignEmail.value, SignPass.value)
  .then((userCredential) => {
    // Signed up 
    Toastify({
        text: "Signup Successfully",
        duration: 3000
        }).showToast();
    const user = userCredential.user;
    SignName.value = "";
    SignEmail.value = "";
    SignPass.value = "";
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    Toastify({
        text: errorMessage,
        duration: 3000
        }).showToast();
  });
    } 
    else{
        Toastify({
            text: "Please input all Fields",
            duration: 3000
            }).showToast();
    }
}

SingupBtn.addEventListener('click', Signup);


let LoginFormFields = document.querySelectorAll('#LoginForm input');
let loginBtn = document.getElementById('loginBtn');

const[loginEmail, loginPass] = LoginFormFields;

const Login = ()=>{
    event.preventDefault();
    if(loginEmail.value.trim() !== "" && loginPass.value.trim() !==""){
        signInWithEmailAndPassword(auth, loginEmail.value, loginPass.value)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    Toastify({
        text: "Login Successfully",
        duration: 3000
        }).showToast();

        setTimeout(()=>{
            StateChanging();
        }, 2000);
        loginEmail.value = "";
        loginPass.value = "";
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    Toastify({
        text: errorMessage,
        duration: 3000
        }).showToast();
  });
    }
    else{
        Toastify({
            text: "Please input all Fields",
            duration: 3000
            }).showToast();
    }
}

loginBtn.addEventListener('click', Login);


const StateChanging = ()=>{
    onAuthStateChanged(auth, (user) => {
        if (user) {
          const uid = user.uid;
          window.location.href = "./dashboard/dashboard.html";
        }
      });
}