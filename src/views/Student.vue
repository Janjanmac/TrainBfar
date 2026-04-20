<template>
  <div class="container">

    <h1>Student Information</h1>

    <!-- Form -->
    <div class="card">
      <input v-model="name" placeholder="Student Name" />
      <input v-model="course" placeholder="Course" />
      <input v-model="age" placeholder="Age" />

      <button @click="addOrUpdateStudent">
        {{ editIndex === null ? "Add Student" : "Update Student" }}
      </button>
    </div>

    <!-- Table -->
    <div class="card">
      <h2>Student List</h2>

      <table v-if="students.length">
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
              <button @click="editStudent(index)">Edit</button>
              <button class="delete" @click="deleteStudent(index)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else>No students yet.</p>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      course: "",
      age: "",
      students: [],
      editIndex: null
    }
  },

  methods: {
    addOrUpdateStudent() {
      if (!this.name || !this.course || !this.age) return;

      const student = {
        name: this.name,
        course: this.course,
        age: this.age
      };

      if (this.editIndex === null) {
        this.students.push(student);
      } else {
        this.students[this.editIndex] = student;
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
}
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 40px auto;
}

.card {
  background: white;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
}

.delete {
  background: red;
  color: white;
}
</style>
