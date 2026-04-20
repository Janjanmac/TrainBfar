<template>
  <div class="dashboard">

    <h1>Dashboard</h1>

    <button class="logout-btn" @click="logoutUser">
      Logout
    </button>

  </div>
</template>

<script>
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "vue-router";

export default {
  setup() {

    const router = useRouter();

    const logoutUser = async () => {
  try {

    // Firebase sign out
    await signOut(auth);

    // Clear session storage + local storage
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");

    alert("Logged out successfully");

    // Use replace para hindi pwedeng back button
    router.replace("/login");

  } catch (error) {
    console.log(error);
  }
};

    return { logoutUser };

  }
};
</script>

<style scoped>

.dashboard{
text-align:center;
margin-top:50px;
}

.logout-btn{
padding:10px 20px;
background:red;
color:white;
border:none;
cursor:pointer;
border-radius:5px;
}

</style>
