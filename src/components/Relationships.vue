<template>
  <div id="relationships">
    <h1 v-if="!newRegister">{{ list ? 'Relações' : 'Relação cadastrada' }}</h1>
    <h1 v-else>Cadastrar relação</h1>
    <div v-if="list" style="display:flex; justify-content: center; flex-flow: column; align-items: center">
      <div style="display: flex; margin-top: 25px; margin-bottom: 10px" >
        <button @click="newRelationship" style="margin-right: 25px" class="btn">Cadastrar</button>
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
          <select v-model="classFilter">
            <option :value="null">Classe</option>
            <option v-for="schoolClass in classes" :key="schoolClass.id" :value="schoolClass.id">{{ schoolClass.name }}</option>
          </select>
        </div>
      </div>
      <div class="form-list">
        <table>
          <tr v-for="(relationship, i) in filteredRelationships" :key="`${relationship.teacherName}${relationship.id}${i}`">
            <td style="display: flex; border-bottom: 1px solid; padding-bottom: 10px">
              <div style="margin-right: 20px">
                <label>Professor:</label>
                <input :value="relationship.teacherName" disabled>
              </div>
              <div>
                <label>Matéria:</label>
                <input :value="relationship.matterName" disabled>
              </div>
            </td>
            <td>
              <div @click="edit(relationship)" style="margin-left: 10px; cursor: pointer; display: flex; height: 100%; align-items: center;">
                <PlusIcon class="icon" />
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div v-else>
      <div v-if="newRegister" class="register">
        <div>
          <label>Professor:</label>
          <select v-model="newTeacher">
            <option :value="null">Professor</option>
            <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">{{ teacher.name }}</option>
          </select>
        </div>
        <div>
          <label>Matéria:</label>
          <select v-model="newMatter">
            <option :value="null">Matéria</option>
            <option v-for="matter in matters" :key="matter.id" :value="matter.id">{{ matter.name }}</option>
          </select>
        </div>
        <div>
          <label>Séries:</label>
          <div style="display: flex; align-items: center; height: 19px; align-items: center;">
            <select v-model="newDegree">
              <option :value="null">Séries</option>
              <option v-for="degree in degrees" :key="degree.id" :value="degree">{{ degree.name }}</option>
            </select>
            <div v-if="newDegree && newClasses.length > 0" @click="addDegree" style="margin-left: 10px">
              <PlusIcon class="icon" style="width: 25px" />
            </div>
          </div>
          <div v-if="newDegree" style="margin-top:5px">
            <div style="">
              <label>Classes</label>
              <div style="display: flex; ">
                <select v-model="newClass" style="height: 19px">
                  <option :value="null">Classes</option>
                  <option v-for="grade in classes" :key="grade.id" :value="grade">{{ grade.name }}</option>
                </select>
                <div @click="addGrade" style="display:inline; margin-left: 10px;">
                  <PlusIcon class="icon" style="width: 25px"/>
                </div>
              </div>
            </div>
            <div v-for="(grade, i) in newClasses" :key="grade.id">
              <label >{{ grade.className }} <div @click="removeClass(i)" style="display: inline; cursor: pointer"><DeleteItemIcon style="width: 20px" /></div></label>
            </div>
          </div>
          <label v-if="newDegrees.length > 0" style=" margin-top: 10px">Séries cadastradas:</label>
          <div v-for="(degree, i) in newDegrees" :key="degree.id">
            <label>
              {{ degree.degreeName }}:
              <label v-for="(grade, index) in degree.classes" :key="grade.id" style="display: inline"> {{ degree.classes.length -1 === index ? grade.className : `${grade.className},` }}</label>
              <div @click="removeDegree(i)" style="display: inline; cursor: pointer; margin-left: 5px"><DeleteItemIcon style="width: 20px" /></div>
            </label>
          </div>
        </div>
        <div style="display: flex; justify-content: center;">
          <span v-if="error.includes('degree')" :class="{ 'error' : error.includes('degree') }">Você já adicionou essa matéria</span>
          <span v-if="error.includes('grade')" :class="{ 'error' : error.includes('grade') }">Você já adicionou essa classe</span>
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
      <div v-else class="registered" style="display:flex; justify-content: center; flex-flow: column; align-items: center">
        <div style="margin-bottom: 5px">
          <label>Professor</label>
          <input :value="relationship.teacherName" disabled>
        </div>
        <div>
          <label>Matéria</label>
          <input :value="relationship.matterName" disabled>
        </div>
        <div v-if="relationship.degrees">
          <h4>Séries em que leciona</h4>
          <div v-for="degree in relationship.degrees" :key="degree.id" style="margin-top: 15px">
            <div>
              <label style="font-weight: 600">{{ degree.degreeName }}</label>
              <div v-if="degree.classes">
                <div style="display: flex">
                  <label>Classes:</label>
                  <div v-for="classRe in degree.classes" :key="classRe.id" style="display: inline">
                    <select v-if="classRe.classPosition" v-model="classRe.classPosition" class="selected-grades" disabled>
                      <option v-for="(schoolClass, i) in classes" :key="i" :value="schoolClass.id" >{{ degree.classes.length -1 === i ? schoolClass.name : `${schoolClass.name},` }}</option>
                    </select>
                    <select v-else v-model="classRe.classId" class="selected-grades" disabled>
                      <option v-for="(schoolClass, i) in classes" :key="i" :value="schoolClass.id">{{ degree.classes.length -1 === i ? schoolClass.name : `${schoolClass.name},` }}</option>
                    </select>
                  </div>
                </div>
              </div>
              <table v-if="showStudentsByDegree">
                <div class="student-list">
                  <tr v-for="(student, i) in getStudentDegree(degree.degreeId)" :key="`${student}${i}`">
                    <td>{{ student.name }}</td>
                  </tr>
                </div>
              </table>
            </div>
          </div>
          </div>
          <div @click="showStudentsByDegree = !showStudentsByDegree" style="display: flex; align-items: center; cursor: pointer">
            <StudentsIcon style="width: 50px" /> 
            <label style="margin-left: 10px">Trazer estudantes de cada matéria</label>
          </div>
          <div @click="relationship = null; list = true" style="cursor: pointer">
            <BackArrowIcon style="width: 30px"/>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Relationships',
  props: ['importStudents', 'importClasses', 'importDegrees', 'importRelationships', 'importTeachers', 'importMatters'],
  data () {
    return {
      students: this.importStudents,
      degrees: this.importDegrees,
      classes: this.importClasses,
      relationships: this.importRelationships,
      teachers: this.importTeachers,
      matters: this.importMatters,
      list: true,
      degreeFilter: null,
      classFilter: null,
      teacherIndex: null,
      teacherName: '',
      relationship: null,
      newTeacher: null,
      newMatter: null,
      newDegrees: [],
      newDegree: null,
      newClasses: [],
      newClass: null,
      newRegister: false,
      filterOptions: false,
      gradeName: null,
      error: [],
      showStudentsByDegree: false
    }
  },
  computed: {
    filteredRelationships () {
      let relationships = this.filter(this.relationships)
      return relationships
    }
  },
  mount () {
    this.filteredRelationships()
  },
  methods: {
    edit (relationship) {
      this.list = false
      this.relationship = relationship
    },
    filter (relationshipsArr) {
      let relationships = relationshipsArr
      relationships.forEach(x => {
        this.teachers.forEach(y => {
          if (x.teacherId === y.id) {
            x.teacherName = y.name
          }
        })
        x.degrees.forEach(y => {
          this.degrees.forEach(z => {
            if (y.degreeId === z.id) {
              y.degreeName = z.name
            }
          })
        })
        this.matters.forEach(y => {
          if (x.matterId === y.id) {
            x.matterName = y.name
          }
        })
      })
      if (this.classFilter) {
        let result = []
        relationships.forEach(x => {
          x.degrees.forEach(y => {
            y.classes.forEach(z => {
              if (z.classPosition === this.classFilter) {
                if (!(result.includes(x))) result.push(x)
              }
            })
          })
          return result
        })
        relationships = result
      }
      if (this.degreeFilter) {
        let result = []
        relationships.filter(x => {
          x.degrees.forEach(y => {
            if (y.degreeId === this.degreeFilter) {
              if (!(result.includes(x))) result.push(x)
            }
          })
          return result
        })
        relationships = result
      }
      return relationships
    },
    getStudentDegree (id) {
      let students = this.students.filter(x => x.degreeId === id)
      return students
    },
    newRelationship () {
      this.newRegister = true
      this.list = false
    },
    save () {
      if (!this.newTeacher || !this.newMatter || this.newDegrees.length === 0) return this.error.push('emptyFields')
      const relationship = {
        'id': this.getLastId() + 1,
        'teacherId': this.newTeacher,
        'matterId': this.newMatter,
        'degrees': this.newDegrees
      }
      this.relationships.push(relationship)
      this.clean()
    },
    cancel () {
      this.clean()
    },
    clean () {
      this.error = []
      this.newDegree = null
      this.newClasses = []
      this.newClass = null
      this.newDegrees = []
      this.newMatter = null
      this.newTeacher = null
      this.degreeFilter = null
      this.classFilter = null
      this.newRegister = false
      this.list = true
    },
    addGrade () {
      this.error = []
      if (!this.newClass) return false
      if (this.newClasses.filter(x => x.classId === this.newClass.id).length > 0) return this.error.push('grade')
      const classObj = {
        'classId': this.newClass.id,
        'className': this.newClass.name
      }
      this.newClasses.push(classObj)
    },
    addDegree () {
      this.error = []
      if (!this.newDegree) return false
      if (this.newDegrees.filter(x => x.degreeId === this.newDegree.id).length > 0) return this.error.push('degree')
      const degreeObj = {
        'degreeId': this.newDegree.id,
        'degreeName': this.newDegree.name,
        'classes': this.newClasses
      }
      this.newDegrees.push(degreeObj)
      this.newDegree = null; this.newClass = null; this.newClasses = []
    },
    removeClass (index) {
      this.newClasses.splice(index, 1)
    },
    removeDegree (index) {
      this.newDegrees.splice(index, 1)
    },
    getLastId () {
      if (this.relationships.length === 0) return 1
      const lastId = this.relationships.sort((a, b) => {
        return a.id - b.id
      })
      return lastId[lastId.length - 1].id
    }
  }
}
</script>

<style scoped>
.icon {
  width: 25px; 
  height: 25px;
  margin-right: 5px;
}

#relationships {
  padding: 25px;
}

.selected-grades {
  border: none; 
  background: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  text-indent: 1px;
  text-overflow: '';
  color: black;
  font-weight: 700;
}

.student-list {
  width: 200px;
  background: #fcf7f0;
  border: 1px solid black;
  border-radius: 0px 0px 20px 0px;
  padding: 5px;
}
</style>