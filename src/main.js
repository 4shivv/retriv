import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Create the Vue app
const app = createApp(App);

// Use plugins
app.use(store);
app.use(router);

// Initialize auth state before mounting the app
// This ensures auth state is available immediately on page load
onAuthStateChanged(auth, user => {
  // Update the Vuex store with user information
  if (user) {
    store.dispatch('auth/setUser', {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    });
  } else {
    store.dispatch('auth/clearUser');
  }
  
  // Only mount the app once we have the initial auth state
  // This prevents flash of login screen before redirect
  if (!app._container) {
    app.mount('#app');
  }
});