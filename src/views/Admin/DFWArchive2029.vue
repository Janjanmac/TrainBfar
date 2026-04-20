<template>
  <div class="page">

    <div class="top-header">
      <button class="back-btn" @click="$router.push('/DFW2028')">Back</button>
      <h1 class="header-title">ARCHIVED DEPUTIZED FISH WARDEN (2029)</h1>
    </div>

    <div v-if="archive.length===0" class="empty">
      No archived records
    </div>

    <!-- PROVINCE LOOP -->
    <div v-for="(municipalities, province) in groupedArchive" :key="province" class="province">
      <h2 class="province-title">{{ province }}</h2>

      <div v-for="(rows, municipality) in municipalities" :key="municipality" class="card record-card">
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
              <td>{{ index+1 }}</td>
              <td>{{ r.idNo }}</td>
              <td>{{ r.lastName }}</td>
              <td>{{ r.firstName }}</td>
              <td>{{ r.middleName }}</td>
              <td>{{ r.sex }}</td>
              <td>{{ r.issuanceDate }}</td>
              <td>{{ r.expirationDate }}</td>
              <td>{{ r.status }}</td>
              <td>
                <button @click="restore(r)">Restore</button>
                <button @click="removeForever(r)">Delete</button>
              </td>
            </tr>
          </tbody>

        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { db } from "@/firebase"
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore"

const archive = ref([])

const PROVINCE_ORDER = [
  "ORIENTAL MINDORO",
  "OCCIDENTAL MINDORO",
  "MARINDUQUE",
  "ROMBLON",
  "PALAWAN"
]

const YEAR = 2029  // <-- Updated year

// Load archive records
onMounted(async()=>{
  const snap = await getDocs(collection(db,`DFWArchive${YEAR}`))
  archive.value = snap.docs.map(d=>({ ...d.data(), firebaseId:d.id }))
})

// Group archive
const groupedArchive = computed(()=>{
  const g = {}
  PROVINCE_ORDER.forEach(p=> g[p] = {})

  archive.value.forEach(r=>{
    if(!g[r.province]) g[r.province]={}
    if(!g[r.province][r.municipality]) g[r.province][r.municipality]=[]
    g[r.province][r.municipality].push(r)
  })

  return g
})

// Restore record
async function restore(row){
  try{
    const { firebaseId, ...data } = row
    await addDoc(collection(db,`dfwRecords${YEAR}`), { ...data, status:"ACTIVE" })
    if(firebaseId){
      await deleteDoc(doc(db,`DFWArchive${YEAR}`,firebaseId))
    }
    const i = archive.value.indexOf(row)
    if(i>-1) archive.value.splice(i,1)
  }catch(err){
    console.error(err)
  }
}

// Delete permanently
async function removeForever(row){
  try{
    if(row.firebaseId){
      await deleteDoc(doc(db,`DFWArchive${YEAR}`,row.firebaseId))
    }
    const i = archive.value.indexOf(row)
    if(i>-1) archive.value.splice(i,1)
  }catch(err){
    console.error(err)
  }
}
</script>

<style scoped>
.page{
  padding:35px;
  font-family: Arial, Helvetica, sans-serif;
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
  font-size:20px;
  background:#083c3f;
  color:white;
  border:none;
  padding:10px 18px;
  border-radius:6px;
  cursor:pointer;
}

.card{
  background:white;
  padding:28px;
  margin-top:25px;
  border-radius:14px;
  box-shadow:0 8px 15px rgba(0,0,0,.12);
}

.province-title{
  margin-top:35px;
  background:#083c3f;
  color:white;
  padding:12px;
  font-size:40px;
  border-radius:8px;
}

.municipality-title{
  margin-bottom:18px;
  font-size:30px;
  font-weight:600;
}

.record-card table{
  width:100%;
  border-collapse:collapse;
  font-size:25px;
}

.record-card th{
  background:#cfd8dc;
  padding:12px;
  text-align:left;
}

.record-card td{
  padding:10px;
  border-bottom:1px solid #ddd;
}

.record-card table button{
  padding:8px 12px;
  font-size:20px;
  margin-right:6px;
  border:none;
  border-radius:4px;
  cursor:pointer;
}

.record-card table button:first-child{
  background:#0b68a5;
  color:white;
}

.record-card table button:last-child{
  background:#f44336;
  color:white;
}

.empty{
  padding:15px;
  background:#fff3cd;
  border-radius:8px;
  margin-top:10px;
}
</style>