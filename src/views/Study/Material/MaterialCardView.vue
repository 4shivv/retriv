<template>
  <div class="material-card-view">
    <div class="container container-xl">
      <!-- Page Header -->
      <header class="page-header">
        <div class="header-content">
          <h1 class="page-title">Study Material</h1>
        </div>
      </header>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner-large"></div>
        <p>Loading material...</p>
      </div>

      <!-- Material View Content -->
      <div v-else-if="material" class="material-view">
        <div class="view-header">
          <button @click="goBack" class="back-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Back</span>
          </button>
        </div>
        
        <div class="material-view-card">
          <div class="material-actions-menu">
            <button class="action-menu-button" @click.stop="toggleActionMenu">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>
            </button>
            <div v-if="showActionMenu" class="action-menu">
              <button class="action-menu-item" @click.stop="editMaterial">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                <span>Edit</span>
              </button>
              <button class="action-menu-item danger" @click.stop="confirmDelete">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                <span>Delete</span>
              </button>
            </div>
          </div>
          <div class="material-view-header">
            <div class="title-area">
            <div class="material-category-badge" :style="{ backgroundColor: getFolderColor(material.category) }">{{ material.category || 'Uncategorized' }}</div>
            <h3>{{ material.title }}</h3>
            <div class="material-view-meta">
            <span>Created on {{ formatDate(material.createdAt) }}</span>
            </div>
            </div>
          </div>
          
          <div class="material-view-content">
            <p>{{ material.content }}</p>
          </div>
          
          <div class="material-view-actions">
            <div class="study-technique-buttons">
              <button @click="blurtingMaterial" class="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Blurting Technique
              </button>
              <button @click="feynmanMaterial" class="btn btn-outline">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M23 6l-9.5 9.5-5-5L1 18"></path>
                  <path d="M17 6h6v6"></path>
                </svg>
                Feynman Technique
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Not Found State -->
      <div v-else class="not-found-container">
        <div class="not-found-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h2>Material Not Found</h2>
        <p>The study material you're looking for does not exist or has been deleted.</p>
        <button @click="goBack" class="btn btn-primary">Return to Dashboard</button>
      </div>
    </div>

    <!-- Delete Material Confirmation Modal -->
    <div v-if="showDeleteModal" class="delete-modal-backdrop" @click="cancelDelete">
      <div class="delete-modal" @click.stop>
        <div class="delete-modal-header">
          <h4>Delete Material</h4>
        </div>
        <div class="delete-modal-body">
          <p>Are you sure you want to delete "{{ material?.title }}"?</p>
          <p class="text-danger">This action cannot be undone and will delete all study history associated with this material.</p>
        </div>
        <div class="delete-modal-footer">
          <button @click="cancelDelete" class="btn btn-outline">Cancel</button>
          <button @click="deleteMaterial" class="btn btn-danger" :disabled="deleteLoading">
            <span v-if="deleteLoading" class="loading-spinner"></span>
            <span v-else>Delete</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Material Form -->
    <div v-if="showEditModal" class="edit-modal-backdrop" @click="cancelEdit">
      <div class="edit-modal" @click.stop>
        <div class="edit-modal-header">
          <h4>Edit Study Material</h4>
        </div>
        <div class="edit-modal-body">
          <div v-if="error" class="alert alert-danger">
            <div class="alert-content">
              <div class="alert-text">{{ error }}</div>
            </div>
          </div>
          
          <form @submit.prevent="saveEdit">
            <div class="form-group">
              <label class="form-label">Title</label>
              <input
                type="text"
                v-model="editForm.title"
                class="form-control"
                placeholder="Enter a title for this material"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="folder" class="form-label">Folder</label>
              <div class="folder-dropdown-container">
                <!-- Custom Dropdown Trigger -->
                <div class="folder-dropdown-trigger" @click="toggleFolderDropdown" :class="{ 'active': showFolderDropdown }">
                  <div class="selected-folder">
                    <div v-if="selectedFolder" class="folder-tag" :style="{ backgroundColor: selectedFolder.color || '#6366F1' }">
                      <span>{{ selectedFolder.name }}</span>
                    </div>
                    <span v-else class="placeholder-text">Select a folder</span>
                  </div>
                  <div class="dropdown-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>

                <!-- Folder Dropdown Content -->
                <div v-if="showFolderDropdown" class="folder-dropdown-content">
                  <div class="folder-search">
                    <div class="search-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                    </div>
                    <input 
                      type="text" 
                      v-model="folderSearchTerm" 
                      class="form-control" 
                      placeholder="Search folders"
                      @input="handleFolderSearch"
                      ref="folderSearchInput"
                    />
                  </div>
                  
                  <div class="folder-groups">
                    <!-- User's Folders -->
                    <div class="folder-group" v-if="filteredFolders.length > 0">
                      <div class="folder-group-label">Your Folders</div>
                      <div class="folder-options">
                        <div 
                          v-for="folder in filteredFolders" 
                          :key="folder.id" 
                          class="folder-option" 
                          @click="selectFolder(folder)"
                          :class="{ 'active': selectedFolder && selectedFolder.id === folder.id }"
                          :style="{ borderLeft: `3px solid ${folder.color || '#6366F1'}` }"
                        >
                          <div class="folder-icon" :style="{ color: folder.color || '#6366F1' }">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v11z"></path>
                            </svg>
                          </div>
                          <span class="folder-name">{{ folder.name }}</span>
                          <span class="folder-select-icon" v-if="selectedFolder && selectedFolder.id === folder.id">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- No Folders Message -->
                    <div v-if="!filteredFolders.length && !isLoadingFolders" class="no-folders-message">
                      <p>No folders found. Create a folder first to organize your materials.</p>
                      <button type="button" class="create-folder-btn" @click="createNewFolder">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v11z"></path>
                          <line x1="12" y1="11" x2="12" y2="17"></line>
                          <line x1="9" y1="14" x2="15" y2="14"></line>
                        </svg>
                        Create New Folder
                      </button>
                    </div>

                    <!-- Loading Indicator -->
                    <div v-if="isLoadingFolders" class="loading-folders">
                      <div class="folder-spinner"></div>
                      <p>Loading folders...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Content</label>
              <textarea
                v-model="editForm.content"
                class="form-control"
                rows="10"
                placeholder="Paste or type the content you want to study"
                required
              ></textarea>
            </div>
            
            <div class="form-group">
              <label for="deadline" class="form-label">Learning Deadline</label>
              <div class="deadline-selection">
                <div class="deadline-presets">
                  <button type="button" class="deadline-preset-button" :class="{ 'active': editForm.deadline === '1' }" @click="selectDeadline('1')">1 Day</button>
                  <button type="button" class="deadline-preset-button" :class="{ 'active': editForm.deadline === '3' }" @click="selectDeadline('3')">3 Days</button>
                  <button type="button" class="deadline-preset-button" :class="{ 'active': editForm.deadline === '7' }" @click="selectDeadline('7')">1 Week</button>
                  <button type="button" class="deadline-preset-button" :class="{ 'active': editForm.deadline === '14' }" @click="selectDeadline('14')">2 Weeks</button>
                  <button type="button" class="deadline-preset-button" :class="{ 'active': editForm.deadline === '30' }" @click="selectDeadline('30')">1 Month</button>
                  <button type="button" class="deadline-preset-button" :class="{ 'active': editForm.deadline === 'custom' }" @click="selectDeadline('custom')">Custom</button>
                </div>
                <div v-if="editForm.deadline === 'custom'" class="custom-deadline-input">
                  <input type="date" v-model="customDeadlineDate" class="form-control" :min="minDate">
                </div>
              </div>
              <p class="form-text deadline-helper">Setting a deadline helps the app create an optimized review schedule for maximum retention by your target date.</p>
            </div>
            
            <div class="form-actions">
              <button type="button" @click="cancelEdit" class="btn btn-outline">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="isLoading">
                <span v-if="isLoading" class="loading-spinner"></span>
                <span v-else>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import StudyService from '@/services/study.service';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/services/firebase';

export default {
  name: 'MaterialCardView',
  
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    
    // State variables
    const material = ref(null);
    const loading = ref(true);
    const error = ref('');
    const isLoading = ref(false);
    const deleteLoading = ref(false);
    const showActionMenu = ref(false);
    const showDeleteModal = ref(false);
    const showEditModal = ref(false);
    
    // Edit form data
    const editForm = ref({
      title: '',
      content: '',
      folder: '',
      deadline: ''
    });
    
    // Folder-related state
    const selectedFolder = ref(null);
    const folders = ref([]);
    const isLoadingFolders = ref(false);
    const showFolderDropdown = ref(false);
    const folderSearchTerm = ref('');
    const folderSearchInput = ref(null);
    const filteredFolders = computed(() => {
      if (!folderSearchTerm.value) return folders.value;
      return folders.value.filter(folder => 
        folder.name.toLowerCase().includes(folderSearchTerm.value.toLowerCase())
      );
    });
    
    // Deadline related variables
    const customDeadlineDate = ref('');
    
    // Compute minimum date for custom deadline (today)
    const minDate = computed(() => {
      const today = new Date();
      return today.toISOString().split('T')[0];
    });

    // Format date helper function
    const formatDate = (timestamp) => {
      if (!timestamp) return 'N/A';
      
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    };
    
    // Fetch material data
    const fetchMaterial = async () => {
      try {
        loading.value = true;
        const materialId = route.params.id;
        
        if (!materialId) {
          throw new Error('Material ID is required');
        }
        
        const fetchedMaterial = await StudyService.getStudyMaterial(materialId);
        
        if (!fetchedMaterial) {
          throw new Error('Material not found');
        }
        
        material.value = fetchedMaterial;
      } catch (err) {
        console.error('Failed to fetch material:', err);
        error.value = err.message || 'Failed to load material';
        material.value = null;
      } finally {
        loading.value = false;
      }
    };
    
    // Navigation functions
    const goBack = () => {
      router.back();
    };
    
    // Toggle action menu
    const toggleActionMenu = () => {
      showActionMenu.value = !showActionMenu.value;
    };
    
    // Close action menu when clicking outside
    const closeActionMenu = (event) => {
      if (showActionMenu.value && !event.target.closest('.action-menu-button') && !event.target.closest('.action-menu')) {
        showActionMenu.value = false;
      }
    };
    
    // Edit material
    const editMaterial = async () => {
      showActionMenu.value = false;
      
      // Load folders if not already loaded
      if (folders.value.length === 0) {
        await loadFolders();
      }
      
      // Initialize edit form with current material data
      editForm.value.title = material.value.title;
      editForm.value.content = material.value.content;
      
      // Find and set the folder based on category
      if (material.value.category) {
        const folder = folders.value.find(f => f.name === material.value.category);
        if (folder) {
          selectedFolder.value = folder;
        }
      }
      
      // Set deadline if available
      if (material.value.deadline) {
        if ([1, 3, 7, 14, 30].includes(material.value.deadline)) {
          editForm.value.deadline = material.value.deadline.toString();
        } else {
          editForm.value.deadline = 'custom';
          const deadlineDate = new Date();
          deadlineDate.setDate(deadlineDate.getDate() + material.value.deadline);
          customDeadlineDate.value = deadlineDate.toISOString().split('T')[0];
        }
      }
      
      showEditModal.value = true;
    };
    
    // Toggle folder dropdown
    const toggleFolderDropdown = () => {
      showFolderDropdown.value = !showFolderDropdown.value;
      
      if (showFolderDropdown.value) {
        folderSearchTerm.value = '';
        nextTick(() => {
          folderSearchInput.value?.focus();
        });
      }
    };
    
    // Handle folder search
    const handleFolderSearch = () => {
      // Implementation is handled by the computed property
    };
    
    // Select a folder
    const selectFolder = (folder) => {
      selectedFolder.value = folder;
      showFolderDropdown.value = false;
    };
    
    // Create a new folder
    const createNewFolder = () => {
      // Navigate to dashboard with create folder action
      router.push('/dashboard?action=createFolder');
    };
    
    // Function to handle deadline selection
    const selectDeadline = (value) => {
      editForm.value.deadline = value;
      if (value !== 'custom') {
        customDeadlineDate.value = '';
      } else {
        // Set default custom date to 2 weeks from now if none selected yet
        if (!customDeadlineDate.value) {
          const defaultDate = new Date();
          defaultDate.setDate(defaultDate.getDate() + 14);
          customDeadlineDate.value = defaultDate.toISOString().split('T')[0];
        }
      }
    };
    
    // Convert deadline selection to days for the API
    const getDeadlineInDays = () => {
      if (!editForm.value.deadline) return null;
      
      if (editForm.value.deadline === 'custom' && customDeadlineDate.value) {
        const selectedDate = new Date(customDeadlineDate.value);
        const today = new Date();
        const diffTime = Math.abs(selectedDate - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      }
      
      return editForm.value.deadline === 'custom' ? null : parseInt(editForm.value.deadline);
    };
    
    // Load folders from localStorage
    const loadFolders = async () => {
      isLoadingFolders.value = true;
      try {
        const savedFolders = localStorage.getItem('user-folders');
        if (savedFolders) {
          folders.value = JSON.parse(savedFolders);
        }
      } catch (err) {
        console.error('Error loading folders:', err);
      } finally {
        isLoadingFolders.value = false;
      }
    };
    
    // Get folder color based on category name
    const getFolderColor = (categoryName) => {
      if (!categoryName) return 'var(--primary-color)';
      
      // Find folder with matching name
      const folder = folders.value.find(f => f.name === categoryName);
      return folder?.color || 'var(--primary-color)';
    };
    
    // Cancel edit
    const cancelEdit = () => {
      showEditModal.value = false;
      showFolderDropdown.value = false;
    };
    
    // Save edit
    const saveEdit = async () => {
      try {
        isLoading.value = true;
        error.value = '';
        
        // Ensure a folder is selected
        if (!selectedFolder.value) {
          error.value = 'Please select a folder to organize your material';
          isLoading.value = false;
          return;
        }
        
        // Ensure a learning deadline is set
        if (!editForm.value.deadline) {
          error.value = 'Please set a learning deadline to create your study plan';
          isLoading.value = false;
          return;
        }
        
        // Get the deadline in days
        const deadlineDays = getDeadlineInDays();
        if (editForm.value.deadline === 'custom' && !deadlineDays) {
          error.value = 'Please select a valid custom deadline';
          isLoading.value = false;
          return;
        }
        
        // Create a custom update method since StudyService.updateStudyMaterial doesn't support folder and deadline
        const updateStudyMaterialWithFolderAndDeadline = async (materialId, title, content, category, deadline) => {
          // First check if the user is authenticated
          if (!auth.currentUser) {
            throw new Error("You must be logged in to update materials");
          }
          
          try {
            const materialRef = doc(db, 'materials', materialId);
            
            // Get the material to verify ownership
            const materialSnap = await getDoc(materialRef);
            
            if (!materialSnap.exists()) {
              throw new Error("Material not found");
            }
            
            const materialData = materialSnap.data();
            
            // Verify the material belongs to the current user
            if (materialData.userId !== auth.currentUser.uid) {
              throw new Error("You do not have permission to edit this material");
            }
            
            // Update the material with all fields
            await updateDoc(materialRef, {
              title,
              content,
              category,
              deadline,
              updatedAt: serverTimestamp()
            });
            
            return materialId;
          } catch (error) {
            console.error("Error updating material:", error);
            throw new Error(`Failed to update material: ${error.message}`);
          }
        };
        
        // Update material in database with the folder (category) and deadline
        await updateStudyMaterialWithFolderAndDeadline(
          material.value.id,
          editForm.value.title,
          editForm.value.content,
          selectedFolder.value.name,  // Use the folder name as category
          deadlineDays               // Include deadline
        );
        
        // Update the local material object
        material.value = {
          ...material.value,
          title: editForm.value.title,
          content: editForm.value.content,
          category: selectedFolder.value.name,
          deadline: deadlineDays,
          updatedAt: new Date()
        };
        
        // Close the edit modal
        showEditModal.value = false;
      } catch (err) {
        console.error('Failed to update material:', err);
        error.value = err.message || 'Failed to update material';
      } finally {
        isLoading.value = false;
      }
    };
    
    // Delete confirmation
    const confirmDelete = () => {
      showActionMenu.value = false;
      showDeleteModal.value = true;
    };
    
    // Cancel delete
    const cancelDelete = () => {
      showDeleteModal.value = false;
    };
    
    // Delete material
    const deleteMaterial = async () => {
      try {
        deleteLoading.value = true;
        
        // Delete material from database
        await StudyService.deleteStudyMaterial(material.value.id);
        
        // Redirect back to dashboard
        router.replace('/dashboard');
      } catch (err) {
        console.error('Failed to delete material:', err);
        error.value = err.message || 'Failed to delete material';
      } finally {
        deleteLoading.value = false;
        showDeleteModal.value = false;
      }
    };
    
    // Study techniques
    const blurtingMaterial = () => {
      if (material.value) {
        router.push(`/study/blurting/${material.value.id}`);
      }
    };
    
    const feynmanMaterial = () => {
      if (material.value) {
        router.push(`/study/feynman/${material.value.id}`);
      }
    };
    
    onMounted(async () => {
      // Check authentication
      const user = store.getters['auth/user'];
      if (!user) {
        router.push('/login');
        return;
      }
      
      // Add event listener to close action menu when clicking outside
      document.addEventListener('click', closeActionMenu);
      
      // Load folders first, then fetch material
      await loadFolders();
      await fetchMaterial();
    });
    
    onBeforeUnmount(() => {
      // Remove event listener
      document.removeEventListener('click', closeActionMenu);
    });
    
    return {
      material,
      loading,
      error,
      isLoading,
      deleteLoading,
      showActionMenu,
      showDeleteModal,
      showEditModal,
      editForm,
      formatDate,
      goBack,
      toggleActionMenu,
      editMaterial,
      cancelEdit,
      saveEdit,
      confirmDelete,
      cancelDelete,
      deleteMaterial,
      blurtingMaterial,
      feynmanMaterial,
      // Folder related properties and methods
      selectedFolder,
      folders,
      isLoadingFolders,
      showFolderDropdown,
      folderSearchTerm,
      folderSearchInput,
      filteredFolders,
      toggleFolderDropdown,
      handleFolderSearch,
      selectFolder,
      createNewFolder,
      getFolderColor,
      // Deadline related properties and methods
      customDeadlineDate,
      minDate,
      selectDeadline
    };
  }
}
</script>

<style scoped>
.material-card-view {
  padding-top: 1rem;
  min-height: 100vh;
  background-color: var(--neutral-50);
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-8);
  padding-top: var(--spacing-12);
}

.page-title {
  font-size: var(--font-size-3xl);
  color: var(--neutral-900);
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
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

/* Not Found State */
.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 60vh;
  padding: var(--spacing-8);
}

.not-found-icon {
  color: var(--neutral-400);
  margin-bottom: var(--spacing-6);
}

.not-found-container h2 {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-4);
  color: var(--neutral-800);
}

.not-found-container p {
  margin-bottom: var(--spacing-6);
  color: var(--neutral-600);
  max-width: 500px;
}

/* Back Button */
.view-header {
  margin-bottom: var(--spacing-6);
}

.back-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: 0.75rem 1.25rem;
  background-color: white;
  border: none;
  border-radius: var(--radius-lg);
  color: var(--neutral-700);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-md);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.back-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--primary-gradient);
  opacity: 0;
  transition: opacity var(--transition-normal);
  z-index: 0;
}

.back-button:hover {
  color: white;
  transform: translateX(-5px);
}

.back-button:hover::before {
  opacity: 1;
}

.back-button svg,
.back-button span {
  position: relative;
  z-index: 1;
}

.back-button svg {
  transition: transform var(--transition-normal);
}

.back-button:hover svg {
  transform: translateX(-3px);
  stroke: white;
}

/* Material View Card */
.material-view-card {
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  margin-bottom: var(--spacing-8);
  position: relative;
}

.material-view-card .material-actions-menu {
  position: absolute;
  top: var(--spacing-6);
  right: var(--spacing-6);
  z-index: 10;
  background-color: var(--neutral-50);
  padding: 8px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

.material-view-card .material-actions-menu:hover {
  background-color: white;
  box-shadow: var(--shadow-md);
}

.material-view-card .action-menu-button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--neutral-600);
  background-color: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.material-view-card .action-menu-button:hover {
  color: var(--primary-color);
  background-color: var(--neutral-100);
  transform: scale(1.1);
}

.material-view-card .action-menu {
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  width: 180px;
  background-color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 10;
  overflow: hidden;
  border: 1px solid var(--neutral-200);
  margin-top: var(--spacing-1);
}

.action-menu-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  width: 100%;
  padding: var(--spacing-2) var(--spacing-3);
  border: none;
  background-color: transparent;
  color: var(--neutral-700);
  font-size: var(--font-size-sm);
  text-align: left;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.action-menu-item:hover {
  background-color: var(--neutral-100);
}

.action-menu-item.danger {
  color: #ef4444;
}

.action-menu-item.danger:hover {
  background-color: rgba(239, 68, 68, 0.1);
}

.material-view-header {
  margin-bottom: var(--spacing-6);
  border-bottom: 1px solid var(--neutral-200);
  padding: var(--spacing-6) var(--spacing-6) var(--spacing-4);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

.title-area {
  flex: 1;
}

.material-view-header h3 {
  font-size: var(--font-size-2xl);
  color: var(--primary-color);
  margin-bottom: var(--spacing-2);
}

.material-view-meta {
  color: var(--neutral-500);
  font-size: var(--font-size-sm);
}

.material-category-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  background-color: var(--primary-color);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: white;
  margin-bottom: 0.5rem;
}

.material-view-content {
  padding: 0 var(--spacing-6) var(--spacing-6);
  line-height: 1.8;
  font-size: var(--font-size-md);
  color: var(--neutral-800);
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: var(--spacing-6);
  border-bottom: 1px solid var(--neutral-200);
}

.material-view-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  padding: 0 var(--spacing-6) var(--spacing-6);
}

.study-technique-buttons {
  display: flex;
  justify-content: center;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-2);
}

/* Delete Modal */
.delete-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease forwards;
}

.delete-modal {
  background-color: white;
  border-radius: var(--radius-lg);
  width: 400px;
  max-width: 90%;
  box-shadow: var(--shadow-xl);
  animation: scaleIn 0.2s ease forwards;
}

.delete-modal-header {
  padding: var(--spacing-4) var(--spacing-6);
  border-bottom: 1px solid var(--neutral-200);
}

.delete-modal-header h4 {
  margin: 0;
  font-weight: var(--font-weight-semibold);
  color: #ef4444;
}

.delete-modal-body {
  padding: var(--spacing-6);
}

.delete-modal-body p {
  margin-bottom: var(--spacing-3);
}

.text-danger {
  color: #ef4444;
  font-weight: var(--font-weight-medium);
}

.delete-modal-footer {
  padding: var(--spacing-4) var(--spacing-6);
  border-top: 1px solid var(--neutral-200);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-3);
}

/* Edit Modal */
.edit-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease forwards;
}

.edit-modal {
  background-color: white;
  border-radius: var(--radius-lg);
  width: 600px;
  max-width: 90%;
  max-height: 90vh;
  box-shadow: var(--shadow-xl);
  animation: scaleIn 0.2s ease forwards;
  display: flex;
  flex-direction: column;
}

.edit-modal-header {
  padding: var(--spacing-4) var(--spacing-6);
  border-bottom: 1px solid var(--neutral-200);
}

.edit-modal-header h4 {
  margin: 0;
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-900);
}

.edit-modal-body {
  padding: var(--spacing-6);
  overflow-y: auto;
  flex: 1;
}

.edit-modal-footer {
  padding: var(--spacing-4) var(--spacing-6);
  border-top: 1px solid var(--neutral-200);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-3);
}

/* Form Styles */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-4);
  margin-top: var(--spacing-6);
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
  padding: 0.75rem;
  border: 1px solid var(--neutral-300);
  border-radius: var(--radius-md);
  font-size: var(--font-size-md);
  transition: all var(--transition-normal);
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

textarea.form-control {
  resize: vertical;
  min-height: 200px;
}

/* Folder Dropdown Styling */
.folder-dropdown-container {
  position: relative;
  width: 100%;
}

.folder-dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: white;
  border: 2px solid var(--neutral-300);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
}

.folder-dropdown-trigger:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.folder-dropdown-trigger.active {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15), var(--shadow-md);
}

.selected-folder {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.placeholder-text {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  color: var(--neutral-500);
}

.dropdown-icon {
  margin-left: auto;
  color: var(--neutral-600);
  transition: transform var(--transition-normal);
}

.folder-dropdown-trigger.active .dropdown-icon {
  transform: rotate(180deg);
  color: var(--primary-color);
}

/* Folder Tag Styling */
.folder-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: white;
  background-color: var(--primary-color);
}

/* Dropdown Content Styling */
.folder-dropdown-content {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  background-color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-dropdown);
  border: 1px solid var(--neutral-200);
  max-height: 350px;
  overflow-y: scroll !important;
  animation: dropdownFadeIn 0.2s ease-out;
}

@keyframes dropdownFadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.folder-search {
  padding: var(--spacing-3);
  border-bottom: 1px solid var(--neutral-200);
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.search-icon {
  color: var(--neutral-400);
}

/* Add padding at the bottom to ensure all options are visible when scrolling */
.folder-groups::after {
  content: '';
  display: block;
  height: 12px;
}

.folder-groups {
  padding: var(--spacing-2);
  padding-right: 10px; /* Extra space for scrollbar */
}

.folder-group {
  margin-bottom: var(--spacing-5);
  padding-bottom: var(--spacing-3);
  border-bottom: 1px solid var(--neutral-200);
}

.folder-group:last-child {
  margin-bottom: 0;
  border-bottom: none;
  padding-bottom: 0;
}

.folder-group-label {
  padding: 0 var(--spacing-3);
  margin-bottom: var(--spacing-3);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-600);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: var(--neutral-50);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  display: inline-block;
}

.folder-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.folder-option {
  display: flex;
  align-items: center;
  padding: 10px var(--spacing-3);
  gap: var(--spacing-3);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--neutral-800);
  margin-bottom: 4px;
  min-height: 44px;
  border: 1px solid transparent;
}

.folder-option:hover {
  background-color: var(--neutral-100);
  border-color: var(--neutral-300);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.folder-option.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  font-weight: var(--font-weight-medium);
}

.folder-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.folder-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.folder-select-icon {
  margin-left: var(--spacing-2);
}

.no-folders-message {
  text-align: center;
  padding: var(--spacing-6);
  color: var(--neutral-600);
}

.create-folder-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  margin-top: var(--spacing-4);
  padding: 8px 16px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-normal);
}

.create-folder-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.loading-folders {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-6);
  color: var(--neutral-600);
}

.folder-spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid rgba(99, 102, 241, 0.2);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-3);
}

/* Deadline Selection Styling */
.deadline-selection {
  margin-bottom: var(--spacing-2);
}

.deadline-presets {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-3);
}

.deadline-preset-button {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--neutral-300);
  background-color: var(--neutral-50);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-normal);
  color: var(--neutral-700);
}

.deadline-preset-button:hover {
  border-color: var(--primary-color);
  background-color: rgba(99, 102, 241, 0.05);
}

.deadline-preset-button.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.custom-deadline-input {
  max-width: 300px;
  margin-top: var(--spacing-2);
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

.deadline-helper {
  font-size: var(--font-size-xs);
  color: var(--neutral-600);
  margin-top: var(--spacing-2);
}

.alert {
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-4);
}

.alert-danger {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

/* Button Styles */
.btn {
  cursor: pointer;
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-normal);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: var(--primary-gradient);
  color: white;
  padding: 0.5rem 1rem;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-outline {
  background-color: transparent;
  border: 1px solid var(--neutral-300);
  color: var(--neutral-700);
  padding: 0.5rem 1rem;
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
  padding: 0.5rem 1rem;
}

.btn-danger:hover {
  background-color: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(239, 68, 68, 0.25);
}

.loading-spinner {
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
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-4);
  }
  
  .material-view-header {
    flex-direction: column;
  }
  
  .material-view-actions {
    flex-direction: column;
  }
  
  .study-technique-buttons {
    flex-direction: column;
    gap: var(--spacing-3);
  }
  
  .study-technique-buttons .btn {
    width: 100%;
  }
}
</style>