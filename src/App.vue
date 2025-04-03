<template>
  <div id="app">
    <AppNavbar />
    
    <main class="app-main">
      <router-view />
    </main>
    
    <AppFooter />
  </div>
</template>

<script>
// No store import needed
import AppNavbar from '@/components/ui/Navbar.vue';
import AppFooter from '@/components/ui/Footer.vue';

export default {
  name: 'App',
  components: {
    AppNavbar,
    AppFooter
  },
  
  setup() {
    // Auth state is initialized in main.js before mounting
    // No need to dispatch auth/initAuth here
  }
}
</script>

<style>
@import './assets/css/base.css';
@import './assets/css/components.css';

.app-main {
  min-height: calc(100vh - 200px);
}
</style>