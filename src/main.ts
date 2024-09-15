import './styles/main.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './plugins/router';
import webRTC from './plugins/webRTC';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue';
import vitePWA from './plugins/vitePWA';
import sessionState from './plugins/sessionState';

const app = createApp(App);

app.use(vitePWA);
app.use(router);
app.use(webRTC);
app.use(sessionState);
app.use(autoAnimatePlugin);

app.mount('#app');
