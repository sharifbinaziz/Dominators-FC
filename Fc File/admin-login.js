// Standalone Dominators FC admin login bootstrap.
// Firebase Authentication only: the dashboard module verifies /admins/{uid} access.
import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  setPersistence,
  browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

const config={
  apiKey:"AIzaSyAqnk0d0aFItz03me45sdp-0x_L4MJLa6Y",
  authDomain:"dominatorsfcbd.firebaseapp.com",
  projectId:"dominatorsfcbd",
  storageBucket:"dominatorsfcbd.firebasestorage.app",
  messagingSenderId:"556800750148",
  appId:"1:556800750148:web:61d909a48e66670af60211",
  measurementId:"G-WGW655RPRY"
};

const app=getApps().length?getApp():initializeApp(config);
const auth=getAuth(app);
const provider=new GoogleAuthProvider();
provider.setCustomParameters({prompt:"select_account"});
const $=s=>document.querySelector(s);

function errorText(e){
  const map={
    "auth/invalid-credential":"Incorrect email or password.",
    "auth/invalid-email":"Please enter a valid email address.",
    "auth/user-disabled":"This admin account has been disabled.",
    "auth/too-many-requests":"Too many failed attempts. Please wait a moment and try again.",
    "auth/network-request-failed":"Network error. Check your internet connection and try again.",
    "auth/operation-not-allowed":"This sign-in method is not enabled in Firebase Authentication.",
    "auth/unauthorized-domain":"This website domain is not authorized in Firebase Authentication. Add dominatorsfcbd.web.app under Authentication → Settings → Authorized domains.",
    "auth/popup-blocked":"The Google popup was blocked. Opening Google sign-in in this tab…",
    "auth/popup-closed-by-user":"The Google sign-in window was closed before login finished.",
    "auth/cancelled-popup-request":"Another Google sign-in request is already running.",
    "auth/account-exists-with-different-credential":"This Google email already uses another sign-in method. Use that sign-in method first."
  };
  return map[e?.code]||String(e?.message||"Sign-in failed. Please try again.").replace(/^Firebase:\s*/,'');
}

async function finishRedirect(){
  try{await getRedirectResult(auth)}
  catch(e){console.error("Google redirect result error:",e);const box=$("#loginError");if(box)box.textContent=errorText(e)}
}

async function emailLogin(e){
  e.preventDefault();
  const form=$("#loginForm"),btn=$("#loginBtn"),google=$("#googleLoginBtn"),error=$("#loginError");
  const email=$("#loginEmail").value.trim(),password=$("#loginPassword").value;
  error.textContent="";
  if(!email||!password){error.textContent="Please enter your email and password.";return}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){error.textContent="Please enter a valid email address.";return}
  btn.disabled=true;google.disabled=true;btn.classList.add("loading");
  try{await signInWithEmailAndPassword(auth,email,password)}
  catch(e){console.error("Admin email login error:",e);error.textContent=errorText(e)}
  finally{if(!auth.currentUser){btn.disabled=false;google.disabled=false;btn.classList.remove("loading")}}
}

async function googleLogin(){
  const btn=$("#googleLoginBtn"),emailBtn=$("#loginBtn"),error=$("#loginError");
  if(btn.disabled)return;
  btn.disabled=true;emailBtn.disabled=true;btn.classList.add("loading");error.textContent="";
  try{
    await signInWithPopup(auth,provider);
  }catch(e){
    console.error("Google popup login error:",e);
    if(e?.code==="auth/popup-blocked"||e?.code==="auth/popup-closed-by-user"){
      error.textContent=e?.code==="auth/popup-closed-by-user"?"Opening Google sign-in again…":"Popup blocked. Opening Google sign-in in this tab…";
      try{await signInWithRedirect(auth,provider);return}
      catch(re){console.error("Google redirect login error:",re);error.textContent=errorText(re)}
    }else error.textContent=errorText(e);
  }
  if(!auth.currentUser){btn.disabled=false;emailBtn.disabled=false;btn.classList.remove("loading")}
}

function togglePassword(){
  const p=$("#loginPassword"),b=$("#togglePassword");
  const show=p.type==="password";
  p.type=show?"text":"password";
  b.textContent=show?"◉":"◌";
  b.title=show?"Hide password":"Show password";
  b.setAttribute("aria-label",show?"Hide password":"Show password");
}

async function boot(){
  window.__adminLoginLoaded=true;
  try{await setPersistence(auth,browserSessionPersistence)}catch(e){console.warn("Auth persistence setup failed:",e)}
  $("#loginForm")?.addEventListener("submit",emailLogin);
  $("#googleLoginBtn")?.addEventListener("click",googleLogin);
  $("#togglePassword")?.addEventListener("click",togglePassword);
  await finishRedirect();
}

boot();
