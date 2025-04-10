<template>
  <div id="app" :class="{ 'dark-theme': darkMode, 'with-sidebar': isAuthenticated, 'sidebar-collapsed': sidebarCollapsed }">
    <AppSidebar v-if="isAuthenticated" @sidebar-toggle="handleSidebarToggle" @open-study-card-modal="openStudyCardModal" @open-practice-test-modal="openPracticeTestModal" />
    <div class="main-container" :class="{ 'with-sidebar': isAuthenticated }">
      <AppNavbar @open-study-card-modal="openStudyCardModal" @open-practice-test-modal="openPracticeTestModal" />
      <main class="app-main">
        <router-view />
      </main>
    </div>
    <AppFooter />
    
    <!-- Study Card Modal -->
    <StudyCardModal 
      :is-open="showStudyCardModal"
      @close="closeStudyCardModal"
      @select-option="handleStudyCardOption"
    />
    
    <!-- Global Modals Component -->
    <GlobalModals />
  </div>
</template>

<script>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import AppNavbar from '@/components/ui/Navbar.vue';
import AppSidebar from '@/components/ui/Sidebar';
import AppFooter from '@/components/ui/Footer.vue';
import StudyCardModal from '@/components/study/StudyCardModal.vue';
import GlobalModals from '@/components/modals/GlobalModals.vue';

export default {
  name: 'App',
  components: {
    AppNavbar,
    AppSidebar,
    AppFooter,
    StudyCardModal,
    GlobalModals
  },
  
  setup() {
    // Auth state is initialized in main.js before mounting
    const store = useStore();
    const router = useRouter();
    const sidebarCollapsed = ref(false);
    const showStudyCardModal = ref(false);
    
    const isAuthenticated = computed(() => {
      return store.getters['auth/isAuthenticated'];
    });
    
    // Handle sidebar toggle event from sidebar component
    const handleSidebarToggle = (collapsed) => {
      sidebarCollapsed.value = collapsed;
    };
    
    // Initialize sidebar state from localStorage
    onMounted(() => {
      // Load sidebar state from localStorage
      const savedState = localStorage.getItem('sidebar-collapsed');
      if (savedState !== null) {
        sidebarCollapsed.value = savedState === 'true';
      }
      
      // Listen for the custom practice test modal event
      window.addEventListener('open-practice-test-modal', () => {
        openPracticeTestModal();
      });
    });
    
    // Cleanup custom event listener
    onBeforeUnmount(() => {
      window.removeEventListener('open-practice-test-modal', openPracticeTestModal);
    });
    
    // Watch for changes in localStorage outside of this component
    window.addEventListener('storage', (event) => {
      if (event.key === 'sidebar-collapsed') {
        sidebarCollapsed.value = event.newValue === 'true';
      }
    });
    
    // Study Card Modal functions
    const openStudyCardModal = () => {
      showStudyCardModal.value = true;
    };
    
    const closeStudyCardModal = () => {
      showStudyCardModal.value = false;
    };
    
    const handleStudyCardOption = (option) => {
      if (option === 'manual') {
        router.push('/study/create');
      } else if (option === 'ai') {
        router.push('/study/create-with-ai');
      }
    };
    
    // Practice Test Modal functions
    const openPracticeTestModal = () => {
      store.dispatch('modals/openPracticeTestModal');
    };
    
    return {
      isAuthenticated,
      sidebarCollapsed,
      showStudyCardModal,
      handleSidebarToggle,
      openStudyCardModal,
      closeStudyCardModal,
      handleStudyCardOption,
      openPracticeTestModal
    };
  }
}
</script>

<style>
@import './assets/css/base.css';
@import './assets/css/components.css';

/* Main container that holds navbar and content */
.main-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

/* When the sidebar is present, adjust main container */
.main-container.with-sidebar {
  margin-left: 220px;
  width: calc(100% - 220px);
  transition: margin-left var(--transition-normal), width var(--transition-normal);
}

/* When the sidebar is collapsed */
#app.sidebar-collapsed .main-container.with-sidebar {
  margin-left: 64px;
  width: calc(100% - 64px);
}

/* Fix z-index to ensure proper layering of navbar and sidebar */
#app .navbar-wrapper {
  z-index: var(--z-fixed); /* Use the standard fixed z-index */
}

/* Add shadow to sidebar only on mobile to avoid double shadow with navbar */
@media (min-width: 769px) {
  #app.with-sidebar .navbar-wrapper {
    box-shadow: none;
    border-bottom: 1px solid var(--neutral-200);
  }
}

.app-main {
  flex: 1;
  min-height: calc(100vh - 60px); /* Account for navbar height */
  padding: 0 1rem 1rem 1rem;
}

/* Remove the old sidebar padding approach */
/* .app-main.with-sidebar {
  padding-left: 250px;
  transition: padding-left var(--transition-normal);
} */

/* Adjust navbar for the new layout */
#app .navbar-wrapper {
  position: sticky;
  top: 0;
  width: 100%;
  z-index: var(--z-fixed);
}

/* No need for these anymore since we're using margin on the container */
/* #app.with-sidebar .navbar-wrapper {
  padding-left: 250px;
  transition: padding-left var(--transition-normal);
  box-shadow: var(--shadow-sm);
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
} */

/* #app.sidebar-collapsed .app-main.with-sidebar {
  padding-left: 70px;
}

#app.sidebar-collapsed .navbar-wrapper {
  padding-left: 70px;
} */

/* Mobile styles */
@media (max-width: 768px) {
  .main-container.with-sidebar {
    margin-left: 0;
    width: 100%;
  }
  
  #app.sidebar-collapsed .main-container.with-sidebar {
    margin-left: 0;
    width: 100%;
  }
  
  /* Add padding at the top to account for navbar */
  .app-main {
    padding-top: 1.5rem;
  }
  
  /* Ensure navbar stays above sidebar on mobile */
  #app .navbar-wrapper {
    z-index: calc(var(--z-fixed) + 1);
  }
}
</style>