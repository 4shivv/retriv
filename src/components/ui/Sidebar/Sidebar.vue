<template>
  <div>
    <!-- Mobile Sidebar Toggle Button for small screens -->
    <button v-if="isMobile" class="mobile-sidebar-toggle" @click="toggleMobileSidebar">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>
    
    <!-- Sidebar Backdrop for mobile -->
    <div v-if="isMobile && isMobileSidebarOpen" class="sidebar-backdrop" @click="closeMobileSidebar"></div>
    
    <aside class="sidebar" :class="{ 'is-collapsed': collapsed, 'is-open': isMobileSidebarOpen }">
      <!-- Sidebar Header with Logo -->
    <div class="sidebar-header">
      <router-link :to="'/dashboard'" class="sidebar-logo">
        <div class="logo-mark">
          <img src="/dog.png" alt="Retriv.ai" class="logo-image" />
        </div>
        <div class="logo-text" v-if="!collapsed">Retriv.ai</div>
      </router-link>
      <button @click="toggleCollapse" class="collapse-toggle">
        <svg v-if="collapsed" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="13 17 18 12 13 7"></polyline>
          <polyline points="6 17 11 12 6 7"></polyline>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="11 17 6 12 11 7"></polyline>
          <polyline points="18 17 13 12 18 7"></polyline>
        </svg>
      </button>
    </div>
    
    <!-- Main Navigation -->
    <nav class="sidebar-nav">
      <ul class="nav-items">
        <li class="nav-item">
          <router-link to="/dashboard" class="nav-link" title="Dashboard">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
            <span v-if="!collapsed">Dashboard</span>
          </router-link>
        </li>
        
        
        <!-- Folder Links -->
        <li class="nav-section">
          <div class="nav-section-title" v-if="!collapsed">Folders</div>
          <!-- Create New Folder Button -->
          <button @click="openCreateFolderModal" class="nav-link add-folder-button" title="Create New Folder">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v11z"></path>
              <line x1="12" y1="11" x2="12" y2="17"></line>
              <line x1="9" y1="14" x2="15" y2="14"></line>
            </svg>
            <span v-if="!collapsed">Create New Folder</span>
          </button>
          <ul class="folder-list" v-if="folders.length > 0">
            <li v-for="folder in folders" :key="folder.id" class="nav-item">
              <router-link :to="'/folder/' + folder.id" class="nav-link folder-link" :title="folder.name">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v11z"></path>
                </svg>
                <span v-if="!collapsed">{{ folder.name }}</span>
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
    
    <!-- User Section at Bottom -->
    <div class="sidebar-footer">
      <div class="user-section" v-click-outside="closeUserMenu">
        <button class="user-menu-toggle" @click="toggleUserMenu" :title="userEmail">
          <div class="avatar">
            {{ userInitials }}
          </div>
          <div class="user-info" v-if="!collapsed">
            <p class="user-email">{{ userEmail }}</p>
            <p class="user-role">{{ userRole }}</p>
          </div>
          <svg v-if="!collapsed" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="{'rotate-180': userMenuOpen}">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        
        <div class="user-dropdown" v-show="userMenuOpen">
          <div class="user-dropdown-header" v-if="collapsed">
            <p class="user-email">{{ userEmail }}</p>
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
    </div>
  </aside>
  </div>

  <!-- Create Folder Modal -->
  <div v-if="showCreateFolderModal" class="modal-backdrop" @click="closeCreateFolderModal">
    <div class="folder-modal" @click.stop>
      <div class="modal-header">
        <h3>Create New Folder</h3>
        <button class="close-button" @click="closeCreateFolderModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="folderName" class="form-label">Folder Name</label>
          <input 
            type="text" 
            id="folderName" 
            v-model="newFolderName" 
            class="form-control" 
            placeholder="Enter folder name"
            @keyup.enter="createFolder"
            ref="folderNameInput"
          >
        </div>
        <div class="form-group">
          <label for="folderColor" class="form-label">Folder Color</label>
          <div class="color-picker">
            <div 
              v-for="color in folderColors" 
              :key="color.value" 
              class="color-option"
              :class="{ selected: color.value === newFolderColor }"
              :style="{ backgroundColor: color.value }"
              @click="newFolderColor = color.value"
            ></div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" @click="closeCreateFolderModal">Cancel</button>
        <button 
          class="btn btn-primary" 
          @click="createFolder"
          :disabled="!newFolderName.trim()"
        >
          <span v-if="folderCreating" class="spinner"></span>
          <span v-else>Create Folder</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { auth } from '@/services/firebase';
import AuthService from '@/services/auth.service';

export default {
  name: 'AppSidebar',
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
  
  emits: ['sidebar-toggle'],
  
  setup(props, { emit }) {
    const router = useRouter();
    const store = useStore();
    const collapsed = ref(false);
    const userMenuOpen = ref(false);
    const isMobile = ref(false);
    const isMobileSidebarOpen = ref(false);
    
    // Folder related state
    const folders = ref([]);
    const showCreateFolderModal = ref(false);
    const newFolderName = ref('');
    const newFolderColor = ref('#6366F1'); // Default color
    const folderCreating = ref(false);
    const folderNameInput = ref(null);
    
    // Available folder colors
    const folderColors = [
      { name: 'Blue', value: '#6366F1' },
      { name: 'Purple', value: '#8B5CF6' },
      { name: 'Pink', value: '#EC4899' },
      { name: 'Green', value: '#10B981' },
      { name: 'Yellow', value: '#F59E0B' },
      { name: 'Red', value: '#EF4444' },
      { name: 'Gray', value: '#6B7280' },
      { name: 'Teal', value: '#14B8A6' },
    ];
    
    const toggleCollapse = () => {
      collapsed.value = !collapsed.value;
      // Save preference to localStorage
      localStorage.setItem('sidebar-collapsed', collapsed.value);
      // Emit event to parent component
      emit('sidebar-toggle', collapsed.value);
    };
    
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
    
    const userRole = computed(() => {
      return 'Member'; // This could be dynamic based on user roles in a real app
    });
    
    const toggleUserMenu = (event) => {
      event.stopPropagation();
      userMenuOpen.value = !userMenuOpen.value;
    };
    
    const closeUserMenu = () => {
      userMenuOpen.value = false;
    };
    
    // Folder management methods
    const openCreateFolderModal = () => {
      showCreateFolderModal.value = true;
      // Focus on input after modal is shown
      setTimeout(() => {
        if (folderNameInput.value) {
          folderNameInput.value.focus();
        }
      }, 100);
    };
    
    const closeCreateFolderModal = () => {
      showCreateFolderModal.value = false;
      newFolderName.value = '';
      newFolderColor.value = '#6366F1'; // Reset to default color
    };
    
    const createFolder = async () => {
      // Validate folder name
      if (!newFolderName.value.trim()) return;
      
      try {
        folderCreating.value = true;
        
        // Create a new folder object with a unique ID
        const newFolder = {
          id: 'folder-' + Date.now(),
          name: newFolderName.value.trim(),
          color: newFolderColor.value,
          createdAt: new Date(),
          userId: auth.currentUser?.uid || 'user-1'
        };
        
        // In a real app, you would save this to a database/service
        // For now, we'll just add it to our local state
        folders.value.push(newFolder);
        
        // Save folders to localStorage for persistence
        saveFolders();
        
        // Close the modal
        closeCreateFolderModal();
        
        // Navigate to the new folder
        router.push('/folder/' + newFolder.id);
      } catch (error) {
        console.error('Error creating folder:', error);
      } finally {
        folderCreating.value = false;
      }
    };
    
    // Save folders to localStorage
    const saveFolders = () => {
      localStorage.setItem('user-folders', JSON.stringify(folders.value));
    };
    
    // Load folders from localStorage
    const loadFolders = () => {
      const savedFolders = localStorage.getItem('user-folders');
      if (savedFolders) {
        try {
          folders.value = JSON.parse(savedFolders);
        } catch (e) {
          console.error('Error parsing folders from localStorage:', e);
        }
      }
    };
    
    const handleLogout = async () => {
      try {
        await AuthService.logout();
        store.dispatch('auth/clearUser');
        closeUserMenu();
        router.push('/');
      } catch (err) {
        console.error('Logout failed:', err);
      }
    };
    
    // Toggle mobile sidebar
    const toggleMobileSidebar = () => {
      isMobileSidebarOpen.value = !isMobileSidebarOpen.value;
      
      // When opening the sidebar on mobile, we want the body to not scroll
      if (isMobileSidebarOpen.value) {
        document.body.classList.add('sidebar-open');
      } else {
        document.body.classList.remove('sidebar-open');
      }
    };
    
    // Close mobile sidebar
    const closeMobileSidebar = () => {
      isMobileSidebarOpen.value = false;
      document.body.classList.remove('sidebar-open');
    };
    
    // Initialize collapsed state from localStorage and check for mobile view
    function init() {
      const savedState = localStorage.getItem('sidebar-collapsed');
      if (savedState !== null) {
        collapsed.value = savedState === 'true';
      }
      
      // Check if we're on a mobile device
      checkMobile();
      
      // Add resize listener to update isMobile state
      window.addEventListener('resize', checkMobile);
      
      // Load folders from localStorage
      loadFolders();
    }
    
    // Check if we're on a mobile device
    const checkMobile = () => {
      isMobile.value = window.innerWidth < 768;
      
      // If we're transitioning to mobile, close the sidebar
      if (isMobile.value && isMobileSidebarOpen.value) {
        closeMobileSidebar();
      }
    };
    
    // Listen for folder deletion events
    const handleFolderDeleted = (event) => {
      const { folderId } = event.detail;
      if (folderId) {
        folders.value = folders.value.filter(folder => folder.id !== folderId);
        saveFolders();
      }
    };
    
    window.addEventListener('folder-deleted', handleFolderDeleted);
    
    // Call init function to initialize sidebar
    init();
    
    // Cleanup event listeners
    onBeforeUnmount(() => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('folder-deleted', handleFolderDeleted);
    });
    
    return {
      collapsed,
      userMenuOpen,
      userEmail,
      userInitials,
      userRole,
      isMobile,
      isMobileSidebarOpen,
      toggleCollapse,
      toggleUserMenu,
      closeUserMenu,
      handleLogout,
      toggleMobileSidebar,
      closeMobileSidebar,
      // Folder related
      folders,
      showCreateFolderModal,
      newFolderName,
      newFolderColor,
      folderColors,
      folderCreating,
      folderNameInput,
      openCreateFolderModal,
      closeCreateFolderModal,
      createFolder,
    };
  }
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  background-color: white;
  display: flex;
  flex-direction: column;
  transition: width var(--transition-normal);
  box-shadow: var(--shadow-md);
  z-index: var(--z-fixed);
}

.sidebar.is-collapsed {
  width: 70px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-4) var(--spacing-4);
  border-bottom: 1px solid var(--neutral-200);
  height: 70px;
}

.sidebar-logo {
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
  width: 2.2rem;
  height: 2.2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  object-fit: cover;
  transition: transform 0.3s ease;
}

.sidebar-logo:hover .logo-image {
  transform: scale(1.05);
}

.logo-text {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--neutral-900);
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.collapse-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: var(--radius-md);
  border: 1px solid var(--neutral-200);
  background-color: white;
  color: var(--neutral-700);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.collapse-toggle:hover {
  background-color: var(--neutral-100);
  border-color: var(--neutral-300);
  color: var(--primary-color);
}

.sidebar-nav {
  flex: 1;
  padding: var(--spacing-4) 0;
  overflow-y: auto;
}

.nav-items {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: var(--spacing-1);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  color: var(--neutral-700);
  text-decoration: none;
  transition: all var(--transition-normal);
  border-left: 3px solid transparent;
  background: none;
  border-top: none;
  border-right: none;
  border-bottom: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-size: var(--font-size-md);
}

.nav-link:hover, 
.nav-link.router-link-active {
  background-color: var(--neutral-100);
  color: var(--primary-color);
  border-left-color: var(--primary-color);
}

.add-new-button, .add-folder-button {
  color: var(--primary-color);
  font-weight: var(--font-weight-medium);
}

.add-new-button:hover, .add-folder-button:hover {
  background-color: rgba(99, 102, 241, 0.1);
}

.add-folder-button {
  margin-bottom: var(--spacing-2);
  font-size: var(--font-size-sm);
  display: flex;
  align-items: center;
  padding-left: var(--spacing-4);
}

.sidebar-footer {
  padding: var(--spacing-4);
  border-top: 1px solid var(--neutral-200);
}

.user-section {
  position: relative;
  margin-bottom: var(--spacing-1);
}

.user-menu-toggle {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  width: 100%;
  padding: var(--spacing-2);
  background: none;
  border: none;
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
}

.user-menu-toggle:hover {
  background-color: var(--neutral-100);
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background-color: var(--primary-light);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  transition: all var(--transition-normal);
  border: 2px solid transparent;
}

.user-menu-toggle:hover .avatar {
  border-color: var(--primary-light);
  transform: translateY(-2px);
}

.user-info {
  flex: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  margin: 0;
  color: var(--neutral-700);
  font-size: var(--font-size-sm);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  margin: 0;
  color: var(--neutral-500);
  font-size: var(--font-size-xs);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-dropdown {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 0;
  width: 200px;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  z-index: 1000;
  animation: scaleIn 0.2s var(--transition-bounce);
  transform-origin: bottom left;
  overflow: hidden;
  border: 1px solid var(--neutral-200);
}

.sidebar.is-collapsed .user-dropdown {
  left: auto;
  right: 0;
  transform-origin: bottom right;
}

.user-dropdown-header {
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--neutral-200);
}

.user-dropdown-body {
  padding: var(--spacing-1);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
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

.rotate-180 {
  transform: rotate(180deg);
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

/* Folder styles */
.nav-section {
  margin-top: var(--spacing-4);
}

.nav-section-title {
  padding: 0 var(--spacing-4);
  color: var(--neutral-500);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--spacing-2);
}

.folder-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.folder-link {
  gap: var(--spacing-2);
  font-size: var(--font-size-sm);
}

/* Modal Styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  animation: fadeIn 0.2s ease;
}

.folder-modal {
  background-color: white;
  border-radius: var(--radius-lg);
  width: 400px;
  max-width: 90vw;
  box-shadow: var(--shadow-xl);
  animation: scaleIn 0.2s ease;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-4) var(--spacing-6);
  border-bottom: 1px solid var(--neutral-200);
}

.modal-header h3 {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-900);
}

.close-button {
  background: none;
  border: none;
  color: var(--neutral-500);
  cursor: pointer;
  padding: var(--spacing-1);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.close-button:hover {
  background-color: var(--neutral-100);
  color: var(--neutral-900);
}

.modal-body {
  padding: var(--spacing-6);
}

.modal-footer {
  padding: var(--spacing-4) var(--spacing-6);
  border-top: 1px solid var(--neutral-200);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-3);
}

.form-group {
  margin-bottom: var(--spacing-4);
}

.form-label {
  display: block;
  margin-bottom: var(--spacing-2);
  font-weight: var(--font-weight-medium);
  color: var(--neutral-700);
}

.form-control {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  border: 1px solid var(--neutral-300);
  border-radius: var(--radius-md);
  font-size: var(--font-size-md);
  transition: all var(--transition-fast);
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

/* Color Picker */
.color-picker {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  margin-top: var(--spacing-2);
}

.color-option {
  width: 30px;
  height: 30px;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
  border: 2px solid transparent;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.selected {
  border-color: var(--neutral-900);
  transform: scale(1.1);
}

.color-option.selected::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: white;
}

/* Spinner */
.spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Mobile Styles */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    box-shadow: none;
    z-index: 1000;
  }
  
  .sidebar.is-open {
    transform: translateX(0);
    box-shadow: var(--shadow-xl);
  }
  
  .mobile-sidebar-toggle {
    position: fixed;
    top: 1rem;
    left: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: var(--radius-md);
    background-color: var(--primary-color);
    color: white;
    border: none;
    z-index: 999;
    cursor: pointer;
    box-shadow: var(--shadow-md);
    transition: all 0.3s ease;
  }
  
  .mobile-sidebar-toggle:hover {
    transform: scale(1.05);
  }
  
  .sidebar-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    animation: fadeIn 0.3s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  /* Prevent body scrolling when sidebar is open */
  :global(body.sidebar-open) {
    overflow: hidden;
  }
}
</style>