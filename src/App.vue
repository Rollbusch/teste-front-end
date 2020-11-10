<template>
  <div id="app">
    <div class="container-principal">
      <div id="menu">
        <div>
          <button class="btn" @click="displayContent('home')" :class="{ 'button-active' : homeContent }">Home</button>
        </div>
        <div>
          <button class="btn" @click="displayContent('student')" :class="{ 'button-active' : studentContent }">Alunos</button>
        </div>
        <div>
          <button class="btn" @click="displayContent('teachers')" :class="{ 'button-active' : teacherContent }">Relações</button>
        </div>
        <div>
          <button class="btn" @click="displayContent('chart')" :class="{ 'button-active' : chartContent }">Gráfico</button>
        </div>
      </div>
      <div id="content">
        <div class="display">
          <Home v-if="homeContent" />
          <Students v-if="studentContent" :importStudents="allStudents" :importClasses="allClasses" :importDegrees="allDegrees" />
          <Relationships 
            v-if="teacherContent" 
            :importStudents="allStudents" 
            :importClasses="allClasses" 
            :importDegrees="allDegrees"
            :importRelationships="allRelationships"
            :importTeachers="allTeachers"
            :importMatters="allMatters"
          />
          <Chart v-if="chartContent" :students="allStudents" :degree="allDegrees" :showChart="true"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import students from './json/students.json'
import classes from './json/classes.json'
import degrees from './json/degrees.json'
import matters from './json/matters.json'
import relationships from './json/relationships.json'
import teachers from './json/teachers.json'

export default {
  name: 'App',
  data () {
    return {
      allStudents: students,
      allClasses: classes.classes,
      allDegrees: degrees,
      allMatters: matters,
      allRelationships: relationships,
      allTeachers: teachers,
      homeContent: true,
      studentContent: false,
      chartContent: false,
      teacherContent: false
    }
  },
  methods: {
    displayContent (display) {
      this.homeContent = display === 'home' ? true : false
      this.studentContent = display === 'student' ? true : false
      this.chartContent = display === 'chart' ? true : false
      this.teacherContent = display === 'teachers' ? true : false
    }
  }
}
</script>

<style>
body {
  background: #fff3e2;
  font-family: 'Ubuntu', serif;
}

.container-principal {
  display: flex;
  flex-flow: column;
  align-items: center;
}

#menu {
  background: #9088d4;
  width: 900px;
  height: 50px;
  border-radius: 50px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

@media (max-width: 768px) {
  #menu {
    width: 100%;
    height: 50px;
  }
  #content {
    max-width: 100%;
    height: auto;
    padding-left: 0px ;
  }
  .btn {
    width: auto;
    min-width: 70px;
  }
  .display {
    max-width: 100%;
  }
  td {
    max-width: auto;
    min-width: 30px !important;
  }
  tr {
    max-width: 400px;
  }
}

button {
  cursor: pointer;
  /* margin-right: 25px; */
  border: 1px solid;
  border-radius: 50px;
  height: 35px;
  width: 100px;
  background: #706897;
  color: #FFFFFF;
} 
button:hover {
  background: #544e83;
} 
button:active {
  background: #5b52ac;
} 
button:focus {
  outline: none;
}
.button-active {
  background: #544e83;
}

#content {
  margin-top: 10px;
  border-radius: 50px;
  background: #ebcfc4;
  width: 900px;
} 

.display {
  width: 900px;
}

.import-files {
  margin-top: 25px;
  width: 90%;
  border: 1px solid;
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding-left: 25px;
  flex-flow: column;
} 
tr {
  width: 800px;
} 

td {
  width: auto;
  max-width: 900px;
}

.form-list {
  display: flex;
  justify-content: center;
}

.filter {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

h1 {
  display: inline
}

.error {
  color: red;
  font-weight: 600;
}

</style>
