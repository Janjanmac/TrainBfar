<template>
  <div class="page-container">

    <!-- SIDEBAR -->
    <div :class="['sidebar', { open: sidebarOpen }]">
      <h2 class="sidebar-title">Menu</h2>
      <ul>
        <router-link to="/2024">Masterlist</router-link>
        <li><router-link to="/DFWArchiveDashboard">DFW Archive</router-link></li>
        <li><router-link to="/Dashboard">Back</router-link></li>
         <li><router-link to="/login">Logout</router-link></li>
      </ul>
    </div>

    <!-- MAIN PAGE -->
    <div :class="['page', { shifted: sidebarOpen }]">

      <!-- HEADER -->
      <div class="top-header">
        <button class="hamburger-btn" @click="toggleSidebar">&#9776;</button>
        <h1 class="header-title">LIST OF DEPUTIZED FISH WARDEN (2023)</h1>
      </div>

      <!-- TOGGLE BUTTON -->
      <div class="form-toggle">
        <button class="toggle-btn" @click="showForm = !showForm">
          {{ showForm ? "Hide Form ▲" : "Add New Record ▼" }}
        </button>
      </div>

      <!-- ADD / EDIT FORM -->
      <div v-show="showForm" class="card form">
        <input v-model="form.province" placeholder="Province" @input="form.province = form.province.toUpperCase()" />
        <input v-model="form.municipality" placeholder="Municipality" @input="form.municipality = form.municipality.toUpperCase()" />
        <input v-model="form.idNo" placeholder="ID No" @input="form.idNo = form.idNo.toUpperCase()" />
        <input v-model="form.lastName" placeholder="Last Name" @input="form.lastName = form.lastName.toUpperCase()" />
        <input v-model="form.firstName" placeholder="First Name" @input="form.firstName = form.firstName.toUpperCase()" />
        <input v-model="form.middleName" placeholder="Middle Name" @input="form.middleName = form.middleName.toUpperCase()" />
        <input v-model="form.sex" placeholder="Sex" @input="form.sex = form.sex.toUpperCase()" />
        <input v-model="form.issuanceDate" type="text" placeholder="Issuance Date" />
        <input v-model="form.expirationDate" type="text" placeholder="Expiration Date" />
        <input v-model="form.status" placeholder="Status" @input="form.status = form.status.toUpperCase()" />

        <div class="form-buttons">
          <button @click="saveRecord">
            {{ editIndex === null ? "Add Record" : "Update Record" }}
          </button>
        </div>
      </div>

      <!-- PROVINCE LOOP -->
      <div v-for="(municipalities, province) in groupedData" :key="province" class="province">
        <h2 class="province-title">{{ province }}</h2>

        <div v-if="Object.keys(municipalities).length === 0" class="empty">
          No records yet
        </div>

        <div v-else v-for="(rows, municipality) in municipalities" :key="municipality" class="card record-card">
          <h3 class="municipality-title">{{ municipality }}</h3>

          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>ID No</th>
                <th>Last Name</th>
                <th>First Name</th>
                <th>Middle Name</th>
                <th>Sex</th>
                <th>Issuance Date</th>
                <th>Expiration Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(r,index) in rows" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ r.idNo }}</td>
                <td>{{ r.lastName }}</td>
                <td>{{ r.firstName }}</td>
                <td>{{ r.middleName }}</td>
                <td>{{ r.sex }}</td>
                <td>{{ r.issuanceDate }}</td>
                <td>{{ r.expirationDate }}</td>
                <td>{{ r.status }}</td>
                <td>
                  <button @click="editRecord(r)">Edit</button>
                  <button @click="archiveRecord(r)">Archive</button>
                </td>
              </tr>
            </tbody>

          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { db } from "@/firebase"
import { collection, addDoc, getDocs, doc, deleteDoc, setDoc } from "firebase/firestore"

const route = useRoute()
const router = useRouter()

const sidebarOpen = ref(false)
const showForm = ref(false)

const toggleSidebar = () => sidebarOpen.value = !sidebarOpen.value

/* 🔐 SESSION CHECK */
function checkSession(){

  const user = JSON.parse(
    sessionStorage.getItem("user") ||
    localStorage.getItem("user")
  )

  if(!user){
    router.replace("/login")
    return false
  }

  if(user.role !== "admin"){
    router.replace("/login")
    return false
  }

  return true
}

/* 🔐 LOGOUT */
function logout(){

  sessionStorage.clear()
  localStorage.clear()

  router.replace("/login")

}

const selectedProvince = ref(route.query.province || "")
const selectedMunicipality = ref(route.query.municipality || "")

const STORAGE_KEY = "main-dashboard-dfw-records"
const records = ref([])
const editIndex = ref(null)

const form = ref({
  province:"",
  municipality:"",
  idNo:"",
  lastName:"",
  firstName:"",
  middleName:"",
  sex:"",
  issuanceDate:"",
  expirationDate:"",
  status:""
})

/* LOAD DATA */
onMounted(async()=>{

  /* 🔐 PREVENT BACK BUTTON */
  window.history.pushState(null,null,window.location.href)
  window.onpopstate = function(){
    window.history.pushState(null,null,window.location.href)
  }

  if(!checkSession()) return

  const snap = await getDocs(collection(db,"dfwRecords"))

  if(!snap.empty){
    records.value = snap.docs.map(d=>({
      ...d.data(),
      firebaseId:d.id
    }))
    localStorage.setItem(STORAGE_KEY,JSON.stringify(records.value))
  }else{
    const saved = localStorage.getItem(STORAGE_KEY)
    if(saved) records.value = JSON.parse(saved)
  }

  if(route.query.province)
    selectedProvince.value = route.query.province.toUpperCase()

  if(route.query.municipality)
    selectedMunicipality.value = route.query.municipality.toUpperCase()

})

watch(records,val=>{
  localStorage.setItem(STORAGE_KEY,JSON.stringify(val))
},{deep:true})

/* SAVE RECORD */
async function saveRecord(){

  const newRecord = {}

  Object.keys(form.value).forEach(k=>{
    newRecord[k] =
      typeof form.value[k]==="string"
      ? form.value[k].toUpperCase()
      : form.value[k]
  })

  if(editIndex.value !== null){

    const existing = records.value[editIndex.value]

    if(existing.firebaseId){
      await setDoc(doc(db,"dfwRecords",existing.firebaseId), newRecord)
    }

    records.value[editIndex.value] = {
      ...newRecord,
      firebaseId: existing.firebaseId
    }

    editIndex.value = null

  }else{

    const docRef = await addDoc(collection(db,"dfwRecords"), newRecord)

    newRecord.firebaseId = docRef.id

    records.value.push(newRecord)

  }

  resetForm()

}

/* GROUP DATA */
const groupedData = computed(()=>{

  const g = {}

  const filtered = records.value.filter(r=>{

    if(!selectedProvince.value && !selectedMunicipality.value)
      return true

    return(
      (!selectedProvince.value || r.province === selectedProvince.value) &&
      (!selectedMunicipality.value || r.municipality === selectedMunicipality.value)
    )

  })

  filtered.forEach(r=>{

    if(!g[r.province]) g[r.province] = {}

    if(!g[r.province][r.municipality])
      g[r.province][r.municipality] = []

    g[r.province][r.municipality].push(r)

  })

  const sorted = {}

  Object.keys(g)
  .sort((a,b)=>a.localeCompare(b))
  .forEach(prov=>{

    const muni = g[prov]

    sorted[prov] = Object.keys(muni)
      .sort((a,b)=>a.localeCompare(b))
      .reduce((acc,m)=>{

        acc[m] = muni[m]
          .slice()
          .sort((a,b)=>a.lastName.localeCompare(b.lastName))

        return acc

      },{})

  })

  return sorted

})

/* EDIT */
function editRecord(row){

  editIndex.value = records.value.indexOf(row)

  form.value = {...row}

  showForm.value = true

}

/* ARCHIVE */
async function archiveRecord(row){

  const { firebaseId, ...data } = row

  await addDoc(collection(db,"dfwArchivedRecords"), data)

  if(firebaseId)
    await deleteDoc(doc(db,"dfwRecords",firebaseId))

  const i = records.value.indexOf(row)

  if(i>-1) records.value.splice(i,1)

}

/* RESET */
function resetForm(){

  form.value = {
    province:"",
    municipality:"",
    idNo:"",
    lastName:"",
    firstName:"",
    middleName:"",
    sex:"",
    issuanceDate:"",
    expirationDate:"",
    status:""
  }

}
</script>

<style scoped>
.page-container{
display:flex;
font-family:Arial, Helvetica, sans-serif;
}

.sidebar{
position:fixed;
top:0;
left:-250px;
width:250px;
height:100vh;
background:#ffffff;
padding:20px;
transition:left .3s;
}

.sidebar.open{ left:0; }

.sidebar-title{ font-size:22px; margin-bottom:20px; }
.sidebar ul{ list-style:none; padding:0; }
.sidebar li{ margin:15px 0; }
.sidebar a{ text-decoration:none; font-size:25px; color:black; }

.page{ flex:1; padding:35px; transition:margin-left .3s; }
.page.shifted{ margin-left:250px; }

.top-header{

display:flex; 
align-items:center; 
background:#114a86; 
color:white; 
padding:22px; 
border-radius:12px; 
position:relative;

}

.header-title{

position:absolute; 
left:50%; 
transform:translateX(-50%); 
font-size:48px; 
font-weight:700;

}

.hamburger-btn{

font-size:26px; 
background:#083c3f; 
color:white; 
border:none; 
padding:10px 15px; 
cursor:pointer; 
border-radius:6px;

}
.form-toggle{ 
  margin-top:20px; 
}

.toggle-btn{
  
padding:14px 22px; font-size:20px; background:#114a86; color:white; border:none; border-radius:8px; cursor:pointer;
}

.card{ background:white; padding:28px; margin-top:25px; border-radius:14px; box-shadow:0 8px 15px rgba(0,0,0,.12); }
.form{ display:grid; grid-template-columns:repeat(5,1fr); gap:18px; }
.form input{ padding:12px 14px; font-size:20px; }
.form-buttons{ grid-column:span 5; }
.form button{ padding:16px; font-size:20px; background:#114a86; color:white; border:none; border-radius:6px; }

.province-title{ margin-top:35px; background:#083c3f; color:white; padding:12px; font-size:40px; border-radius:8px; }
.municipality-title{ margin-bottom:18px; font-size:30px; }

.record-card table{ width:100%; border-collapse:collapse; font-size:25px; }
.record-card th{ background:#cfd8dc; padding:12px; }
.record-card td{ padding:10px; border-bottom:1px solid #ddd; }

.record-card button{ padding:8px 12px; font-size:20px; margin-right:6px; border:none; border-radius:4px; cursor:pointer; }
.record-card button:first-child{ background:#0b68a5; color:white; }
.record-card button:last-child{ background:#f44336; color:white; }

.empty{ padding:15px; background:#fff3cd; border-radius:8px; margin-top:10px; }
</style>
