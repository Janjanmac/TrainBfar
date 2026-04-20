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
.login-page{
  min-height:90vh;
  display:flex;
  justify-content:center;
  align-items:center;
  background:linear-gradient(135deg,#7db0fc,#f4f7fb);
  padding:20px;
}

/* CONTAINER */
.login-container{
  width:100%;
  max-width:900px;
  min-height:550px;

  display:flex;
  flex-direction:row;

  border-radius:18px;
  overflow:hidden;

  box-shadow:0 25px 50px rgba(0,0,0,0.2);
  background:rgb(255, 255, 255);
}

/* LEFT */
.login-left{
  width:50%;
  padding:40px;

  display:flex;
  flex-direction:column;
  justify-content:center;
}

/* HEADER */
.header-left {
  text-align:center;
}

.header-left h1{
  font-size:40px;
  color:#0d5c63;
  margin:0;
}

.header-left p{
  font-size:16px;
  color:#777;
}

.header-left h2{
  margin:10px 0;
  font-size:28px;
}

/* SUB */
.subheading .sub{
  font-size:14px;
  color:#777;
}

/* INPUT */
.input-group input{
  width:100%;
  padding:12px;
  margin-bottom:15px;

  border-radius:8px;
  border:1px solid #ddd;

  font-size:14px;
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
}

.login-btn:hover{
  background:#0b4a50;
}

/* LINK BUTTON */
.create-btn{
  display:block;
  text-align:center;

  padding:12px;

  border-radius:8px;
  border:1px solid #0d5c63;

  text-decoration:none;
  color:#0d5c63;

  font-weight:bold;
}

/* RIGHT */
.login-right{
  width:50%;
  position:relative;
  overflow:hidden;
}

.login-right img{
  width:100%;
  height:100%;
  object-fit:cover;
  animation:zoom 20s infinite alternate;
}

.image-overlay{
  position:absolute;
  inset:0;
  background:rgba(0, 0, 0, 0.997);
}

.system-info{
  position:absolute;
  bottom:20px;
  left:20px;
  color:white;
}

.system-info h2{
  font-size:22px;
}

.system-info p{
  font-size:14px;
}

/* ERROR */
.error{
  color:red;
  margin-top:10px;
  font-size:12px;
}

/* ANIMATION */
@keyframes zoom{
  from{ transform:scale(1); }
  to{ transform:scale(1.1); }
}

/* TABLET */
@media (max-width: 900px){
  .login-container{
    flex-direction:column;
  }

  .login-left,
  .login-right{
    width:100%;
  }

  .login-right{
    height:220px;
  }
}

/* MOBILE */
@media (max-width: 500px){

  .login-left{
    padding:20px;
  }

  .header-left h1{
    font-size:28px;
  }

  .header-left h2{
    font-size:22px;
  }

  .input-group input{
    font-size:13px;
    padding:10px;
  }

  .login-btn,
  .create-btn{
    font-size:13px;
    padding:10px;
  }

  .system-info{
    bottom:10px;
    left:10px;
  }

  .system-info h2{
    font-size:18px;
  }

  .system-info p{
    font-size:12px;
  }

}

</style>