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

          <h2>Create Account</h2>

          <div class="subheading">
            <span class="sub">Register to get started</span>
          </div>
        </div>

        <form @submit.prevent="registerUser">

          <!-- EMAIL -->
          <div class="input-group">
            <input
              v-model="email"
              type="email"
              placeholder="Email Address"
              required
            />
          </div>

          <!-- PASSWORD -->
          <div class="input-group">
            <input
              v-model="password"
              type="password"
              placeholder="Password"
              required
            />
          </div>

          <!-- CONFIRM PASSWORD -->
          <div class="input-group">
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              required
            />
          </div>

          <button class="login-btn">
            Register
          </button>

          <router-link to="/login" class="create-btn">
            Already have an account
          </router-link>

        </form>

        <p v-if="error" class="error">{{ error }}</p>

      </div>

      <!-- RIGHT SIDE IMAGE -->
      <div class="login-right">

        <div class="image-overlay"></div>

        <img src="../assets/bfar.jpg" />

        <div class="system-info">
          <h2>BFAR Monitoring</h2>
          <p>Protecting Fisheries Resources</p>
        </div>

      </div>

    </div>

  </div>
</template>

<script>
import { ref } from "vue";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "vue-router";

export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    const error = ref("");

    const router = useRouter();

    const registerUser = async () => {
      error.value = "";

      if (password.value !== confirmPassword.value) {
        error.value = "Passwords do not match!";
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email.value,
          password.value
        );

        const user = userCredential.user;

        /* 🔥 SAVE USER ROLE SA FIRESTORE */
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          role: "user" // default role
        });

        alert("Registration Successful!");
        router.push("/login");

      } catch (err) {
        error.value = err.message;
      }
    };

    return {
      email,
      password,
      confirmPassword,
      registerUser,
      error
    };
  }
};
</script>

<style scoped>
/* PAGE */
.login-page {
  min-height: 90vh;
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

/* REGISTER BUTTON */
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

/* LOGIN LINK BUTTON */
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

/* SYSTEM INFO */
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