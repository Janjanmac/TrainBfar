<template>
  <div class="dashboard">

     <!-- HEADER WITH BACK BUTTON -->
    <div class="top-header">
      <button class="back-btn" @click="$router.back()">Back</button>
      <h1 class="header-title">DEPUTIZED FISH WARDEN MASTERLIST</h1>
    </div>


    <!-- ADD FORM -->
    <div class="card form">
      <input v-model="form.lastName" placeholder="Last Name" />
      <input v-model="form.firstName" placeholder="First Name" />
      <input v-model="form.middleName" placeholder="Middle Name" />
      <input v-model="form.ext" placeholder="Name Extension" />
      <input v-model="form.id" placeholder="DFW ID Number" />
      <input v-model="form.dateIssued" placeholder="Date Issued" />
      <input v-model="form.address" placeholder="Home Address" />
      <input v-model="form.email" placeholder="Email" />
      <input v-model="form.phone" placeholder="Phone" />
      <input v-model="form.fb" placeholder="FB" />
      <input v-model="form.agency" placeholder="Agency" />
      <input v-model="form.agencyAddress" placeholder="Agency Address" />
      <div class="form-checkboxes">
        <label><input type="checkbox" v-model="form.birth" /> Birth Cert</label>
        <label><input type="checkbox" v-model="form.valid" /> Valid ID</label>
        <label><input type="checkbox" v-model="form.medical" /> Medical</label>
        <label><input type="checkbox" v-model="form.cert" /> Certificate</label>
      </div>
      <input v-model="form.remarks" placeholder="Remarks" />

      <div class="form-buttons">
        <button @click="saveRecord">{{ editIndex === null ? "Add Record" : "Update Record" }}</button>
      </div>
    </div>

    <!-- TABLE -->
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Last Name</th>
            <th>First Name</th>
            <th>Middle Name</th>
            <th>Name Extension</th>
            <th>DFW ID Number</th>
            <th>Date Issued</th>
            <th class="home-address">Home Address</th>
            <th>Email</th>
            <th>Phone</th>
            <th>FB</th>
            <th>Agency</th>
            <th>Address</th>
            <th>Birth Cert</th>
            <th>Valid ID</th>
            <th>Medical</th>
            <th>Certificate</th>
            <th>Remarks</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(row,index) in rows" :key="index">
            <td class="index">{{ index+1 }}</td>
            <td>{{ row.lastName }}</td>
            <td>{{ row.firstName }}</td>
            <td>{{ row.middleName }}</td>
            <td>{{ row.ext }}</td>
            <td>{{ row.id }}</td>
            <td>{{ row.dateIssued }}</td>
            <td class="home-address">{{ row.address }}</td>
            <td>{{ row.email }}</td>
            <td>{{ row.phone }}</td>
            <td>{{ row.fb }}</td>
            <td>{{ row.agency }}</td>
            <td>{{ row.agencyAddress }}</td>
            <td><input type="checkbox" v-model="row.birth" disabled /></td>
            <td><input type="checkbox" v-model="row.valid" disabled /></td>
            <td><input type="checkbox" v-model="row.medical" disabled /></td>
            <td><input type="checkbox" v-model="row.cert" disabled /></td>
            <td>{{ row.remarks }}</td>
            <td>
              <button class="edit" @click="editRecord(row)">Edit</button>
              <button class="delete" @click="removeRow(index)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
function goBack(){
  router.push("/DFWARDENDashboard")
}
const STORAGE = "dfw-masterlist"
const rows = ref([])
const editIndex = ref(null)

const form = ref({
  lastName:"",
  firstName:"",
  middleName:"",
  ext:"",
  id:"",
  dateIssued:"",
  address:"",
  email:"",
  phone:"",
  fb:"",
  agency:"",
  agencyAddress:"",
  birth:false,
  valid:false,
  medical:false,
  cert:false,
  remarks:""
})

// ⭐ SORT FUNCTION
function sortRows(){
  rows.value = rows.value.slice().sort((a,b)=>{
    return (a.lastName || "").localeCompare(b.lastName || "")
  })
}

// ⭐ SAVE / UPDATE RECORD
function saveRecord(){
  if(editIndex.value === null){
    rows.value.push({...form.value})
  } else {
    rows.value[editIndex.value] = {...form.value}
    editIndex.value = null
  }
  sortRows()
  resetForm()
}

// ⭐ EDIT
function editRecord(row){
  editIndex.value = rows.value.indexOf(row)
  form.value = {...row}
}

// ⭐ DELETE
function removeRow(i){
  rows.value.splice(i,1)
  sortRows()
}

// ⭐ RESET FORM
function resetForm(){
  form.value = {
    lastName:"",
    firstName:"",
    middleName:"",
    ext:"",
    id:"",
    dateIssued:"",
    address:"",
    email:"",
    phone:"",
    fb:"",
    agency:"",
    agencyAddress:"",
    birth:false,
    valid:false,
    medical:false,
    cert:false,
    remarks:""
  }
}

// ⭐ ON MOUNT — load from localStorage
onMounted(()=>{
  const saved = localStorage.getItem(STORAGE)
  if(saved){
    rows.value = JSON.parse(saved)
    sortRows()
  }
})

// ⭐ WATCH — save to localStorage
watch(rows,val=>{
  localStorage.setItem(STORAGE,JSON.stringify(rows.value))
},{deep:true})

// ⭐ AUTO-UPPERCASE LAST NAME
watch(() => form.value.lastName, (val) => {
  form.value.lastName = val.toUpperCase()
})

// Optional — auto-uppercase first/middle name
watch(() => form.value.firstName, (val) => {
  form.value.firstName = val.toUpperCase()
})
watch(() => form.value.middleName, (val) => {
  form.value.middleName = val.toUpperCase()
})
</script>

<style scoped>
.dashboard{
  padding:25px;
  background:#f4f6fa;
  min-height:100vh;
  font-family:Arial, sans-serif;
}

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

.back-btn{ 
  background:#0b68a5; 
  color:white; 
  border:none; 
  padding:10px 18px; 
  border-radius:6px; 
  font-size:20px; 
  cursor:pointer; 
  margin-left:10px; 
}

/* FORM */
.card.form{
  display:grid;
  grid-template-columns:repeat(6,1fr);
  gap:12px;
  padding:15px;
  margin:15px 0;
  background:white;
  border-radius:10px;
  box-shadow:0 8px 15px rgba(0,0,0,.12);
}

.card.form input{
  padding:8px;
  font-size:14px;
}

/* CHECKBOXES */
.form-checkboxes{
  grid-column:span 6;
  display:flex;
  gap:12px;
}

/* FORM BUTTON */
.form-buttons{
  grid-column:span 6;
  text-align:right;
}

.form-buttons button{
  background:#114a86;
  color:white;
  padding:8px 16px;
  border:none;
  border-radius:6px;
  cursor:pointer;
}

/* TABLE */
.table-wrapper{
  overflow:auto;
  background:white;
  border-radius:12px;
  box-shadow:0 8px 15px rgba(0,0,0,.12);
}

table{
  border-collapse:collapse;
  min-width:2200px;
  width:100%;
}

th{
  background:#e0e0e0;
  padding:12px;
  font-size:18px;
  border:1px solid #cfcfcf;
}

th.home-address,
td.home-address{
  min-width:300px;
}

td{
  padding:8px;
  border:1px solid #e0e0e0;
  font-size:14px;
}

td input{
  width:100%;
  min-height:20px;
  padding:4px 6px;
  font-size:14px;
  border:none;
  outline:none;
  background:transparent;
}

.index{
  font-weight:600;
  text-align:center;
  
}

.edit{
  background:#0b68a5;
  color:white;
  border:none;
  padding:6px 10px;
  border-radius:4px;
  cursor:pointer;
  margin-right:4px;
}

.delete{
  background:#f44336;
  color:white;
  border:none;
  padding:6px 10px;
  border-radius:4px;
  cursor:pointer;
}
</style>
