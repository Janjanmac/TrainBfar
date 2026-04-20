<template>
  <div class="login-page">

    <div class="login-container">

      <!-- LEFT SIDE -->
      <div class="login-left">

  <div class="header-left">
    <div class="logo">
      <h1>BFAR</h1>
      <p>Fish Warden Information System</p>
    </div>

    <h2>Welcome Back!</h2>

    <!-- Separate subheading -->
    <div class="subheading">
      <span class="sub">Please log in to your account</span>
    </div>
  </div>

        <form @submit.prevent="loginUser">

          <div class="input-group">
            <input
              v-model="email"
              type="email"
              placeholder="Email Address"
              required
            />
          </div>

          <div class="input-group password-box">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="Password"
              required
            />

            <span class="toggle" @click="showPassword = !showPassword">
              {{ showPassword ? "Hide" : "Show" }}
            </span>
          </div>

          <div class="options">
            <label>
              <input type="checkbox" v-model="remember">
              Remember me
            </label>

            <a href="#">Forgot password?</a>
          </div>

          <button class="login-btn">
            Login
          </button>

          <router-link to="/register" class="create-btn">
            Create account
          </router-link>

        </form>

        <p v-if="error" class="error">{{ error }}</p>

      </div>


      <!-- RIGHT SIDE IMAGE -->
      <div class="login-right">

        <div class="image-overlay"></div>

        <img src="../assets/bfar.jpg">

        <div class="system-info">
          <h2>BFAR Monitoring</h2>
          <p>Protecting Fisheries Resources</p>
        </div>

      </div>

    </div>

  </div>
</template>

<script>
import { ref } from "vue"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../firebase"
import { doc, getDoc } from "firebase/firestore"
import { useRouter } from "vue-router"

export default {

setup(){

const email = ref("")
const password = ref("")
const error = ref("")
const showPassword = ref(false)
const remember = ref(false)

const router = useRouter()

const loginUser = async () => {

error.value = ""

try{

const userCredential = await signInWithEmailAndPassword(
auth,
email.value,
password.value
)

const user = userCredential.user

/* GET USER ROLE FROM FIRESTORE */

const docRef = doc(db,"users",user.uid)
const docSnap = await getDoc(docRef)

if(docSnap.exists()){

const userData = docSnap.data()

/* SAVE SESSION */

const session = {
uid: user.uid,
email: user.email,
role: userData.role
}

/* REMEMBER ME */

if(remember.value){
localStorage.setItem("user", JSON.stringify(session))
}else{
sessionStorage.setItem("user", JSON.stringify(session))
}

/* ADMIN LOGIN */

if(userData.role === "admin"){
router.push("/admin-dashboard")
}

/* USER LOGIN */

else if(userData.role === "user"){
router.push("/user-dashboard")
}

/* UNKNOWN ROLE */

else{
error.value = "Access Denied. Unknown role."
}

}

/* USER DATA NOT FOUND */

else{
error.value = "User record not found in database."
}

}

catch(err){

if(err.code === "auth/user-not-found"){
error.value = "User not found."
}

else if(err.code === "auth/wrong-password"){
error.value = "Wrong password."
}

else if(err.code === "auth/invalid-email"){
error.value = "Invalid email format."
}

else{
error.value = err.message
}

}

}

return{
email,
password,
loginUser,
error,
showPassword,
remember
}

}

}
</script>

<style scoped>

/* PAGE */

.login-page{

  height:98vh;
  display:flex;
  justify-content:center;
  align-items:center;

  background:linear-gradient(135deg,#7db0fc,#f4f7fb);

}

/* CONTAINER */

.login-container{

  width:1400px; 
  height:800px;

  display:flex;

  border-radius:18px;
  overflow:hidden;

  box-shadow:0 25px 50px rgba(0,0,0,0.2);

  background:white;

}

/* LEFT PANEL */

.login-left{

  width:50%;
  padding:50px;

  display:flex;
  flex-direction:column;
  justify-content:flex-start;

}

/* HEADER LEFT */
.header-left {
  text-align:center;
  margin-top:0; /* top align */
}

.header-left h1{
  font-size:80px;
  color:#0d5c63;
  margin:0;
}

.header-left p{
  font-size:30px;
  color:#777;
  margin:0;
}

.header-left h2{
  margin:10px 0 10px 0;
  font-size:60px;
}

/* Separate subheading under Welcome Back */
.subheading {
  margin-top:100px;   /* adds space from Welcome Back! */
}

.subheading .sub{
  font-size:30px;
  color:#777;
  display:block;
}

/* INPUT */

.input-group input{

  width:100%;
  padding:12px;
  margin-bottom:15px;

  border-radius:8px;
  border:1px solid #ddd;

  font-size:19px;

}

/* PASSWORD */

.password-box{

  position:relative;

}

.toggle{

  position:absolute;
  right:10px;
  top:50%;
  transform:translateY(-50%);
  font-size:17px;
  cursor:pointer;
  color:#555;

}

/* OPTIONS */

.options{

  display:flex;
  justify-content:space-between;
  font-size:19px;
  margin-bottom:20px;

}

.options a{

  text-decoration:none;
  color:#ff5252;

}

/* BUTTON */

.login-btn{

  width:100%;
  padding:12px;

  background:#0d5c63;
  color:white;

  border:none;
  border-radius:8px;

  font-weight:bold;
  margin-bottom:10px;

  cursor:pointer;
  transition:.3s;
  font-size:20px;

}

.login-btn:hover{

  background:#0b4a50;

}

/* CREATE */

.create-btn{

  display:block;
  text-align:center;

  padding:12px;

  border-radius:8px;
  border:1px solid #0d5c63;

  text-decoration:none;
  color:#0d5c63;

  font-weight:bold;
  font-size:24px;

}

/* RIGHT PANEL */

.login-right{

  width:50%;
  position:relative;
  overflow:hidden;

}

/* IMAGE */

.login-right img{

  width:100%;
  height:100%;
  object-fit:cover;

  animation:zoom 20s infinite alternate;

}

/* IMAGE OVERLAY */

.image-overlay{

  position:absolute;
  inset:0;
  background:rgba(0,0,0,0.3);

  z-index:1;

}

/* SYSTEM TEXT */

.system-info{

  position:absolute;
  bottom:40px;
  left:40px;

  color:white;
  z-index:2;

}

.system-info h2{

  margin:0;
  font-size:35px;

}

.system-info p{

  margin:0;
  font-size:20px;

}

/* ERROR */

.error{

  color:red;
  margin-top:10px;
  font-size:13px;

}

/* ANIMATION */

@keyframes zoom{

  from{
    transform:scale(1);
  }

  to{
    transform:scale(1.1);
  }

}

</style>