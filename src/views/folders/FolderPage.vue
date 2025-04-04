<template>
  <div class="folder-page">
    <div class="container">
      <!-- Folder Header -->
      <header class="folder-header" :style="folderHeaderStyle">
        <div class="folder-header-content">
          <h1 class="folder-title">{{ folderName }}</h1>
          <div class="folder-stats" v-if="materials.length > 0">
            {{ materials.length }} {{ materials.length === 1 ? 'material' : 'materials' }}
          </div>
        </div>
        <div class="folder-actions">
          <button @click="showFolderOptions = !showFolderOptions" class="btn btn-outline btn-icon folder-options-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </button>
          
          <div v-if="showFolderOptions" class="folder-options-dropdown">
            <button class="dropdown-item" @click="openRenameModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
              Rename Folder
            </button>
            <button class="dropdown-item text-danger" @click="confirmDeleteFolder">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Delete Folder
            </button>
          </div>
          
          <button @click="handleAddNew" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Material
          </button>
        </div>
      </header>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner-large"></div>
        <p>Loading folder contents...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="materials.length === 0" class="empty-state">
        <div class="empty-illustration">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v11z"></path>
          </svg>
        </div>
        <h2>This folder is empty</h2>
        <p>Start adding materials to organize your study content</p>
        <button @click="handleAddNew" class="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Material
        </button>
      </div>

      <!-- Folder Content -->
      <div v-else class="folder-content">
        <!-- Materials Grid -->
        <div class="materials-grid">
          <div 
            v-for="material in materials" 
            :key="material.id" 
            class="material-card"
            @click="handleSelectMaterial(material)"
          >
            <div class="material-card-content">
              <h3 class="material-title">{{ material.title }}</h3>
              <p class="material-excerpt">{{ getExcerpt(material.content) }}</p>
            </div>
            <div class="material-footer">
              <span class="material-date">{{ formatDate(material.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Rename Folder Modal -->
    <div v-if="showRenameModal" class="modal-backdrop" @click="closeRenameModal">
      <div class="folder-modal" @click.stop>
        <div class="modal-header">
          <h3>Rename Folder</h3>
          <button class="close-button" @click="closeRenameModal">
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
              @keyup.enter="renameFolder"
              ref="folderRenameInput"
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
          <button class="btn btn-outline" @click="closeRenameModal">Cancel</button>
          <button 
            class="btn btn-primary" 
            @click="renameFolder"
            :disabled="!newFolderName.trim()"
          >
            <span v-if="folderUpdating" class="spinner"></span>
            <span v-else>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Delete Folder Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-backdrop" @click="cancelDeleteFolder">
      <div class="delete-modal" @click.stop>
        <div class="modal-header">
          <h3>Delete Folder</h3>
          <button class="close-button" @click="cancelDeleteFolder">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="delete-warning">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <p>Are you sure you want to delete <strong>{{ folderName }}</strong>?</p>
            <p class="delete-note" v-if="materials.length > 0">
              This folder contains {{ materials.length }} {{ materials.length === 1 ? 'material' : 'materials' }} that will also be deleted.
            </p>
            <p class="delete-note" v-else>
              This folder is empty and will be permanently removed.
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="cancelDeleteFolder">Cancel</button>
          <button 
            class="btn btn-danger" 
            @click="deleteFolder"
          >
            <span v-if="folderDeleting" class="spinner"></span>
            <span v-else>Delete Folder</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import StudyService from '@/services/study.service';

export default {
  name: 'FolderPage',
  
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    
    // State
    const loading = ref(true);
    const folder = ref(null);
    const materials = ref([]);
    const showFolderOptions = ref(false);
    
    // Rename modal state
    const showRenameModal = ref(false);
    const newFolderName = ref('');
    const newFolderColor = ref('');
    const folderUpdating = ref(false);
    const folderRenameInput = ref(null);
    
    // Delete modal state
    const showDeleteModal = ref(false);
    const folderDeleting = ref(false);
    
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
    
    // Computed
    const folderId = computed(() => route.params.id);
    
    const folderName = computed(() => {
      return folder.value ? folder.value.name : 'Folder';
    });
    
    const folderHeaderStyle = computed(() => {
      if (!folder.value || !folder.value.color) return {};
      
      return {
        borderTop: `4px solid ${folder.value.color}`,
        borderLeft: `1px solid ${folder.value.color}20`,
      };
    });
    
    // Methods
    const loadFolder = () => {
      // In a real app, you would load this from a service/database
      // For now, we'll get it from localStorage
      const savedFolders = localStorage.getItem('user-folders');
      
      if (savedFolders) {
        try {
          const folders = JSON.parse(savedFolders);
          folder.value = folders.find(f => f.id === folderId.value);
          
          if (folder.value) {
            // Initialize rename form with current values
            newFolderName.value = folder.value.name;
            newFolderColor.value = folder.value.color;
          } else {
            // Folder not found, redirect to dashboard
            router.push('/dashboard');
          }
        } catch (e) {
          console.error('Error parsing folders from localStorage:', e);
          router.push('/dashboard');
        }
      } else {
        // No folders saved, redirect to dashboard
        router.push('/dashboard');
      }
    };
    
    const loadMaterials = async () => {
      try {
        loading.value = true;
        
        // In a real app, you would filter materials by folder ID in the database
        // For now, we'll fetch all materials and filter them locally
        const allMaterials = await StudyService.getStudyMaterials();
        
        // For demo purposes, we'll just show 5 random materials if they exist
        // In a real app, you would associate materials with folders in your database
        if (allMaterials && allMaterials.length > 0) {
          // Shuffle the array and take up to 5 items
          materials.value = allMaterials
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);
        } else {
          materials.value = [];
        }
        
      } catch (err) {
        console.error('Error loading materials:', err);
        materials.value = [];
      } finally {
        loading.value = false;
      }
    };
    
    const getExcerpt = (content) => {
      if (!content) return '';
      return content.length > 120 ? content.substring(0, 120) + '...' : content;
    };
    
    const formatDate = (dateVal) => {
      if (!dateVal) return '';
      
      const date = dateVal.toDate ? dateVal.toDate() : new Date(dateVal);
      const now = new Date();
      const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
      
      if (isNaN(date.getTime())) return '';
      
      if (diffDays === 0) {
        return 'Today';
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else {
        return date.toLocaleDateString();
      }
    };
    
    const handleSelectMaterial = (material) => {
      // Simulate selecting a material and navigating to study mode
      router.push(`/dashboard?materialId=${material.id}`);
    };
    
    const handleAddNew = () => {
      // Redirect to create material page with folder context
      router.push(`/dashboard?action=create&folderId=${folderId.value}`);
    };
    
    // Folder rename functionality
    const openRenameModal = () => {
      showRenameModal.value = true;
      showFolderOptions.value = false;
      
      // Focus on input after modal is shown
      setTimeout(() => {
        if (folderRenameInput.value) {
          folderRenameInput.value.focus();
        }
      }, 100);
    };
    
    const closeRenameModal = () => {
      showRenameModal.value = false;
      // Reset to current folder values
      newFolderName.value = folder.value.name;
      newFolderColor.value = folder.value.color;
    };
    
    const renameFolder = async () => {
      if (!newFolderName.value.trim()) return;
      
      try {
        folderUpdating.value = true;
        
        // Update folder in localStorage
        const savedFolders = localStorage.getItem('user-folders');
        if (savedFolders) {
          const folders = JSON.parse(savedFolders);
          const folderIndex = folders.findIndex(f => f.id === folderId.value);
          
          if (folderIndex !== -1) {
            // Update folder
            folders[folderIndex].name = newFolderName.value.trim();
            folders[folderIndex].color = newFolderColor.value;
            
            // Save updated folders
            localStorage.setItem('user-folders', JSON.stringify(folders));
            
            // Update local state
            folder.value = folders[folderIndex];
          }
        }
        
        // Close modal
        showRenameModal.value = false;
        
      } catch (err) {
        console.error('Error renaming folder:', err);
      } finally {
        folderUpdating.value = false;
      }
    };
    
    // Folder delete functionality
    const confirmDeleteFolder = () => {
      showDeleteModal.value = true;
      showFolderOptions.value = false;
    };
    
    const cancelDeleteFolder = () => {
      showDeleteModal.value = false;
    };
    
    const deleteFolder = async () => {
      try {
        folderDeleting.value = true;
        
        // Delete folder from localStorage
        const savedFolders = localStorage.getItem('user-folders');
        if (savedFolders) {
          const folders = JSON.parse(savedFolders);
          const updatedFolders = folders.filter(f => f.id !== folderId.value);
          
          // Save updated folders
          localStorage.setItem('user-folders', JSON.stringify(updatedFolders));
        }
        
        // Redirect to dashboard
        router.push('/dashboard');
        
      } catch (err) {
        console.error('Error deleting folder:', err);
      } finally {
        folderDeleting.value = false;
      }
    };
    
    // Click outside handler for folder options
    const handleClickOutside = (event) => {
      if (showFolderOptions.value && !event.target.closest('.folder-options-btn') && !event.target.closest('.folder-options-dropdown')) {
        showFolderOptions.value = false;
      }
    };
    
    // Watch for route changes to reload folder data
    watch(() => route.params.id, (newId, oldId) => {
      if (newId !== oldId) {
        loadFolder();
        loadMaterials();
      }
    });
    
    onMounted(() => {
      loadFolder();
      loadMaterials();
      
      // Add click outside listener
      document.addEventListener('click', handleClickOutside);
    });
    
    return {
      loading,
      folder,
      materials,
      folderId,
      folderName,
      folderHeaderStyle,
      folderColors,
      showFolderOptions,
      showRenameModal,
      showDeleteModal,
      newFolderName,
      newFolderColor,
      folderUpdating,
      folderDeleting,
      folderRenameInput,
      getExcerpt,
      formatDate,
      handleSelectMaterial,
      handleAddNew,
      openRenameModal,
      closeRenameModal,
      renameFolder,
      confirmDeleteFolder,
      cancelDeleteFolder,
      deleteFolder
    };
  }
};
</script>

<style scoped>
.folder-page {
  padding-top: 1.5rem;
  min-height: 100vh;
  background-color: var(--neutral-50);
}

@media (max-width: 768px) {
  .folder-page {
    padding-top: 5rem; /* Provide space for mobile toggle button */
  }
}

/* Folder Header */
.folder-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-8);
  padding: var(--spacing-6);
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  position: relative;
  border-top: 4px solid var(--primary-color);
  border-left: 1px solid rgba(99, 102, 241, 0.2);
}

.folder-title {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-2);
  color: var(--neutral-900);
}

.folder-stats {
  color: var(--neutral-600);
  font-size: var(--font-size-sm);
}

.folder-actions {
  display: flex;
  gap: var(--spacing-3);
  position: relative;
}

.btn-icon {
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.folder-options-dropdown {
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  width: 200px;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  z-index: 100;
  animation: scaleIn 0.2s ease;
  transform-origin: top right;
  overflow: hidden;
  border: 1px solid var(--neutral-200);
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
  margin: var(--spacing-1);
  text-align: left;
  background: none;
  border: none;
  width: calc(100% - var(--spacing-2));
  cursor: pointer;
  font-size: var(--font-size-sm);
  border-radius: var(--radius-md);
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

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  color: var(--neutral-600);
}

.loading-spinner-large {
  width: 3rem;
  height: 3rem;
  border: 3px solid rgba(99, 102, 241, 0.2);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-4);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  color: var(--neutral-600);
  padding: var(--spacing-8);
  text-align: center;
}

.empty-illustration {
  margin-bottom: var(--spacing-6);
  color: var(--neutral-400);
}

.empty-state h2 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-4);
  color: var(--neutral-800);
}

.empty-state p {
  margin-bottom: var(--spacing-6);
  max-width: 500px;
}

/* Materials Grid */
.materials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-6);
}

.material-card {
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: all var(--transition-normal);
  cursor: pointer;
  border: 1px solid var(--neutral-200);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.material-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-light);
}

.material-card-content {
  padding: var(--spacing-6);
  flex: 1;
}

.material-title {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-3);
  color: var(--neutral-900);
}

.material-excerpt {
  color: var(--neutral-600);
  font-size: var(--font-size-sm);
  line-height: 1.5;
}

.material-footer {
  border-top: 1px solid var(--neutral-200);
  padding: var(--spacing-3) var(--spacing-6);
  background-color: var(--neutral-50);
}

.material-date {
  font-size: var(--font-size-xs);
  color: var(--neutral-500);
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

.folder-modal, .delete-modal {
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

/* Delete Warning */
.delete-warning {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.delete-warning svg {
  margin-bottom: var(--spacing-4);
  color: #ef4444;
}

.delete-warning p {
  margin-bottom: var(--spacing-2);
}

.delete-note {
  color: var(--neutral-600);
  font-size: var(--font-size-sm);
}

/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  border: none;
  cursor: pointer;
  transition: all var(--transition-normal);
  gap: var(--spacing-2);
}

.btn-primary {
  background: var(--primary-gradient);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-outline {
  background-color: transparent;
  border: 1px solid var(--neutral-300);
  color: var(--neutral-700);
}

.btn-outline:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover {
  background-color: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(239, 68, 68, 0.25);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
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

@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Responsive styles */
@media (max-width: 768px) {
  .folder-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-4);
  }
  
  .folder-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .materials-grid {
    grid-template-columns: 1fr;
  }
}
</style>
