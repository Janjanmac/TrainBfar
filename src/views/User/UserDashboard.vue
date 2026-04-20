<template>
  <div class="page">

    <!-- HEADER -->
    <div class="header">
      <img src="@/assets/bfar-header.png" class="header-image" />
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
export default {

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
  min-height: 98vh;
  background: linear-gradient(135deg,#d8e7ff,#eff6ff);
}
.header {
  width: 100%;
  text-align: center;
  background: linear-gradient(135deg,#5c9bfa,#f4f7fb);
}
.header-image {
  width: 100%;
  max-height: 290px;
  object-fit: contain;
}
.title-section {
  text-align: center;
  margin-top: 20px;
}
.title-section h1 {
  font-size: 50px;
  font-weight: 900;
}
.title-section p {
  font-size: 30px;
  color: #444;
}
.dashboard {
  display: flex;
  justify-content: center;
  font-size: 20px;
  margin-top: 40px;
}
.card {
  width: 420px;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}
label {
  display: block;
  margin-top: 10px;
  font-weight: bold;
  font-size: 25px;
}
select {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 15px;
  font-size: 19px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
button {
  width: 100%;
  padding: 12px;
  border: none;
  background: #5ca5ff;
  color: white;
  font-size: 25px;
  border-radius: 6px;
  cursor: pointer;
}
button:hover {
  background: #084a9a;
}
button:disabled {
  background: #aaa;
}
</style>