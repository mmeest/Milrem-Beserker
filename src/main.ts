import { createApp } from 'vue'
import App from './App.vue'
import Vue3Toastify from 'vue3-toastify'
//import * as L from 'leaflet';
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'
import './style.css'
import 'leaflet/dist/leaflet.css'
import 'vue3-toastify/dist/index.css'

const app = createApp(App)

app.use(Vue3Toastify, {
    autoClose: 3000,
    // limit: 2,
    position: 'top-right',
    toastClassName: 'toast-message'
})

//app.use(L)
app.component('LMap', LMap)
app.component('LTileLayer', LTileLayer)
app.component('LMarker', LMarker)

app.mount('#app')