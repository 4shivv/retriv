import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Create the Vue app
const app = createApp(App);

// Use store plugin
app.use(store);

// Wait for Firebase auth to initialize before mounting the app
// and setting up the router
let appMounted = false;
onAuthStateChanged(auth, user => {
  // Update the Vuex store with user information
  if (user) {
    // User is signed in
    store.dispatch('auth/setUser', {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    });
    
    // If we're on the home page or another public page, redirect to dashboard
    const currentPath = window.location.pathname;
    if (currentPath === '/' || 
        currentPath === '/about' || 
        currentPath === '/pricing' || 
        currentPath === '/blog' ||
        currentPath === '/faq' ||
        currentPath === '/terms' ||
        currentPath === '/privacy' ||
        currentPath === '/contact' ||
        currentPath === '/careers' ||
        currentPath === '/mobile-app') {
      router.push('/dashboard');
    }
  } else {
    // User is signed out
    store.dispatch('auth/clearUser');
  }
  
  // Mount the app if it hasn't been mounted yet
  if (!appMounted) {
    // Use router after auth is initialized
    app.use(router);
    app.mount('#app');
    appMounted = true;
  }
});