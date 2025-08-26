import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './styles.css'

// Naive UI
import naive from 'naive-ui'

const app = createApp(App)
app.use(createPinia())
app.use(naive)
app.mount('#app')