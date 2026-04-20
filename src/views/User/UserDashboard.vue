<template>
  <div class="page">

    <!-- HEADER -->
    <div class="header">
      <div class="header-content">
        <img src="@/assets/bfar-header.png" class="header-image" />
        <div class="user-info">
          <span class="welcome-text">Welcome, {{ userEmail }}</span>
          <button @click="logout" class="logout-btn">Logout</button>
        </div>
      </div>
    </div>

    <!-- TITLE -->
    <div class="title-section">
      <h1>Fish Warden Public Search</h1>
      <p>MIMAROPA Region</p>
    </div>

    <!-- DASHBOARD -->
    <div class="dashboard">

      <div class="card">

        <h2>Select Location</h2>

        <!-- YEAR -->
        <label>Fiscal Year</label>
        <select v-model="selectedYear">
          <option value="">Select Year</option>
          <option v-for="year in years" :key="year">
            {{ year }}
          </option>
        </select>

        <!-- PROVINCE -->
        <label>Province</label>
        <select v-model="selectedProvince" @change="filterMunicipalities">
          <option value="">Select Province</option>
          <option v-for="province in provinces" :key="province">
            {{ province }}
          </option>
        </select>

        <!-- MUNICIPALITY -->
        <label>Municipality</label>
        <select v-model="selectedMunicipality">
          <option value="">Select Municipality</option>
          <option v-for="mun in filteredMunicipalities" :key="mun">
            {{ mun }}
          </option>
        </select>

        <!-- BUTTON -->
        <button
          @click="enterDashboard"
          :disabled="!selectedYear || !selectedProvince || !selectedMunicipality"
        >
          View Fish Wardens
        </button>

      </div>

    </div>

  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'

export default {

setup(){
const router = useRouter()
const userEmail = ref('')
const sessionTimeout = ref(null)

// Check session on component mount
onMounted(() => {
  checkSession()
  startSessionTimeout()
})

const checkSession = () => {
  const session = sessionStorage.getItem('user') || localStorage.getItem('user')
  
  if (!session) {
    router.push('/login')
    return
  }
  
  try {
    const userData = JSON.parse(session)
    
    // Check if user has correct role
    if (userData.role !== 'user') {
      router.push('/login')
      return
    }
    
    userEmail.value = userData.email || 'User'
    
  } catch (error) {
    console.error('Invalid session data:', error)
    logout()
  }
}

const startSessionTimeout = () => {
  // Auto logout after 30 minutes of inactivity
  sessionTimeout.value = setTimeout(() => {
    alert('Session expired due to inactivity. Please login again.')
    logout()
  }, 30 * 60 * 1000) // 30 minutes
}

const resetSessionTimeout = () => {
  if (sessionTimeout.value) {
    clearTimeout(sessionTimeout.value)
    startSessionTimeout()
  }
}

const logout = () => {
  // Clear session storage
  sessionStorage.removeItem('user')
  localStorage.removeItem('user')
  
  // Clear timeout
  if (sessionTimeout.value) {
    clearTimeout(sessionTimeout.value)
  }
  
  // Redirect to login
  router.push('/login')
}

// Listen for user activity to reset timeout
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', resetSessionTimeout)
  window.addEventListener('keypress', resetSessionTimeout)
  window.addEventListener('click', resetSessionTimeout)
  window.addEventListener('scroll', resetSessionTimeout)
}

return{
  logout,
  userEmail,
  checkSession
}
},

data(){
return{

years:[
"2023",
"2024",
"2025",
"2026",
"2027",
"2028",
"2029",
"2030"
],

provinces:[
"Occidental Mindoro",
"Oriental Mindoro",
"Marinduque",
"Romblon",
"Palawan"
],

municipalities:{

"Occidental Mindoro":[
"Mamburao","Sablayan","San Jose","Looc","Calintaan",
"Abra de Ilog","Lubang","Magsaysay","Paluan","Rizal","Sta. Cruz"
],

"Oriental Mindoro":[
"Calapan City","Baco","San Teodoro","Puerto Galera",
"Naujan","Victoria","Pola","Socorro","Pinamalayan",
"Gloria","Bansud","Bongabong","Roxas","Mansalay","Bulalacao"
],

"Marinduque":[
"Boac","Mogpog","Gasan","Torrijos","Buenavista","Santa Cruz"
],

"Romblon":[
"Romblon","Odiongan","San Jose","Ferrol","Alcantara",
"Banton","Cajidiocan","Calatrava","Concepcion","Corcuera",
"Looc","Magdiwang","San Agustin","San Andres",
"San Fernando","Santa Fe","Santa Maria"
],

"Palawan":[
"Puerto Princesa","El Nido","Coron","Aborlan","Agutaya",
"Araceli","Balabac","Bataraza","Brooke's Point",
"Busuanga","Cagayancillo","Culion","Cuyo","Dumaran",
"Kalayaan","Linapacan","Magsaysay","Narra","Quezon",
"Rizal","Roxas","San Vicente","Sofronio Española","Taytay"
]

},

selectedYear:"",
selectedProvince:"",
selectedMunicipality:"",
filteredMunicipalities:[]

}
},

methods:{

filterMunicipalities(){

if(this.selectedProvince){

this.filteredMunicipalities =
this.municipalities[this.selectedProvince]

this.selectedMunicipality=""

}else{

this.filteredMunicipalities=[]

}

},

enterDashboard(){

// Validate session before navigation
const session = sessionStorage.getItem('user') || localStorage.getItem('user')
if (!session) {
  this.$router.push('/login')
  return
}

if(!this.selectedYear || !this.selectedProvince || !this.selectedMunicipality){

alert("Please select Year, Province and Municipality")
return

}

let routeName=""

if(this.selectedYear==="2023"){
routeName="UserDFWDashboard"
}
else if(this.selectedYear==="2024"){
routeName="UserDFW2024"
}
else if(this.selectedYear==="2025"){
routeName="UserDFW2025"
}
else if(this.selectedYear==="2026"){
routeName="UserDFW2026"
}
else if(this.selectedYear==="2027"){
routeName="UserDFW2027"
}
else if(this.selectedYear==="2028"){
routeName="UserDFW2028"
}
else if(this.selectedYear==="2029"){
routeName="UserDFW2029"
}
else if(this.selectedYear==="2030"){
routeName="UserDFW2030"
}

this.$router.push({
name:routeName,
query:{
year:this.selectedYear,
province:this.selectedProvince,
municipality:this.selectedMunicipality
}
})

}

}

}
</script>

<style scoped>
.page {
  min-height: 80vh;
  background: linear-gradient(135deg, #d8e7ff, #eff6ff);
  padding-bottom: 30px;
}

/* HEADER */
.header {
  width: 100%;
  background: linear-gradient(135deg, #5c9bfa, #f4f7fb);
}

.header-content {
  position: relative;
  width: 100%;
}

.header-image {
  width: 100%;
  max-height: 290px;
  object-fit: contain;
  display: block;
}

.user-info {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.95);
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.welcome-text {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.logout-btn {
  padding: 8px 16px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.logout-btn:hover {
  background: #c82333;
}

/* TITLE */
.title-section {
  text-align: center;
  margin-top: 20px;
  padding: 0 15px;
}

.title-section h1 {
  font-size: clamp(28px, 5vw, 50px);
  font-weight: 900;
  margin: 0;
}

.title-section p {
  font-size: clamp(18px, 3vw, 30px);
  color: #444;
  margin-top: 8px;
}

/* DASHBOARD */
.dashboard {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  margin-top: 30px;
}

/* CARD */
.card {
  width: 100%;
  max-width: 420px;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

/* FORM */
label {
  display: block;
  margin-top: 12px;
  font-weight: bold;
  font-size: clamp(16px, 2vw, 25px);
}

select {
  width: 100%;
  padding: 12px;
  margin-top: 5px;
  margin-bottom: 15px;
  font-size: clamp(14px, 2vw, 19px);
  border-radius: 6px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 14px;
  border: none;
  background: #5ca5ff;
  color: white;
  font-size: clamp(16px, 2vw, 25px);
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s ease;
}

button:hover {
  background: #084a9a;
}

button:disabled {
  background: #aaa;
  cursor: not-allowed;
}

/* TABLET */
@media (max-width: 768px) {
  .header-image {
    max-height: 220px;
  }

  .card {
    padding: 25px;
  }
}

/* MOBILE */
@media (max-width: 480px) {
  .header-image {
    max-height: 160px;
  }

  .user-info {
    position: static;
    margin: 10px;
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .welcome-text {
    text-align: center;
    font-size: 14px;
  }

  .logout-btn {
    width: 100%;
  }

  .title-section {
    margin-top: 15px;
  }

  .dashboard {
    padding: 15px;
    margin-top: 20px;
  }

  .card {
    padding: 20px;
    border-radius: 10px;
  }

  select,
  button {
    padding: 12px;
  }
}
</style>