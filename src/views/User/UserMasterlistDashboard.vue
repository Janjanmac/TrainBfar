<template>
  <div class="dashboard">

     <!-- HEADER WITH BACK BUTTON -->
    <div class="top-header">
      <button class="back-btn" @click="$router.back()">Back</button>
      <h1 class="header-title">DEPUTIZED FISH WARDEN MASTERLIST</h1>
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
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

function goBack() {
  router.push("/UserDFWDashboard")  // <-- this will navigate to UserDFWDashboard
}

const STORAGE = "dfw-masterlist"
const rows = ref([])

onMounted(() => {
  const saved = localStorage.getItem(STORAGE)
  if(saved){
    rows.value = JSON.parse(saved).sort((a,b)=>{
      return (a.lastName || "").localeCompare(b.lastName || "")
    })
  }
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

/* TABLE */
.table-wrapper{
  overflow:auto;
  background:white;
  border-radius:12px;
  box-shadow:0 8px 15px rgba(0,0,0,.12);
  margin-top:15px;
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
</style>