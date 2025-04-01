<template>
  <button 
    @click="toggleTheme" 
    class="theme-toggle"
    :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
    aria-label="Toggle dark/light mode"
  >
    <!-- Sun icon for light mode -->
    <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sun-icon">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
    
    <!-- Moon icon for dark mode -->
    <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="moon-icon">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  </button>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'ThemeToggle',
  setup() {
    const isDarkMode = ref(false);
    
    // Function to toggle theme
    const toggleTheme = () => {
      isDarkMode.value = !isDarkMode.value;
      if (isDarkMode.value) {
        document.documentElement.classList.add('dark-theme');
        document.documentElement.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark-theme');
        document.documentElement.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
      }
    };
    
    // Initialize theme based on localStorage or system preference
    onMounted(() => {
      // Check localStorage first
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        isDarkMode.value = savedTheme === 'dark';
      } else {
        // If no preference in localStorage, check system preference
        isDarkMode.value = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      
      // Apply theme
      if (isDarkMode.value) {
        document.documentElement.classList.add('dark-theme');
      } else {
        document.documentElement.classList.add('light-theme');
      }
      
      // Listen for system preference changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        // Only update if user hasn't set a preference
        if (!localStorage.getItem('theme')) {
          isDarkMode.value = e.matches;
          if (isDarkMode.value) {
            document.documentElement.classList.add('dark-theme');
            document.documentElement.classList.remove('light-theme');
          } else {
            document.documentElement.classList.remove('dark-theme');
            document.documentElement.classList.add('light-theme');
          }
        }
      });
    });
    
    return {
      isDarkMode,
      toggleTheme
    };
  }
};
</script>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background-color: var(--neutral-100);
  border: 1px solid var(--neutral-200);
  color: var(--neutral-700);
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
}

.theme-toggle:hover {
  color: var(--primary-color);
  background-color: var(--neutral-50);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.sun-icon, .moon-icon {
  transition: all var(--transition-normal);
}

/* Animation for icon transition */
.sun-icon {
  animation: rotateIn 0.5s var(--transition-bounce);
}

.moon-icon {
  animation: rotateIn 0.5s var(--transition-bounce);
}

@keyframes rotateIn {
  from {
    transform: rotate(-45deg) scale(0.5);
    opacity: 0;
  }
  to {
    transform: rotate(0) scale(1);
    opacity: 1;
  }
}
</style>