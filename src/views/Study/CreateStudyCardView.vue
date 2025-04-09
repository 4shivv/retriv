<template>
  <div class="study-page">
    <div class="study-header">
      <h1>Create Manually</h1>
      <p class="study-description">Create a Blurt Card by entering your own content</p>
    </div>
    
    <!-- Main Content Area -->
    <div class="study-content">
      <div v-if="error" class="alert alert-danger">
        <div class="alert-content">
          <div class="alert-text">{{ error }}</div>
        </div>
      </div>
      
      <!-- Title Section -->
      <div class="content-section">
        <label for="title" class="section-label">Title</label>
        <div class="input-container">
          <input
            type="text"
            id="title"
            v-model="title"
            class="full-input"
            placeholder="Enter a title for this Blurt Card"
          />
        </div>
      </div>
      
      <!-- Source Type Section -->
      <div class="content-section">
        <label class="section-label">Source Type</label>
        <div class="source-options">
          <button 
            type="button" 
            @click="manualSourceType = 'text'" 
            class="source-btn" 
            :class="{ active: manualSourceType === 'text' }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="17" y1="10" x2="3" y2="10"></line>
              <line x1="21" y1="6" x2="3" y2="6"></line>
              <line x1="21" y1="14" x2="3" y2="14"></line>
              <line x1="17" y1="18" x2="3" y2="18"></line>
            </svg>
            <span>Paste Text</span>
          </button>
          
          <button 
            type="button" 
            @click="manualSourceType = 'file'" 
            class="source-btn" 
            :class="{ active: manualSourceType === 'file' }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <span>Upload File</span>
          </button>
        </div>
      </div>
      
      <!-- Text Input Source -->
      <div v-if="manualSourceType === 'text'" class="content-section">
        <label for="content" class="section-label">Content</label>
        <div class="input-container">
          <textarea
            id="content"
            v-model="content"
            class="full-input content-textarea"
            rows="10"
            placeholder="Paste or type the content you want to learn"
          ></textarea>
        </div>
      </div>
      
      <!-- File Input Source -->
      <div v-if="manualSourceType === 'file'" class="content-section">
        <label class="section-label">Upload File</label>
        <div class="file-upload-container">
          <input
            type="file"
            id="file-upload"
            @change="handleFileUpload"
            class="file-input"
            accept=".txt,.md,.doc,.docx"
            :disabled="loading"
          />
          <label for="file-upload" class="file-upload-label">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <span>Choose file</span>
          </label>
          <span v-if="fileName" class="file-name">{{ fileName }}</span>
        </div>
        <p class="helper-text">
          Supported file types: .txt, .md, .doc, .docx
        </p>
        <div v-if="content" class="file-preview">
          <div class="file-preview-header">
            <h4>File Content Preview</h4>
            <button type="button" class="preview-edit-btn" @click="manualSourceType = 'text'">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              <span>Edit content</span>
            </button>
          </div>
          <div class="file-preview-content">{{ content.slice(0, 300) }}{{ content.length > 300 ? '...' : '' }}</div>
        </div>
      </div>
      
      <!-- Folder Selection -->
      <div class="content-section">
        <label for="folder" class="section-label">Folder</label>
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
      
      <!-- Learning Deadline -->
      <div class="content-section">
        <label for="deadline" class="section-label">Learning Deadline</label>
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
            <input type="date" v-model="customDeadlineDate" class="full-input" :min="minDate">
          </div>
        </div>
        <p class="helper-text">Setting a deadline helps the app create an optimized review schedule for maximum retention by your target date.</p>
      </div>
      
      <!-- Action Buttons -->
      <div class="action-buttons">
        <button type="button" class="btn btn-outline btn-lg" @click="cancel">Cancel</button>
        <button type="button" @click="handleSubmit" class="btn btn-primary btn-lg" :disabled="loading">
          <span v-if="loading" class="loading-spinner"></span>
          <span v-else>Save Blurt Card</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import StudyService from '@/services/study.service';
import { auth } from '@/services/firebase';

export default {
  name: 'CreateStudyCardView',
  
  setup() {
    const router = useRouter();
    const route = useRoute();
    
    // Form state
    const title = ref('');
    const content = ref('');
    const error = ref('');
    const loading = ref(false);
    const manualSourceType = ref('text');
    const fileName = ref('');
    
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
    
    // Handle file upload
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      fileName.value = file.name;
      
      // For MVP, we'll just read text files
      const reader = new FileReader();
      
      reader.onload = (e) => {
        content.value = e.target.result;
        
        // Set title from filename if title is empty
        if (!title.value) {
          title.value = file.name.split('.')[0];
        }
      };
      
      reader.onerror = () => {
        error.value = 'Failed to read the file. Please try again.';
      };
      
      reader.readAsText(file);
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
          error.value = 'Please enter content for your Blurt Card';
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
        
        console.log("Blurt Card saved with ID:", materialId);
        
        // Ensure we have materialId before navigating
        if (materialId) {
          // Navigate to the study view for the new material
          router.push(`/study/${materialId}`);
        } else {
          error.value = 'Failed to save Blurt Card. Please try again.';
        }
        
      } catch (err) {
        console.error('Error in handleSubmit:', err);
        error.value = err.message || 'Failed to save Blurt Card';
      } finally {
        loading.value = false;
      }
    };
    
    // Cancel creation
    const cancel = () => {
      router.push('/dashboard');
    };
    
    return {
      title,
      content,
      error,
      loading,
      manualSourceType,
      fileName,
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
      handleFileUpload,
      handleSubmit,
      cancel
    };
  }
};
</script>

<style scoped>
.study-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}

.study-header {
  margin-bottom: 2rem;
}

.study-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--neutral-900);
  margin-bottom: 0.5rem;
}

.study-description {
  color: var(--neutral-600);
  font-size: 1.1rem;
}

.study-content {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 2.5rem;
  min-height: 75vh;
  display: flex;
  flex-direction: column;
}

.content-section {
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--neutral-200);
}

.content-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-label {
  display: block;
  font-weight: 600;
  font-size: 1rem;
  color: var(--neutral-800);
  margin-bottom: 0.75rem;
}

.input-container {
  width: 100%;
}

.full-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--neutral-300);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.full-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.content-textarea {
  min-height: 250px;
  resize: vertical;
}

.helper-text {
  font-size: 0.875rem;
  color: var(--neutral-600);
  margin-top: 0.5rem;
}

/* Source Type Options Styling */
.source-options {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.source-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--neutral-300);
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  flex: 1;
}

.source-btn:hover {
  border-color: var(--primary-color);
  background-color: var(--neutral-50);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.source-btn.active {
  border-color: var(--primary-color);
  background-color: rgba(99, 102, 241, 0.05);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.source-btn svg {
  color: var(--primary-color);
}

.source-btn span {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--neutral-700);
}

/* File Upload Styling */
.file-upload-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.file-input {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.file-upload-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--neutral-100);
  border: 1px dashed var(--neutral-400);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  color: var(--neutral-700);
}

.file-upload-label:hover {
  background-color: var(--neutral-200);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.file-name {
  font-size: 0.875rem;
  color: var(--neutral-700);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

/* File Preview */
.file-preview {
  margin-top: 1rem;
  border: 1px solid var(--neutral-200);
  border-radius: 8px;
  overflow: hidden;
}

.file-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: var(--neutral-100);
  border-bottom: 1px solid var(--neutral-200);
}

.file-preview-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
}

.preview-edit-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background-color: var(--neutral-50);
  border: 1px solid var(--neutral-200);
  border-radius: 4px;
  font-size: 0.75rem;
  color: var(--neutral-700);
  cursor: pointer;
  transition: all 0.2s ease;
}

.preview-edit-btn:hover {
  background-color: var(--neutral-200);
  border-color: var(--neutral-300);
}

.file-preview-content {
  padding: 1rem;
  max-height: 200px;
  overflow-y: auto;
  font-size: 0.875rem;
  line-height: 1.6;
  white-space: pre-wrap;
  color: var(--neutral-700);
  background-color: white;
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
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.folder-dropdown-trigger:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.folder-dropdown-trigger.active {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15), 0 4px 8px rgba(0, 0, 0, 0.08);
}

.selected-folder {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.placeholder-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--neutral-500);
}

.dropdown-icon {
  margin-left: auto;
  color: var(--neutral-600);
  transition: transform 0.2s ease;
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
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background-color: var(--primary-color);
}

/* Dropdown Content Styling */
.folder-dropdown-content {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  width: 100%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 50;
  border: 1px solid var(--neutral-200);
  max-height: 350px;
  overflow-y: auto;
  animation: dropdownFadeIn 0.2s ease-out;
}

@keyframes dropdownFadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.folder-search {
  padding: 1rem;
  border-bottom: 1px solid var(--neutral-200);
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-icon {
  color: var(--neutral-400);
}

.folder-groups {
  padding: 0.5rem;
}

.folder-group {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--neutral-200);
}

.folder-group:last-child {
  margin-bottom: 0;
  border-bottom: none;
  padding-bottom: 0;
}

.folder-group-label {
  padding: 0 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--neutral-600);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: var(--neutral-50);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  display: inline-block;
}

.folder-options {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.folder-option {
  display: flex;
  align-items: center;
  padding: 0.625rem 0.75rem;
  gap: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  color: var(--neutral-800);
  margin-bottom: 0.25rem;
  min-height: 44px;
  border: 1px solid transparent;
}

.folder-option:hover {
  background-color: var(--neutral-100);
  border-color: var(--neutral-300);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.folder-option.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  font-weight: 500;
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
  margin-left: 0.5rem;
}

.no-folders-message {
  text-align: center;
  padding: 1.5rem;
  color: var(--neutral-600);
}

.create-folder-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.create-folder-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.loading-folders {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  color: var(--neutral-600);
}

.folder-spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid rgba(99, 102, 241, 0.2);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s linear infinite;
  margin-bottom: 0.75rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Deadline Selection Styling */
.deadline-selection {
  margin-bottom: 0.5rem;
}

.deadline-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.deadline-preset-button {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--neutral-300);
  background-color: var(--neutral-50);
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
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
  margin-top: 0.5rem;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Action Buttons */
.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 2rem;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-outline {
  background-color: white;
  border: 2px solid var(--neutral-300);
  color: var(--neutral-700);
}

.btn-outline:hover {
  border-color: var(--neutral-400);
  background-color: var(--neutral-100);
}

.btn-primary {
  background-color: var(--primary-color);
  border: 2px solid var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
  border-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(99, 102, 241, 0.25);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

/* Alert Styling */
.alert {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid transparent;
}

.alert-danger {
  background-color: rgba(239, 68, 68, 0.1);
  border-left-color: #ef4444;
}

.alert-text {
  color: #b91c1c;
  font-size: 0.875rem;
}

/* Responsive styles */
@media (max-width: 768px) {
  .study-page {
    padding: 1rem;
  }
  
  .study-content {
    padding: 1.5rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .deadline-presets {
    flex-direction: column;
  }
  
  .source-options {
    flex-direction: column;
  }
}
</style>