<template>
  <div class="layout">

    <!-- Sidebar -->
    <div class="sidebar">
      <h2 class="logo">StudentSys</h2>

      <ul>
        <li @click="page='dashboard'" :class="{active: page==='dashboard'}">
          Dashboard
        </li>
        <li @click="page='students'" :class="{active: page==='students'}">
          Student Management
        </li>
      </ul>
    </div>

    <!-- Main Content -->
    <div class="main">

      <!-- Dashboard Page -->
      <div v-if="page==='dashboard'">
        <h1>Dashboard</h1>

        <div class="cards">
          <div class="card">
            <h3>Total Students</h3>
            <p>{{ students.length }}</p>
          </div>
        </div>
      </div>

      <!-- Student Page -->
      <div v-if="page==='students'">
        <h1>Student Management</h1>

        <!-- Form -->
        <div class="form">
          <input v-model="name" placeholder="Student Name">
          <input v-model="course" placeholder="Course">
          <input v-model="age" placeholder="Age">
          <input v-model="Birthday" placeholder="Birthday">
          

          <button @click="addOrUpdateStudent">
            {{ editIndex === null ? "Add Student" : "Update Student" }}
          </button>
        </div>

        <!-- Table -->
        <table v-if="students.length > 0">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Course</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(student, index) in students" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ student.name }}</td>
              <td>{{ student.course }}</td>
              <td>{{ student.age }}</td>
              <td>
                <button class="edit" @click="editStudent(index)">Edit</button>
                <button class="delete" @click="deleteStudent(index)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>

        <p v-else>No students yet.</p>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: "dashboard",
      name: "",
      course: "",
      age: "",
      students: [],
      editIndex: null
    };
  },

  methods: {
    addOrUpdateStudent() {
      if (!this.name || !this.course || !this.age) return;

      const studentData = {
        name: this.name,
        course: this.course,
        age: this.age
      };

      if (this.editIndex === null) {
        this.students.push(studentData);
      } else {
        this.students[this.editIndex] = studentData;
        this.editIndex = null;
      }

      this.clearForm();
    },

    editStudent(index) {
      const student = this.students[index];
      this.name = student.name;
      this.course = student.course;
      this.age = student.age;
      this.editIndex = index;
      this.page = "students";
    },

    deleteStudent(index) {
      this.students.splice(index, 1);
    },

    clearForm() {
      this.name = "";
      this.course = "";
      this.age = "";
    }
  }
};
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
}

/* Sidebar */
.sidebar {
  width: 220px;
  background: #2c3e50;
  color: white;
  padding: 20px;
}

.logo {
  text-align: center;
  margin-bottom: 30px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 12px;
  cursor: pointer;
  border-radius: 6px;
}

.sidebar li:hover,
.sidebar .active {
  background: #34495e;
}

/* Main */
.main {
  flex: 1;
  padding: 30px;
  background: #6a7a91;
}

/* Cards */
.cards {
  display: flex;
  gap: 20px;
}

.card {
  background: rgb(88, 62, 62);
  padding: 20px;
  border-radius: 10px;
  width: 200px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  text-align: center;
}

/* Form */
.form {
  margin-bottom: 20px;
}

input {
  padding: 10px;
  margin-right: 10px;
  border-radius: 6px;
  border: 1px solid #613030;
}

/* Buttons */
button {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: #4CAF50;
  color: white;
}

button.edit {
  background: #2196F3;
  margin-right: 5px;
}

button.delete {
  background: #f44336;
}

/* Table */
table {
  width: 100%;
  border-collapse: collapse;
  background: rgb(86, 151, 100);
}

th, td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: center;
}

th {
  background: #4CAF50;
  color: white;
}
</style>
