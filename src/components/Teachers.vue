<template>
  <div>
    <div>
      <h1>Professores</h1>
      <div v-if="list">
        <label>Filtro</label>
        <div class="filter">
          <label>Série</label>
          <select v-model="degreeFilter">
            <option :value="null">Série</option>
            <option v-for="degree in degrees" :key="degree.id" :value="degree.id">{{ degree.name }}</option>
          </select>
          <label>Classe</label>
          <select v-model="classFilter">
            <option :value="null">Classe</option>
            <option v-for="schoolClass in classes" :key="schoolClass.id" :value="schoolClass.id">{{ schoolClass.name }}</option>
          </select>
        </div>
        <Loading v-if="loading" />
        <div v-else class="form-list">
          <div>
            <button @click="newRelationship">Novo</button>
          </div>
          <table>
            <tr>
              <th>Nome do professor</th>
              <th>Matéria</th>
            </tr>
            <tr v-for="(relationship, i) in filteredRelationships" :key="`${relationship.teacherName}${relationship.id}${i}`">
              <td>{{ relationship.teacherName }}</td>
              <td>{{ relationship.matterName }}</td>
              <td>
                <button @click="edit(relationship)">Mais</button>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div v-else>
        <div v-if="newRegister">
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
            <label>Séries</label>
            <select v-model="newDegree">
              <option :value="null">Séries</option>
              <option v-for="degree in degrees" :key="degree.id" :value="degree.id">{{ degree.name }}</option>
            </select>
            <button v-if="newDegree && newClasses.length > 0" @click="addDegree">Adicionar</button>
            <div v-if="newDegree">
              <select v-model="newClass">
                <option :value="null">Classes</option>
                <option v-for="grade in classes" :key="grade.id" :value="grade">{{ grade.name }}</option>
              </select>
              <button @click="addGrade">Adicionar</button>
              <div v-for="(grade, i) in newClasses" :key="grade.id">
                <label @click="removeClass(i)">{{ grade.name }} - X</label>
              </div>
            </div>
            <div v-for="(degree, i) in newDegrees" :key="degree.id">
              <label @click="removeDegree(i)">{{ degree }} - X</label>
            </div>
          </div>
          <button @click="save">Salvar</button>
          <button @click="cancel">Cancelar</button>
        </div>
        <div v-else>
          <div>
            <label>Nome do professor</label>
            {{ relationship.teacherName }}
          </div>
          <div>
            <label>Nome da matéria</label>
            {{ relationship.matterName }}
          </div>
          <h4>Séries em que leciona</h4>
          <div v-if="relationship.degrees">
            <div v-for="degree in relationship.degrees" :key="degree.id">
              <div>
                {{ degree.degreeName }}
                <div v-if="degree.classes">
                  <h5>Classes</h5>
                  <div v-for="classRe in degree.classes" :key="classRe.id">
                    <select v-if="classRe.classPosition" v-model="classRe.classPosition" disabled>
                      <option v-for="(schoolClass, i) in classes" :key="i" :value="schoolClass.id">{{ schoolClass.name }}</option>
                    </select>
                    <select v-else v-model="classRe.classId" disabled>
                      <option v-for="(schoolClass, i) in classes" :key="i" :value="schoolClass.id">{{ schoolClass.name }}</option>
                    </select>
                  </div>
                </div>
                <button @click="getStudentDegree(degree.degreeId)">Procurar</button>
                <div>
                  Estudantes desta matéria
                  <table>
                    <tr v-for="(student, i) in studentsByDegree(degree.degreeId)" :key="`${student}${i}`">
                      <td>{{ student.name }}</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <button @click="relationship = null; list = true">Voltar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Teachers',
  props: ['importStudents', 'importClasses', 'importDegrees', 'importRelationships', 'importTeachers', 'importMatters'],
  data () {
    return {
      loading: false,
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
      newRegister: false
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
    getStudentDegree (degree) {
      let students = this.students.filter(x => x.degreeId === degree)
      return students
    },
    studentsByDegree (i) {
      return this.getStudentDegree(i)
    },
    newRelationship () {
      this.newRegister = true
      this.list = false
    },
    save () {
      if (!this.newTeacher || !this.newMatter || this.newDegrees.length === 0) return false
      const relationship = {
        'id': this.getLastId() + 1,
        'teacherId': this.newTeacher,
        'matterId': this.newMatter,
        'degrees': this.newDegrees
      }
      this.relationships.push(relationship)
      this.newRegister = false
      this.list = true
      this.clean()
    },
    cancel () {
      this.clean()
      this.newRegister = false
      this.list = true
    },
    clean () {
      this.newDegrees = []
      this.newMatter = null
      this.newTeacher = null
      this.degreeFilter = null
      this.classFilter = null
    },
    addGrade () {
      if (this.newClasses.includes(this.newClass) || !this.newClass) return false
      const classObj = {
        'classId': this.newClass.id
      }
      this.newClasses.push(classObj)
    },
    addDegree () {
      if (!this.newDegree) return false
      const degreeObj = {
        'degreeId': this.newDegree,
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
