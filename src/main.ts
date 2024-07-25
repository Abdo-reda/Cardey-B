import './styles/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './plugins/router';
import webRTC from './plugins/webRTC';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue';
import vitePWA from './plugins/vitePWA';

const app = createApp(App);

app.use(vitePWA);
app.use(router);
app.use(webRTC);
app.use(autoAnimatePlugin);

app.mount('#app');
