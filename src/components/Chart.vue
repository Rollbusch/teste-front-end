<template>
  <div id="chart">
    <div v-if="displayChart && students" class="chart">
      <GChart
        type="PieChart"
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
      options: {
        backgroundColor:'transparent',
        width: '350',
        height: '350'
      }
    }
  },
  beforeMount () {
    this.getData()
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
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

@media (max-width: 768px) {
  .chart {
    max-width: 344px;
  }
}

</style>