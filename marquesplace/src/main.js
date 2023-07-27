import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import creditCardPlugin from "@/plugin/CreditCardPlugin";

const app = createApp(App)

app.use(creditCardPlugin, {
    PK: import.meta.env.VITE_KAMALPAY_PK,
    SK: import.meta.env.VITE_KAMALPAY_SK
})
app.use(router)
app.component('VueDatePicker', VueDatePicker)

app.mount('#app')
