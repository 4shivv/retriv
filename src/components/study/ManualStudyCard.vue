<template>
  <div class="study-input-form card">
    <div class="card-header">
      <h3>Create Study Card</h3>
      <p class="form-subtitle">Create a study card by entering your own content</p>
    </div>
    
    <div class="card-body">
      <div v-if="error" class="alert alert-danger">
        <div class="alert-content">
          <div class="alert-text">{{ error }}</div>
        </div>
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="title" class="form-label">Title</label>
          <input
            type="text"
            id="title"
            v-model="title"
            class="form-control"
            placeholder="Enter a title for this study card"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="content" class="form-label">Content</label>
          <textarea
            id="content"
            v-model="content"
            class="form-control"
            rows="10"
            placeholder="Enter the content for your study card"
            required
          ></textarea>
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
          <label for="deadline" class="form-label">Learning Deadline</label>
          <div class="deadline-selection">
            <div class="deadline-presets">
              <button type="button" class="deadline-preset-button" :class="{ 'active': deadline === '1' }" @click="selectDeadline('1')">1 Day</button>
              <button type="button" class="deadline-preset-button" :class="{ 'active': deadline === '3' }" @click="selectDeadline('3')">3 Days</button>
              <button type="button" class="deadline-preset-button" :class="{ 'active': deadline === '7' }" @click="selectDeadline('7')">1 Week</button>
              <button type="button" class="deadline-preset-button" :class="{ 'active': deadline === '14' }" @click="selectDeadline('14')">2 Weeks</button>
              <button type="button" class="deadline-preset-button" :class="{ 'active': deadline === '30' }" @click="selectDeadline('30')">1 Month</button>
              <button type="button" class="deadline-preset-button" :class="{ 'active': deadline === 'custom' }" @click="selectDeadline('custom')">Custom</button>
            </div>
            <div v-if="deadline === 'custom'" class="custom-deadline-input">
              <input type="date" v-model="customDeadlineDate" class="form-control" :min="minDate">
            </div>
          </div>
          <p class="form-text deadline-helper">Setting a deadline helps the app create an optimized review schedule for maximum retention by your target date.</p>
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn btn-outline btn-lg" @click="cancel">Cancel</button>
          <button type="submit" class="btn btn-primary btn-lg" :disabled="loading">
            <span v-if="loading" class="loading-spinner"></span>
            <span v-else>Save Study Card</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import StudyService from '@/services/study.service';
import { auth } from '@/services/firebase';

export default {
  name: 'ManualStudyCard',
  emits: ['material-saved', 'cancel'],
  
  setup(props, { emit }) {
    const router = useRouter();
    const route = useRoute();
    
    // Form state
    const title = ref('');
    const content = ref('');
    const error = ref('');
    const loading = ref(false);
    
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
    
    // Check if we have a folderId in the URL query params
    onMounted(() => {
      const { folderId } = route.query;
      if (folderId) {
        loadFolders().then(() => {
          const folder = folders.value.find(f => f.id === folderId);
          if (folder) {
            selectedFolder.value = folder;
          }
        });
      } else {
        loadFolders();
      }
    });
    
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
    
    // Deadline related variables
    const deadline = ref('');
    const customDeadlineDate = ref('');
    
    // Compute minimum date for custom deadline (today)
    const minDate = computed(() => {
      const today = new Date();
      return today.toISOString().split('T')[0];
    });
    
    // Function to handle deadline selection
    const selectDeadline = (value) => {
      deadline.value = value;
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
      if (!deadline.value) return null;
      
      if (deadline.value === 'custom' && customDeadlineDate.value) {
        const selectedDate = new Date(customDeadlineDate.value);
        const today = new Date();
        const diffTime = Math.abs(selectedDate - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      }
      
      return deadline.value === 'custom' ? null : parseInt(deadline.value);
    };
    
    // Form submission
    const handleSubmit = async () => {
      try {
        loading.value = true;
        error.value = '';
        
        // Check if user is authenticated
        if (!auth.currentUser) {
          console.error("No authenticated user");
          error.value = "You must be logged in to save materials";
          router.push('/login');
          return;
        }
        
        // Ensure we have content before saving
        if (!content.value.trim()) {
          error.value = 'Please enter content for your study card';
          return;
        }
        
        // Ensure a folder is selected
        if (!selectedFolder.value) {
          error.value = 'Please select a folder to organize your material';
          return;
        }
        
        // Ensure a learning deadline is set
        if (!deadline.value) {
          error.value = 'Please set a learning deadline to create your study plan';
          return;
        }
        
        // Use the selected folder for the category
        const folderCategory = selectedFolder.value.name;
        
        const materialId = await StudyService.saveStudyMaterial(
          auth.currentUser.uid,
          title.value,
          content.value,
          folderCategory,
          getDeadlineInDays()
        );
        
        console.log("Study card saved with ID:", materialId);
        
        // Ensure we have materialId before emitting
        if (materialId) {
          // Emit with more complete material object
          const materialObj = { 
            id: materialId,
            title: title.value,
            content: content.value,
            category: folderCategory,
            folderId: selectedFolder.value.id,
            createdAt: new Date(),
            userId: auth.currentUser.uid,
            deadline: getDeadlineInDays()
          };
          
          emit('material-saved', materialObj);
          
          // Navigate back to dashboard or study view
          router.push('/dashboard');
        } else {
          error.value = 'Failed to save study card. Please try again.';
        }
        
      } catch (err) {
        console.error('Error in handleSubmit:', err);
        error.value = err.message || 'Failed to save study card';
      } finally {
        loading.value = false;
      }
    };
    
    // Cancel creation
    const cancel = () => {
      emit('cancel');
      router.push('/dashboard');
    };
    
    return {
      title,
      content,
      error,
      loading,
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
      deadline,
      customDeadlineDate,
      minDate,
      selectDeadline,
      handleSubmit,
      cancel
    };
  }
};
</script>

<style scoped>
.study-input-form {
  margin-bottom: var(--spacing-8);
}

.card-header {
  display: flex;
  flex-direction: column;
  margin-bottom: var(--spacing-4);
}

.card-header h3 {
  margin: 0 0 var(--spacing-2) 0;
  font-weight: var(--font-weight-semibold);
}

.form-subtitle {
  color: var(--neutral-600);
  font-size: var(--font-size-sm);
  margin: 0;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-8);
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

/* Enhanced Folder Dropdown Styling */
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

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive styles */
@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
    gap: var(--spacing-4);
  }
  
  .form-actions .btn {
    width: 100%;
  }
  
  .deadline-presets {
    flex-direction: column;
  }
}
</style>