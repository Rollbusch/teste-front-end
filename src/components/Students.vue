<template>
  <div id="students">
    <h1>Alunos</h1>
    <div v-if="list">
      <div style="display: flex; justify-content: center; height: 40px;">
        <h4>Filtro</h4>
      </div>
      <div class="filter">
        <div>
          <label style="display: block;">Série</label>
          <select v-model="degreeFilter">
            <option :value="null">Série</option>
            <option v-for="degree in degrees" :key="degree.id" :value="degree.id">{{ degree.name }}</option>
          </select>
        </div>
        <div>
          <label style="display: block">Classe</label>
          <select v-model="classFilter" class="select-small">
            <option :value="null">Classe</option>
            <option v-for="schoolClass in classes" :key="schoolClass.id" :value="schoolClass.id">{{ schoolClass.name }}</option>
          </select>
        </div>
      </div>
      <Loading v-if="loading" />
      <div style="display:flex; justify-content: center; flex-flow: column; align-items: center" v-else>
        <div style="display: flex; margin: 10px">
          <button @click="create('unique')">Cadastrar</button>
          <button @click="create('300')">Gerar 300 cadastros</button>
        </div>
        <div v-for="(student, i) in filteredStudents" :key="student.id" style="display: flex; height: 50px; padding-bottom: 50px; border-bottom: 1px solid #fff3e2">
          <div style="margin: 10px">
            <div>
              <label style="display:block">Nome do aluno:</label>
              <input v-model="student.name" :disabled="studentIndex !== i">
            </div>
            <div>
              <label style="display:block">RA:</label>
              <input v-model="student.ra" :disabled="studentIndex !== i" style="width: 60px">
            </div>
          </div>
          <div style="margin: 10px">
            <div>
              <label style="display:block">Série:</label>
              <select v-model="student.degreeId" :disabled="studentIndex !== i" class="select-medium">
                <option :value="null">Série</option>
                <option v-for="degree in degrees" :key="degree.id" :value="degree.id">{{ degree.name }}</option>
              </select>
            </div>
            <div>
              <label style="display:block">Classe</label>
              <select v-model="student.classId" :disabled="studentIndex !== i" class="select-small">
                <option :value="null">Classe</option>
                <option v-for="schoolClass in classes" :key="schoolClass.id" :value="schoolClass.id">{{ schoolClass.name }}</option>
              </select>
            </div>
          </div>
          <div style="display: flex; justify-content: center; align-items: flex-end">
            <div @click="editStudent(i)" style="margin-right: 10px">
                <EditIcon style="width: 25px; height: 25px; cursor: pointer;" />
              </div>
              <div @click="remove(i)">
                <TrashIcon style="width: 25px; height: 25px; cursor: pointer;" />
              </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div>
        <label>Nome do Aluno:</label>
        <input v-model="name" />
      </div>
      <div>
        <label>RA</label>
        <input v-model="ra" :disabled="edit ==='edit'" />
      </div>
      <div>
        <label>Série</label>
        <select v-model="studentClass" :disabled="edit==='edit'" class="select-medium">
          <option :value="null">Série</option>
          <option v-for="schoolClass in classes" :key="schoolClass.id" :value="schoolClass.id">{{ schoolClass.name }}</option>
        </select>
      </div>
      <div>
        <label>Classe</label>
        <select v-model="studentDegree">
          <option :value="null">Classe</option>
          <option v-for="degree in degrees" :key="degree.id" :value="degree.id">{{ degree.name }}</option>
        </select>
      </div>
      <button @click="save">Salvar</button>
      <button @click="clean">Cancelar</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Students',
  props: ['importStudents', 'importClasses', 'importDegrees'],
  data () {
    return {
      allStudents: this.importStudents,
      degrees: this.importDegrees,
      classes: this.importClasses,
      list: true,
      edit: false,
      name: '',
      position: null,
      degreeFilter: null,
      classFilter: null,
      studentDegree: null,
      studentClass: null,
      ra: '',
      loading: false,
      error: [],
      studentIndex: false
    }
  },
  computed: {
    filteredStudents () {
      let students = this.filter(this.allStudents)
      return students
    }
  },
  mount () {
    this.filteredStudents()
  },
  methods: {
    save () {
      if (!this.name || !this.ra || !this.studentDegree || !this.studentClass) return false
      if (this.edit === 'edit') {
        this.allStudents[this.position].name = this.name
        this.allStudents[this.position].ra = this.ra
        this.allStudents[this.position].degreeId = this.studentDegree
        this.allStudents[this.position].classId = this.studentClass
      } else {
        let id = this.getLastId() + 1
        const student = {
          'id': id,
          'name': this.name,
          'ra': this.ra,
          'degreeId': this.studentDegree,
          'classId': this.studentClass
        }
        this.allStudents.push(student)
      }
      this.edit = false
      this.list = true
      this.clean()
    },
    clean () {
      this.edit = false
      this.list = true
      this.name = ''
      this.ra = ''
      this.studentDegree = null
      this.studentClass = null
    },
    editStudent (i) {
      if (this.studentIndex === i) return this.studentIndex = null
      this.studentIndex = i
    },
    remove (i) {
      this.studentIndex = null
      this.allStudents.splice(i, 1)
    },
    filter (studentsArr) {
      let students = studentsArr
      students.forEach(x => {
        this.degrees.forEach(y => {
          if (y.id === x.degreeId) {
            x.degreeName = y.name
          }
        })
        this.classes.forEach(z => {
          if (z.id === x.classId) {
            x.className = z.name
          }
        })
      })
      if (this.classFilter) {
        students = students.filter(x => x.classId === this.classFilter)
      }
      if (this.degreeFilter) {
        students = students.filter(x => x.degreeId === this.degreeFilter)
      }
      return students
    },
    create (type) {
      if (type === 'unique') {
        this.edit = 'new'
        this.list = false
      } else {
        this.loading = true
        let name, ra
        for (let i = 0; i < 300; i++ ) {
          let uniqueRa;
          const generateRa = true
          while (generateRa) {
            // Generate a random student RA
            const randomRa = Math.floor(Math.random() * 1000000)
            // Validate if the RA is unique
            uniqueRa = this.checkUnique(randomRa)
            if (uniqueRa.length >= 1) {
             continue 
            } else {
              ra = randomRa
              break
            }
          }
          name = this.getRandomName(15)
          let id = this.getLastId() + 1
          const student = {
            'id': id,
            'name': name,
            'ra': ra,
            'degreeId': this.degrees[Math.floor(Math.random() * this.degrees.length)].id,
            'classId': this.classes[Math.floor(Math.random() * this.classes.length)].id
          }
          this.allStudents.push(student)
        }
      }
      this.loading = false
    },
    checkUnique (param) {
      const check = this.allStudents.filter(x => x.ra === param)
      return check
    },
    getRandomName (length) {
      var randomChars = 'abcdefghijklmnopqrstuvwxyz'
      var result = ''
      for ( var i = 0; i < length; i++ ) {
          result += randomChars.charAt(Math.floor(Math.random() * randomChars.length))
      }
      return result.charAt(0).toUpperCase() + result.slice(1)
    },
    getLastId () {
      if (this.allStudents.length === 0) return 1
      const lastId = this.allStudents.sort((a, b) => {
        return a.id - b.id
      })
      return lastId[lastId.length - 1].id
    }
  }
}
</script>

<style scoped>
input:focus, select:focus{
  outline: none;
}

#students {
  padding: 25px;
}

@media screen and (max-width: 768px) {
  #students {
    max-width: 500px;
  }
}

input {
  border: 1px solid;
  border-radius: 8px;
}

select {
  border: 1px solid;
  border-radius: 8px;
}

.select-small {
  width: 70px;
}

.select-medium {
  width: 150px;
}

input {
  width: 120px;
}

</style>
