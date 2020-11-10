<template>
  <div id="students">
    <h1>{{ list ? 'Aluno' : 'Cadastrar aluno' }}</h1>
    <div v-if="list">
      <div style="display:flex; justify-content: center; flex-flow: column; align-items: center">
        <div style="display: flex; margin-top: 25px; margin-bottom: 10px" >
          <button @click="create('unique')" style="margin-right: 25px" class="btn">Cadastrar</button>
          <button @click="create('300')" style="margin-right: 25px;" class="btn">Gerar 300 cadastros</button>
          <button @click="filterOptions = !filterOptions" class="btn">{{ filterOptions ? 'Fechar' : 'Filtrar' }}</button>
        </div>
        <div v-if="filterOptions" class="filter" style="margin-bottom: 10px">
          <div style="margin-right: 15px">
            <label>Série</label>
            <select v-model="degreeFilter">
              <option :value="null">Série</option>
              <option v-for="degree in degrees" :key="degree.id" :value="degree.id">{{ degree.name }}</option>
            </select>
          </div>
          <div>
            <label>Classe</label>
            <select v-model="classFilter" class="select-small">
              <option :value="null">Classe</option>
              <option v-for="schoolClass in classes" :key="schoolClass.id" :value="schoolClass.id">{{ schoolClass.name }}</option>
            </select>
          </div>
        </div>
        <div v-for="(student, i) in filteredStudents" :key="student.id" style="margin-top: 5px; " class="student">
          <table>
            <tr class="tr-input" style="padding-bottom: 10px; border-bottom: 1px solid;">
              <td>
                <div class="input-list">
                  <div>
                    <label>Aluno:</label>
                    <input v-model="student.name" :disabled="studentIndex !== i">
                  </div>
                  <div>
                    <label>RA:</label>
                    <input v-model="student.ra" :disabled="studentIndex !== i" style="width: 60px">
                  </div>
                </div>
              </td>
              <td>
                <div class="input-list">
                  <div>
                    <label>Série:</label>
                    <select v-model="student.degreeId" :disabled="studentIndex !== i" class="select-medium">
                      <option :value="null">Série</option>
                      <option v-for="degree in degrees" :key="degree.id" :value="degree.id">{{ degree.name }}</option>
                    </select>
                  </div>
                  <div>
                    <label>Classe</label>
                    <select v-model="student.classId" :disabled="studentIndex !== i" class="select-small">
                      <option :value="null">Classe</option>
                      <option v-for="schoolClass in classes" :key="schoolClass.id" :value="schoolClass.id">{{ schoolClass.name }}</option>
                    </select>
                  </div>
                </div>
              </td>
              <td style="max-width: 30px !important; display: flex; align-items: flex-end;">
                <div>
                  <div class="ico-buttons">
                    <div @click="editStudent(i)">
                      <EditIcon class="icon" />
                    </div>
                    <div @click="remove(i)">
                      <TrashIcon class="icon" />
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <div v-else class="register">
      <div>
        <label>Nome do Aluno:</label>
        <input v-model="name" />
      </div>
      <div>
        <label>RA:</label>
        <input v-model="ra" :disabled="edit ==='edit'" />
      </div>
      <div>
        <label>Série:</label>
        <select v-model="studentClass" :disabled="edit==='edit'" class="select-medium">
          <option :value="null">Série</option>
          <option v-for="schoolClass in classes" :key="schoolClass.id" :value="schoolClass.id">{{ schoolClass.name }}</option>
        </select>
      </div>
      <div>
        <label>Classe:</label>
        <select v-model="studentDegree">
          <option :value="null">Classe</option>
          <option v-for="degree in degrees" :key="degree.id" :value="degree.id">{{ degree.name }}</option>
        </select>
      </div>
      <div style="display: flex; justify-content: center;">
        <span v-if="error.includes('emptyFields')" :class="{ 'error' : error.includes('emptyFields') }">Um ou mais campos estão vazios</span>
      </div>
      <div class="register-buttons">
        <div @click="save" style="margin-right: 10px;">
          <SaveIcon class="icon" />
        </div>
        <div @click="clean">
          <CancelIcon class="icon" />
        </div>
      </div>
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
      error: [],
      studentIndex: false,
      filterOptions: false,
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
      if (!this.name || !this.ra || !this.studentDegree || !this.studentClass) return this.error.push('emptyFields')
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

<style>
input:focus, select:focus{
  outline: none;
}

#students {
  padding: 25px;
}

@media (max-width: 768px) {
  #students {
    max-width: 500px;
  }
  .ico-buttons {
    flex-flow: column;
    align-items: flex-end;
    max-width: 30px;
    justify-content: flex-end;
  }
  .icon {
    margin-bottom: 5px;
  }
  .input-list {
    flex-flow: column;
  }
  .tr-input {
    max-width: 330px;
  }
  .register {
    align-items: inherit !important;
  }
  
}

.students-show > div {
  margin-top: 5px;
  margin: 0px 7px;
}

select {
  border: 1px solid;
  border-radius: 8px;
  padding-left: 1px;
}

select:disabled {
  background: #e8e8e8c5;
}

input:disabled {
  background: #e8e8e871;
}

.select-small {
  width: 70px;
}

.select-medium {
  width: 150px;
}

input {
  width: 120px;
  border: 1px solid;
  border-radius: 8px;
  padding-left: 5px;
}

.ico-buttons {
  display: flex; 
  align-items: normal;
  height: 100%
}

td > div > div {
  margin-right: 30px;
}

.icon {
  width: 25px; 
  height: 25px; 
  cursor: pointer;
  margin-right: 5px;
}

.register > div {
  margin-bottom: 10px;
  min-width: 250px;
}

.input-list {
  display: flex;
  justify-content: center;
  align-items: baseline;
}

.tr-input {
  display: flex;
  justify-content: space-between;
  width: 550px;
}

.register-buttons {
  margin: 10px 0px 0px 0px;
  display: flex;
  justify-content: center;
}

.register {
  margin-top: 20px; 
  display: flex; 
  flex-flow: column;
  justify-content: center;
  align-items: center;
}

</style>
