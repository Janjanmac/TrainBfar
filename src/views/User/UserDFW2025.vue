<template>
  <div class="page-container">

    <!-- SIDEBAR -->
    <div :class="['sidebar', { open: sidebarOpen }]">
      <h2 class="sidebar-title">Menu</h2>
      <ul>
        <li><router-link to="/user-dashboard">Home</router-link></li>
        <li><router-link to="/user-masterlist">Masterlist</router-link></li>
        <li><router-link to="/login">Logout</router-link></li>
      </ul>
    </div>

    <!-- MAIN PAGE -->
    <div :class="['page', { shifted: sidebarOpen }]">

      <!-- HEADER -->
      <div class="top-header">
        <button class="hamburger-btn" @click="toggleSidebar">&#9776;</button>
        <h1 class="header-title">LIST OF DEPUTIZED FISH WARDEN (2025)</h1>
      </div>

      <!-- NO RECORDS MESSAGE -->
      <div v-if="Object.keys(groupedData).length === 0" class="empty">
        No records found
      </div>

      <!-- PROVINCE LOOP -->
      <div v-for="(municipalities, province) in groupedData" :key="province" class="province">
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
              </tr>
            </tbody>
          </table>

        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useRoute } from "vue-router"
import { db } from "@/firebase"
import { collection, getDocs } from "firebase/firestore"

// SIDEBAR
const sidebarOpen = ref(false)
const toggleSidebar = () => sidebarOpen.value = !sidebarOpen.value

// ROUTE QUERY (for filtering)
const route = useRoute()
const selectedProvince = ref(route.query.province || "")
const selectedMunicipality = ref(route.query.municipality || "")

// RECORDS
const records = ref([])

// LOAD DATA FROM FIREBASE
onMounted(async () => {
  const snap = await getDocs(collection(db, "dfwRecords2025"))
  records.value = snap.docs.map(d => ({ ...d.data(), firebaseId: d.id }))
  console.log("Loaded 2025 records:", records.value)
})

// GROUP AND FILTER DATA (CASE-INSENSITIVE)
const groupedData = computed(() => {
  const g = {}

  const filtered = records.value.filter(r => {
    const provinceMatch = !selectedProvince.value || (r.province && r.province.toUpperCase() === selectedProvince.value.toUpperCase())
    const municipalityMatch = !selectedMunicipality.value || (r.municipality && r.municipality.toUpperCase() === selectedMunicipality.value.toUpperCase())
    return provinceMatch && municipalityMatch
  })

  filtered.forEach(r => {
    const prov = r.province || "UNKNOWN PROVINCE"
    const muni = r.municipality || "UNKNOWN MUNICIPALITY"

    if (!g[prov]) g[prov] = {}
    if (!g[prov][muni]) g[prov][muni] = []
    g[prov][muni].push(r)
  })

  // SORT PROVINCES AND MUNICIPALITIES
  const sorted = {}
  Object.keys(g).sort((a,b)=>a.localeCompare(b)).forEach(prov => {
    const muni = g[prov]
    sorted[prov] = Object.keys(muni)
      .sort((a,b)=>a.localeCompare(b))
      .reduce((acc,m) => {
        acc[m] = muni[m].slice().sort((a,b)=>a.lastName.localeCompare(b.lastName))
        return acc
      }, {})
  })

  return sorted
})
</script>

<style scoped>
.page-container { display:flex; font-family:Arial; }

/* SIDEBAR */
.sidebar { position:fixed; top:0; left:-250px; width:250px; height:100vh; background:white; padding:20px; transition:left .3s; }
.sidebar.open { left:0; }
.sidebar-title { font-size:22px; margin-bottom:20px; }
.sidebar ul { list-style:none; padding:0; }
.sidebar li { margin:15px 0; }
.sidebar a { text-decoration:none; font-size:20px; color:black; }

/* PAGE */
.page { flex:1; padding:35px; transition:margin-left .3s; }
.page.shifted { margin-left:250px; }

/* HEADER */
.top-header { display:flex; align-items:center; background:#114a86; color:white; padding:22px; border-radius:12px; position:relative; }
.header-title { position:absolute; left:50%; transform:translateX(-50%); font-size:40px; font-weight:700; }
.hamburger-btn { font-size:26px; background:#083c3f; color:white; border:none; padding:10px 15px; cursor:pointer; border-radius:6px; }

/* RECORD CARDS */
.card { background:white; padding:28px; margin-top:25px; border-radius:14px; box-shadow:0 8px 15px rgba(0,0,0,.12); }
.province-title { margin-top:35px; background:#083c3f; color:white; padding:12px; font-size:32px; border-radius:8px; }
.municipality-title { margin-bottom:18px; font-size:26px; }

/* TABLE */
.record-card table { width:100%; border-collapse:collapse; font-size:20px; }
.record-card th { background:#cfd8dc; padding:12px; }
.record-card td { padding:10px; border-bottom:1px solid #ddd; }

/* EMPTY MESSAGE */
.empty { padding:15px; background:#fff3cd; border-radius:8px; margin-top:10px; font-size:20px; font-weight:bold; text-align:center; }
</style>