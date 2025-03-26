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
import { onMounted } from 'vue';
import { useStore } from 'vuex';
import AppNavbar from '@/components/ui/Navbar.vue';
import AppFooter from '@/components/ui/Footer.vue';

export default {
  name: 'App',
  components: {
    AppNavbar,
    AppFooter
  },
  
  setup() {
    const store = useStore();
    
    onMounted(() => {
      // Initialize auth state
      store.dispatch('auth/initAuth');
    });
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