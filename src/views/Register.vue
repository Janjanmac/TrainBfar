<template>
  <div class="auth-container">
    <h2>Register</h2>

    <form @submit.prevent="registerUser">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <input v-model="confirmPassword" type="password" placeholder="Confirm Password" required />

      <button type="submit">Register</button>
    </form>

    <p>Already have an account?
      <router-link to="/login">Login here</router-link>
    </p>

    <p class="error" v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import { ref } from "vue";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";   // ⭐ IMPORT AUTH

export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    const error = ref("");

    const registerUser = async () => {
      error.value = "";

      if (password.value !== confirmPassword.value) {
        error.value = "Passwords do not match!";
        return;
      }

      try {
        await createUserWithEmailAndPassword(auth, email.value, password.value);

        alert("Registration Successful!");

        // pwede mo redirect sa login
        window.location.href = "/login";

      } catch (err) {
        error.value = err.message;
      }
    };

    return { email, password, confirmPassword, registerUser, error };
  }
};
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  background: #f2f2f2;
  border-radius: 10px;
  text-align: center;
}

input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
}

button {
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

.error {
  color: red;
}
</style>
