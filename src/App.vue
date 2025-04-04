<template>
  <div id="app" :class="{ 'with-sidebar': isAuthenticated, 'sidebar-collapsed': sidebarCollapsed }">
    <AppNavbar v-if="!isAuthenticated" />
    <AppSidebar v-if="isAuthenticated" @sidebar-toggle="handleSidebarToggle" />
    
    <main class="app-main" :class="{ 'with-sidebar': isAuthenticated }">
      <router-view />
    </main>
    
    <AppFooter />
  </div>
</template>

<script>
import { computed, ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import AppNavbar from '@/components/ui/Navbar.vue';
import AppSidebar from '@/components/ui/Sidebar';
import AppFooter from '@/components/ui/Footer.vue';

export default {
  name: 'App',
  components: {
    AppNavbar,
    AppSidebar,
    AppFooter
  },
  
  setup() {
    // Auth state is initialized in main.js before mounting
    const store = useStore();
    const sidebarCollapsed = ref(false);
    
    const isAuthenticated = computed(() => {
      return store.getters['auth/isAuthenticated'];
    });
    
    // Handle sidebar toggle event from sidebar component
    const handleSidebarToggle = (collapsed) => {
      sidebarCollapsed.value = collapsed;
    };
    
    // Initialize sidebar state from localStorage
    onMounted(() => {
      const savedState = localStorage.getItem('sidebar-collapsed');
      if (savedState !== null) {
        sidebarCollapsed.value = savedState === 'true';
      }
    });
    
    // Watch for changes in localStorage outside of this component
    window.addEventListener('storage', (event) => {
      if (event.key === 'sidebar-collapsed') {
        sidebarCollapsed.value = event.newValue === 'true';
      }
    });
    
    return {
      isAuthenticated,
      sidebarCollapsed,
      handleSidebarToggle
    };
  }
}
</script>

<style>
@import './assets/css/base.css';
@import './assets/css/components.css';

.app-main {
  min-height: calc(100vh - 200px);
}

.app-main.with-sidebar {
  padding-left: 250px;
  transition: padding-left var(--transition-normal);
}

/* When the sidebar is collapsed */
#app.sidebar-collapsed .app-main.with-sidebar {
  padding-left: 70px;
}

/* Mobile styles */
@media (max-width: 768px) {
  .app-main.with-sidebar {
    padding-left: 0;
  }
  
  #app.sidebar-collapsed .app-main.with-sidebar {
    padding-left: 0;
  }
}
</style>