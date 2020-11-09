<template>
  <div id="app">
    <div class="container-principal">
      <div id="menu">
        <button @click="displayContent('home')" :class="{ 'button-active' : homeContent }">Home</button>
        <button @click="displayContent('student')" :class="{ 'button-active' : studentContent }">Alunos</button>
        <button @click="displayContent('teachers')" :class="{ 'button-active' : teacherContent }">Professores</button>
        <button @click="displayContent('chart')" :class="{ 'button-active' : chartContent }">Gráfico</button>
      </div>
      <div id="content">
        <Loading v-if="loading" />
        <div class="display" v-else>
          <Home v-if="homeContent" />
          <Students v-if="studentContent" :importStudents="allStudents" :importClasses="allClasses" :importDegrees="allDegrees" />
          <Teachers 
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
      loading: false,
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
#app {
  justify-content: center;
  align-items: center;
}

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
  align-items: center;
  padding-left: 25px;
}

@media (max-width: 768px) {
  #menu {
    margin-left: 50px;
    width: 380px;
    height: 50px;
  }
  #content {
    margin-left: 55px;
    width: 380px;
    min-height: 500px;
    padding-left: 0px ;
    margin-top: 25px;
    border-radius: 50px;
    background: #ebcfc4;
  }
}

button {
  cursor: pointer;
  margin-right: 25px;
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
  margin-top: 25px;
  border-radius: 50px;
  background: #ebcfc4;
} 

.display {
  width: 100%;
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
  max-width: 100px;
} 

td {
  max-width: 150px;
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

</style>
