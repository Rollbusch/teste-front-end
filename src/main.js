import Vue from 'vue'
import App from './App.vue'
import Students from './components/Students'
import Loading from './Loading'
import Chart from './components/Chart'
import Home from './components/Home'
import Teachers from './components/Teachers'
import VueGoogleCharts from 'vue-google-charts'

// Icons import
import vueIcon from './icon/VueIcon'
import jsIcon from './icon/JsIcon'
import googleIcon from './icon/GoogleIcon'
import editIcon from './icon/EditIcon'
import trashIcon from './icon/TrashIcon'
import saveIcon from './icon/SaveIcon'

Vue.use(VueGoogleCharts)

Vue.config.productionTip = false
Vue.component('Students', Students)
Vue.component('Loading', Loading)
Vue.component('Chart', Chart)
Vue.component('Home', Home)
Vue.component('Teachers', Teachers)

// icons
Vue.component('VueIcon', vueIcon)
Vue.component('JsIcon', jsIcon)
Vue.component('GoogleIcon', googleIcon)
Vue.component('EditIcon', editIcon)
Vue.component('TrashIcon', trashIcon)
Vue.component('SaveIcon', saveIcon)

new Vue({
  render: h => h(App),
}).$mount('#app')
