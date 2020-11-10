import Vue from 'vue'
import App from './App.vue'
import Students from './components/Students'
import Chart from './components/Chart'
import Home from './components/Home'
import Relationships from './components/Relationships'
import VueGoogleCharts from 'vue-google-charts'

// Icons import
import vueIcon from './icon/VueIcon'
import jsIcon from './icon/JsIcon'
import googleIcon from './icon/GoogleIcon'
import editIcon from './icon/EditIcon'
import trashIcon from './icon/TrashIcon'
import saveIcon from './icon/SaveIcon'
import cancelIcon from './icon/CancelIcon'
import plusIcon from './icon/PlusIcon'
import deleteItemIcon from './icon/DeleteItemIcon'
import studentsIcon from './icon/StudentsIcon'
import backArrowIcon from './icon/BackArrowIcon'

Vue.use(VueGoogleCharts)

Vue.config.productionTip = false
Vue.component('Students', Students)
Vue.component('Chart', Chart)
Vue.component('Home', Home)
Vue.component('Relationships', Relationships)

// Icons
Vue.component('VueIcon', vueIcon)
Vue.component('JsIcon', jsIcon)
Vue.component('GoogleIcon', googleIcon)
Vue.component('EditIcon', editIcon)
Vue.component('TrashIcon', trashIcon)
Vue.component('SaveIcon', saveIcon)
Vue.component('CancelIcon', cancelIcon)
Vue.component('PlusIcon', plusIcon)
Vue.component('DeleteItemIcon', deleteItemIcon)
Vue.component('StudentsIcon', studentsIcon)
Vue.component('BackArrowIcon', backArrowIcon)

new Vue({
  render: h => h(App),
}).$mount('#app')
