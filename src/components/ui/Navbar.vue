<template>
  <header class="navbar-wrapper" :class="{ 'is-scrolled': scrolled }">
    <div class="navbar-container">
      <nav class="navbar">
        <div class="navbar-left">
          <template v-if="!isAuthenticated">
            <div class="navbar-brand">
              <router-link to="/" class="navbar-logo">
                <div class="logo-mark">
                <img src="/dog.png" alt="Retriv.ai" class="logo-image" />
                </div>
                <div class="logo-text">Retriv.ai</div>
              </router-link>
            </div>
            
            <ul class="navbar-links">
              <li class="nav-item">
                <router-link to="/about" class="nav-link" @click="closeMenu">About</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/pricing" class="nav-link" @click="closeMenu">Pricing</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/blog" class="nav-link" @click="closeMenu">Blog</router-link>
              </li>
            </ul>
          </template>
          
          <!-- For logged-in users, don't show any logo -->
          <template v-else>
            <div class="navbar-brand">
              <router-link to="/dashboard" class="navbar-logo">
                <!-- Logo removed as requested -->
              </router-link>
            </div>
          </template>
        </div>
          
          <!-- Center search input for logged in users -->
          <div class="navbar-center" v-if="isAuthenticated">
            <!-- Search Box (moved from dashboard) -->
            <div class="search-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Search materials..." 
                class="search-input"
                @input="handleSearch"
              >
            </div>
          </div>
          
          <div class="navbar-actions">
            <template v-if="!isAuthenticated">
              <router-link to="/login" class="btn btn-ghost" @click="closeMenu">Sign In</router-link>
              <router-link to="/register" class="btn btn-primary" @click="closeMenu">Get Started</router-link>
            </template>
            <template v-else>
              
              <!-- Add New Material Button (moved from dashboard) -->
              <button @click="handleAddNew" class="btn btn-primary add-new-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span class="btn-text">Add New</span>
              </button>
              
              <!-- User Menu Toggle (moved from sidebar) -->
              <div class="user-menu" v-click-outside="closeUserMenu">
                <button class="user-menu-toggle" @click="toggleUserMenu" :title="userEmail">
                  <div class="avatar">
                    {{ userInitials }}
                  </div>
                </button>
                <div class="user-dropdown" v-show="userMenuOpen">
                  <div class="user-dropdown-header">
                    <div class="avatar-large">{{ userInitials }}</div>
                    <div class="user-info">
                      <p class="user-email">{{ userEmail }}</p>
                      <p class="user-role">{{ userRole }}</p>
                    </div>
                  </div>
                  <div class="user-dropdown-body">
                    <router-link to="/dashboard" class="dropdown-item" @click="closeUserMenu">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="3" y1="9" x2="21" y2="9"></line>
                        <line x1="9" y1="21" x2="9" y2="9"></line>
                      </svg>
                      Dashboard
                    </router-link>
                    <router-link to="/profile" class="dropdown-item" @click="closeUserMenu">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      Profile
                    </router-link>
                    <div class="dropdown-divider"></div>
                    <button class="dropdown-item text-danger" @click="handleLogout">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </template>
          </div>
        
        <button class="menu-toggle" :class="{ 'is-active': menuOpen }" @click="toggleMenu" aria-label="Menu">
          <span class="hamburger"></span>
        </button>
      </nav>
    </div>
  </header>
</template>

<script>
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import AuthService from '@/services/auth.service';

export default {
  name: 'AppNavbar',
  directives: {
    'click-outside': {
      mounted(el, binding) {
        el._clickOutside = (event) => {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value(event);
          }
        };
        document.addEventListener('click', el._clickOutside);
      },
      unmounted(el) {
        document.removeEventListener('click', el._clickOutside);
      }
    }
  },
  
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const menuOpen = ref(false);
    const userMenuOpen = ref(false);
    const scrolled = ref(false);
    const searchQuery = ref('');
    
    // Check if on home page (but never for authenticated users)
    const isHomePage = computed(() => {
      // If user is authenticated, they shouldn't see the home page
      if (isAuthenticated.value) return false;
      return route.path === '/';
    });
    
    const isAuthenticated = computed(() => {
      return store.getters['auth/isAuthenticated'];
    });
    
    const userEmail = computed(() => {
      const user = store.getters['auth/user'];
      return user ? user.email : '';
    });
    
    const userInitials = computed(() => {
      const user = store.getters['auth/user'];
      if (!user || !user.email) return '';
      
      const email = user.email;
      const parts = email.split('@');
      return parts[0].substring(0, 2).toUpperCase();
    });
    
    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value;
      // Toggle the is-active class on the navbar-links element
      const navbarLinks = document.querySelector('.navbar-left .navbar-links');
      if (navbarLinks) {
        if (menuOpen.value) {
          navbarLinks.classList.add('is-active');
          document.body.classList.add('no-scroll');
        } else {
          navbarLinks.classList.remove('is-active');
          document.body.classList.remove('no-scroll');
        }
      }
    };
    
    const closeMenu = () => {
      if (menuOpen.value) {
        menuOpen.value = false;
        const navbarLinks = document.querySelector('.navbar-left .navbar-links');
        if (navbarLinks) {
          navbarLinks.classList.remove('is-active');
        }
        document.body.classList.remove('no-scroll');
      }
    };
    
    const toggleUserMenu = (event) => {
      event.stopPropagation();
      userMenuOpen.value = !userMenuOpen.value;
    };
    
    const closeUserMenu = () => {
      userMenuOpen.value = false;
    };
    
    const navigateToHomeWithHash = (hash) => {
      // If user is authenticated, redirect to dashboard instead
      if (isAuthenticated.value) {
        router.push('/dashboard');
        closeMenu();
        return;
      }
      
      if (isHomePage.value) {
        // If already on home page, just scroll to the section
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Navigate to home page with hash
        router.push({ path: '/', hash });
      }
      closeMenu();
    };
    
    const handleAddNew = () => {
      if (userMenuOpen.value) {
        closeUserMenu();
      }
      router.push('/dashboard?action=create');
    };
    
    // Handle search input changes
    const handleSearch = () => {
      // Emit a custom event for the search query
      // This will be captured by the dashboard component
      window.dispatchEvent(new CustomEvent('navbar-search', {
        detail: { query: searchQuery.value }
      }));
    };
    
    // Clear search when navigating
    watch(route, () => {
      searchQuery.value = '';
    });
    
    const userRole = computed(() => {
      return 'Member'; // This could be dynamic based on user roles in a real app
    });
    
    const handleLogout = async () => {
      try {
        await AuthService.logout();
        store.dispatch('auth/clearUser');
        closeMenu();
        closeUserMenu();
        router.push('/');
      } catch (err) {
        console.error('Logout failed:', err);
      }
    };
    
    const handleScroll = () => {
      scrolled.value = window.scrollY > 10;
    };
    
    onMounted(() => {
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Check initial scroll position
      
      // Handle hash navigation if coming from a different page
      if (route.hash) {
        setTimeout(() => {
          const element = document.querySelector(route.hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500); // Small delay to ensure page is loaded
      }
    });
    
    onBeforeUnmount(() => {
      window.removeEventListener('scroll', handleScroll);
    });
    
    return {
      isAuthenticated,
      userEmail,
      userInitials,
      userRole,
      menuOpen,
      userMenuOpen,
      scrolled,
      isHomePage,
      searchQuery,
      toggleMenu,
      closeMenu,
      toggleUserMenu,
      closeUserMenu,
      navigateToHomeWithHash,
      handleAddNew,
      handleLogout,
      handleSearch
    };
  }
}
</script>

<style scoped>
.navbar-container {
  width: 100vw;
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
  overflow: visible;
}

.navbar-wrapper {
  position: sticky;
  top: 0;
  left: 0;
  width: 100vw;
  max-width: 100%;
  z-index: var(--z-fixed);
  transition: all var(--transition-normal);
  padding: var(--spacing-1) 0;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  box-shadow: var(--shadow-sm);
}

.navbar-wrapper.is-scrolled {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  padding: var(--spacing-1) 0; /* Reduced padding when scrolled */
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 52px;
  padding: 0 var(--spacing-6);
  width: 100vw;
  max-width: 100%;
  position: relative;
}

.navbar-left {
  display: flex;
  align-items: center;
  height: 100%;
}

.navbar-brand {
  display: flex;
  align-items: center;
  height: 100%;
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  text-decoration: none;
  height: 100%;
}

.logo-mark {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-image {
  width: 2rem; /* Slightly smaller logo size */
  height: 2rem; /* Slightly smaller logo size */
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  object-fit: cover;
  transition: transform 0.3s ease;
}

.navbar-logo:hover .logo-image {
  transform: scale(1.05);
}

.logo-icon::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0) 60%
  );
  transform: rotate(30deg);
}

.logo-text {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-lg); /* Smaller font size */
  font-weight: var(--font-weight-bold);
  color: var(--neutral-900);
  letter-spacing: -0.01em;
  display: flex;
  align-items: center;
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: var(--spacing-6);
}

.navbar-links {
  display: flex;
  align-items: center;
  list-style: none;
  gap: var(--spacing-4);
  margin: 0;
  margin-left: var(--spacing-6);
  padding: 0;
  height: 100%;
}

.nav-item {
  height: 100%;
  display: flex;
  align-items: center;
}

.nav-link {
  position: relative;
  font-weight: var(--font-weight-medium);
  color: var(--neutral-700);
  text-decoration: none;
  padding: 0;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  height: 100%;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary-gradient);
  transition: width var(--transition-normal);
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--primary-color);
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

/* Add this new style to prevent router-link-active on hash links */
.no-active.router-link-active::after {
  width: 0 !important; /* Override the active indicator */
}
.no-active.router-link-active {
  color: var(--neutral-700) !important; /* Override the active text color */
}

/* But still allow hover to work */
.no-active:hover::after {
  width: 100% !important;
}
.no-active:hover {
  color: var(--primary-color) !important;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  height: 100%;
}

/* Center navbar section (slightly left of center) */
.navbar-center {
  position: absolute;
  left: 45%;
  transform: translateX(-50%);
  z-index: 10;
}

/* Search Box Styling */
.search-box {
  position: relative;
  width: 320px;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 0.75rem;
  transform: translateY(-50%);
  color: var(--neutral-500);
}

.search-input {
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: 1px solid var(--neutral-300);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  transition: all var(--transition-normal);
  background-color: var(--neutral-100);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
  background-color: white;
}

/* Add New Button Styling */
.add-new-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: 0.5rem 1rem;
  font-size: var(--font-size-sm);
  background-color: var(--primary-color);
  border-radius: var(--radius-md);
  border: none;
  color: white;
  font-weight: var(--font-weight-medium);
}

.add-new-btn .icon {
  transition: transform var(--transition-normal);
}

.add-new-btn:hover .icon {
  transform: rotate(90deg);
}

/* User Menu Styling */
.user-menu {
  position: relative;
  z-index: 1400;
}

.user-menu-toggle {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.user-menu-toggle .avatar {
  transition: all var(--transition-normal);
  border: 2px solid transparent;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: var(--primary-gradient);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
}

.user-menu-toggle:hover .avatar {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-light);
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 220px;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  z-index: 1500;
  animation: scaleIn 0.2s var(--transition-bounce);
  transform-origin: top right;
  overflow: hidden;
  border: 1px solid var(--neutral-200);
  max-height: calc(100vh - 80px);
  overflow-y: auto;
}

.user-dropdown-header {
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--neutral-200);
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.user-email {
  font-size: var(--font-size-sm);
  margin: 0;
  color: var(--neutral-600);
  font-weight: var(--font-weight-medium);
}

.user-dropdown-body {
  padding: var(--spacing-1);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: var(--spacing-3) var(--spacing-4);
  color: var(--neutral-700);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  transition: all var(--transition-fast);
  border-radius: var(--radius-md);
  margin: var(--spacing-1);
  text-align: left;
  background: none;
  border: none;
  width: calc(100% - var(--spacing-2));
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.dropdown-item:hover {
  background-color: var(--neutral-100);
  color: var(--primary-color);
}

.dropdown-item.text-danger {
  color: #ef4444;
}

.dropdown-item.text-danger:hover {
  background-color: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.dropdown-divider {
  height: 1px;
  margin: 0.5rem 0;
  background-color: var(--neutral-200);
}

.avatar-large {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background: var(--primary-gradient);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
}

.user-info {
  flex: 1;
}

/* Mobile Menu Toggle */
.menu-toggle {
  display: none;
  background: none;
  border: none;
  width: 2rem;
  height: 2rem;
  position: relative;
  cursor: pointer;
  z-index: 100;
}

.hamburger,
.hamburger::before,
.hamburger::after {
  position: absolute;
  width: 1.5rem;
  height: 2px;
  background-color: var(--neutral-800);
  border-radius: var(--radius-full);
  transition: all var(--transition-normal);
}

.hamburger {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.hamburger::before,
.hamburger::after {
  content: '';
  left: 0;
}

.hamburger::before {
  top: -6px;
}

.hamburger::after {
  bottom: -6px;
}

.menu-toggle.is-active .hamburger {
  background-color: transparent;
}

.menu-toggle.is-active .hamburger::before {
  top: 0;
  transform: rotate(45deg);
}

.menu-toggle.is-active .hamburger::after {
  bottom: 0;
  transform: rotate(-45deg);
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Added new navbar app title for logged-in users */
.navbar-app-title {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-800);
  margin-left: var(--spacing-4);
  display: flex;
  align-items: center;
  height: 100%;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .navbar-left {
    flex-grow: 1;
  }
  
  /* Only show menu toggle for non-authenticated users */
  .menu-toggle {
    display: none;
  }
  
  /* For non-authenticated users */
  :not(.with-sidebar) .navbar-links {
    display: none;
  }
  
  :not(.with-sidebar) .menu-toggle {
    display: block;
  }
  
  /* For authenticated users, ensure clean layout */
  .with-sidebar .navbar-wrapper {
    height: 60px;
  }
  
  .navbar-left .navbar-links, 
  .menu-toggle.is-active ~ .navbar-left .navbar-links {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 280px;
    background: white;
    flex-direction: column;
    align-items: flex-start;
    display: flex;
    justify-content: flex-start;
    padding: 5rem var(--spacing-6) var(--spacing-6);
    transform: translateX(100%);
    transition: transform var(--transition-normal) ease;
    box-shadow: var(--shadow-xl);
    z-index: 90;
    gap: var(--spacing-8);
    margin-left: 0;
    height: 100vh; /* Use full viewport height */
  }
  
  .navbar-left .navbar-links.is-active {
    transform: translateX(0);
  }
  
  .navbar-links .nav-item {
    width: 100%;
    height: auto; /* Reset height for mobile */
  }
  
  .nav-link {
    font-size: var(--font-size-lg);
    width: 100%;
    display: block;
    height: auto; /* Reset height for mobile */
    padding: var(--spacing-2) 0; /* Add padding for mobile */
  }
  
  .navbar-actions {
    flex-direction: column;
    width: 100%;
    gap: var(--spacing-3);
    height: auto; /* Reset height for mobile */
  }
  
  .navbar-actions .btn {
    width: 100%;
    justify-content: center;
  }
  
  .user-menu {
    align-self: flex-start;
  }
  
  .user-dropdown {
    position: absolute;
    left: 0;
    right: auto;
    transform-origin: top left;
  }
}
</style>