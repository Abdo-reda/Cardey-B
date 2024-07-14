import './styles/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './plugins/router';
import webRTC from './plugins/webRTC';

const app = createApp(App);

app.use(router);
app.use(webRTC);

app.mount('#app');
