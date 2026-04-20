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
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #7db0fc, #f4f7fb);
  padding: 20px;
  box-sizing: border-box;
}

/* CONTAINER */
.login-container {
  width: 100%;
  max-width: 1200px;
  min-height: 640px;
  display: flex;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  background: white;
}

/* LEFT PANEL */
.login-left {
  width: 50%;
  padding: 50px 45px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* HEADER */
.header-left {
  text-align: center;
  margin-bottom: 30px;
}

.header-left h1 {
  font-size: clamp(48px, 5vw, 72px);
  color: #0d5c63;
  margin: 0;
  font-weight: 900;
}

.header-left p {
  font-size: clamp(18px, 2vw, 26px);
  color: #777;
  margin: 5px 0;
}

.header-left h2 {
  margin: 15px 0 10px;
  font-size: clamp(36px, 4vw, 52px);
}

/* SUBHEADING */
.subheading {
  margin-top: 20px;
}

.subheading .sub {
  font-size: clamp(16px, 2vw, 24px);
  color: #777;
}

/* FORM */
form {
  width: 100%;
}

/* INPUT */
.input-group {
  width: 100%;
}

.input-group input {
  width: 100%;
  padding: 14px 16px;
  margin-bottom: 15px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 17px;
  box-sizing: border-box;
}

/* PASSWORD */
.password-box {
  position: relative;
}

.toggle {
  position: absolute;
  right: 15px;
  top: 38%;
  transform: translateY(-50%);
  font-size: 15px;
  cursor: pointer;
  color: #555;
}

/* OPTIONS */
.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  margin-bottom: 20px;
}

.options a {
  text-decoration: none;
  color: #ff5252;
}

/* LOGIN BUTTON */
.login-btn {
  width: 100%;
  padding: 14px;
  background: #0d5c63;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  margin-bottom: 12px;
  cursor: pointer;
  transition: 0.3s;
  font-size: 18px;
}

.login-btn:hover {
  background: #0b4a50;
}

/* CREATE ACCOUNT */
.create-btn {
  display: block;
  text-align: center;
  padding: 14px;
  border-radius: 8px;
  border: 1px solid #0d5c63;
  text-decoration: none;
  color: #0d5c63;
  font-weight: bold;
  font-size: 18px;
}

/* RIGHT PANEL */
.login-right {
  width: 50%;
  position: relative;
  overflow: hidden;
}

/* IMAGE */
.login-right img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* OVERLAY */
.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  z-index: 1;
}

/* SYSTEM TEXT */
.system-info {
  position: absolute;
  bottom: 35px;
  left: 35px;
  color: white;
  z-index: 2;
}

.system-info h2 {
  margin: 0;
  font-size: 30px;
}

.system-info p {
  margin: 5px 0 0;
  font-size: 18px;
}

/* ERROR */
.error {
  color: red;
  margin-top: 10px;
  font-size: 14px;
}

/* LAPTOP SMALL */
@media (max-width: 1024px) {
  .login-container {
    max-width: 950px;
    min-height: 600px;
  }

  .login-left {
    padding: 35px;
  }
}

/* TABLET / MOBILE */
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }

  .login-left,
  .login-right {
    width: 100%;
  }

  .login-right {
    min-height: 280px;
  }
}
</style>