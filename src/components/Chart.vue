<template>
  <div>
    <Loading v-if="loading" />
    <div v-else>
      <GChart
        v-if="displayChart && students"
        type="ColumnChart"
        :data="chartData"
        :options="options"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Chart',
  props: ['students', 'degree', 'showChart'],
  data () {
    return {
      chartData: [],
      displayChart: false,
      loading: true,
      options: {
        'title': 'Quantidade de alunos por série',
        'width': 1000,
        'height': 300
      }
    }
  },
  beforeMount () {
    this.getData()
    this.loading = false
  },
  methods: {
    getData () {
      this.chartData = []
      this.chartData.push(['Série', 'Quantidade de alunos'])
      if (this.students) {
        const filterData = this.students.map(x => {
          let data = []
          this.degree.map(y => {
            if (x.degreeId === y.id) {
              data.push(y.name)
            }
          })
          return data
        })
        const count = []
        filterData.forEach(x => {
          count[x] = (count[x] || 0) + 1
        })
        for (let x in count) {
          this.chartData.push([x, count[x]])
        }
      }
      this.displayChart = this.showChart
    }
  }
}
</script>

<style scoped>
.chart {
  max-width: 95%;
  max-height: 80%;
}
</style>