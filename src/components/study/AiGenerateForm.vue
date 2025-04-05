<template>
  <div class="study-input-form card">
    <div class="card-header">
      <h3>Generate Study Materials with AI</h3>
      <p class="form-subtitle">Let AI create study cards from your source material or questions</p>
    </div>
    
    <div class="card-body">
      <div v-if="error" class="alert alert-danger">
        <div class="alert-content">
          <div class="alert-text">{{ error }}</div>
        </div>
      </div>
      
      <div v-if="aiStep === 'input'">
        <div class="form-group">
          <label class="form-label">Source Type</label>
          <p class="form-text">Select how you want to create your study materials. All cards will share the same category and deadline.</p>
          
          <div class="ai-source-options">
            <button 
              type="button" 
              @click="aiSourceType = 'text'" 
              class="ai-source-btn" 
              :class="{ active: aiSourceType === 'text' }"
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
              @click="aiSourceType = 'question'" 
              class="ai-source-btn" 
              :class="{ active: aiSourceType === 'question' }"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>Ask Question</span>
            </button>
            
            <button 
              type="button" 
              @click="aiSourceType = 'file'" 
              class="ai-source-btn" 
              :class="{ active: aiSourceType === 'file' }"
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
      
        <!-- Source Type Specific Form -->
        <div class="form-group">
          <!-- Text Input Source -->
          <div v-if="aiSourceType === 'text'">
            <label for="aiSourceText" class="form-label">Content</label>
            <textarea
              id="aiSourceText"
              v-model="aiSourceText"
              class="form-control"
              rows="10"
              placeholder="Paste or type your text content here. The AI will analyze this content and generate study materials."
              required
            ></textarea>
          </div>
          
          <!-- Question Input Source -->
          <div v-if="aiSourceType === 'question'">
            <label for="aiSourceQuestion" class="form-label">Your Question</label>
            <textarea
              id="aiSourceQuestion"
              v-model="aiSourceQuestion"
              class="form-control"
              rows="6"
              placeholder="Enter your question here. The AI will generate comprehensive study materials that answer this question."
              required
            ></textarea>
          </div>
          
          <!-- File Input Source -->
          <div v-if="aiSourceType === 'file'">
            <label class="form-label">Upload Source File</label>
            <div class="file-upload-container">
              <input
                type="file"
                id="ai-file-upload"
                @change="handleAiFileUpload"
                class="file-input"
                accept=".txt,.md,.doc,.docx"
                :disabled="loading"
              />
              <label for="ai-file-upload" class="file-upload-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <span>Choose file</span>
              </label>
              <span v-if="aiFileName" class="file-name">{{ aiFileName }}</span>
            </div>
            <p class="form-text">
              Supported file types: .txt, .md, .doc, .docx
            </p>
          </div>
        </div>
          
        <!-- Folder Selection -->
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
          
        <!-- Learning Deadline Selection for AI-generated cards -->
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
          <button type="button" @click="generateWithAi" class="btn btn-primary btn-lg" :disabled="loading || !canGenerateWithAi || !selectedFolder">
            <span v-if="loading">
              <span class="loading-spinner"></span>
              <span class="ml-2">Generating...</span>
            </span>
            <span v-else class="btn-content">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                <path d="M18.5 22q-1.05 0-1.775-.725T16 19.5q0-1.05.725-1.775T18.5 17q1.05 0 1.775.725T21 19.5q0 1.05-.725 1.775T18.5 22ZM18.5 7q-1.05 0-1.775-.725T16 4.5q0-1.05.725-1.775T18.5 2q1.05 0 1.775.725T21 4.5q0 1.05-.725 1.775T18.5 7ZM5.5 14.5q-1.05 0-1.775-.725T3 12q0-1.05.725-1.775T5.5 9.5q1.05 0 1.775.725T8 12q0 1.05-.725 1.775T5.5 14.5ZM18.5 12l-13 0M18.5 4.5l-13 7.5M18.5 19.5l-13-7.5"></path>
              </svg>
              Generate with AI
            </span>
          </button>
        </div>
      </div>
        
      <!-- AI Result Preview Step -->
      <div v-if="aiStep === 'preview'" class="ai-preview-container">
        <h4 class="preview-title">AI-Generated Study Materials</h4>
        <p class="preview-description">Review the generated materials below. You can edit, remove, or save them as is. All cards will have the same folder and learning deadline you selected.</p>
        
        <!-- Show error if generation failed -->
        <div v-if="error" class="alert alert-danger">
          <div class="alert-content">
            <div class="alert-text">{{ error }}</div>
          </div>
        </div>
        
        <!-- Loading state while generating -->
        <div v-if="loading" class="ai-loading-state">
          <div class="ai-loading-spinner"></div>
          <p>Generating your study materials...</p>
          <p class="loading-description">The AI is analyzing your content and creating optimized study cards.</p>
        </div>
        
        <!-- Result Cards -->
        <div v-else class="ai-generated-cards">
          <div v-for="(card, index) in aiGeneratedMaterials" :key="index" class="ai-material-card">
            <div class="card-header-actions">
              <span class="card-index">Card {{ index + 1 }}</span>
              <button @click="removeGeneratedCard(index)" class="remove-card-btn" title="Remove card">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div class="card-content-editable">
              <div class="form-group mb-2">
                <label class="form-label">Title</label>
                <input 
                  type="text" 
                  v-model="card.title" 
                  class="form-control" 
                  placeholder="Card title"
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">Content</label>
                <textarea 
                  v-model="card.content" 
                  class="form-control" 
                  rows="6" 
                  placeholder="Card content"
                ></textarea>
              </div>
            </div>
          </div>
          
          <!-- No cards message -->
          <div v-if="aiGeneratedMaterials.length === 0" class="no-cards-message">
            <p>No cards were generated. Try providing different content or adjusting your input.</p>
          </div>
        </div>
        
        <div class="preview-actions">
          <div class="action-group">
            <button type="button" @click="aiStep = 'input'" class="btn btn-outline btn-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back</span>
            </button>
          </div>
          
          <div class="action-group">
            <button type="button" @click="saveGeneratedMaterials" class="btn btn-primary btn-lg" :disabled="loading || aiGeneratedMaterials.length === 0">
              <span v-if="loading" class="loading-spinner"></span>
              <span v-else class="btn-content">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Save All Cards
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import DeepseekService from '@/services/deepseek.service';
import StudyService from '@/services/study.service';
import { auth } from '@/services/firebase';

export default {
  name: 'AiGenerateForm',
  emits: ['material-saved', 'materials-saved', 'cancel'],
  
  setup(props, { emit }) {
    const router = useRouter();
    const route = useRoute();
    
    // AI mode state
    const aiStep = ref('input');
    const aiSourceType = ref('text');
    const aiSourceText = ref('');
    const aiSourceQuestion = ref('');
    const aiFileName = ref('');
    const aiFileContent = ref('');
    const aiGeneratedMaterials = ref([]);
    
    // Common state
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
    
    // Deadline related variables
    const deadline = ref('');
    const customDeadlineDate = ref('');
    
    // Compute minimum date for custom deadline (today)
    const minDate = computed(() => {
      const today = new Date();
      return today.toISOString().split('T')[0];
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
    
    // Cancel creation
    const cancel = () => {
      emit('cancel');
    };
    
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
    
    // Handle AI file upload
    const handleAiFileUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      aiFileName.value = file.name;
      
      const reader = new FileReader();
      
      reader.onload = (e) => {
        aiFileContent.value = e.target.result;
      };
      
      reader.onerror = () => {
        error.value = 'Failed to read the file. Please try again.';
      };
      
      reader.readAsText(file);
    };
    
    // Check if can generate with AI based on input
    const canGenerateWithAi = computed(() => {
      if (aiSourceType.value === 'text') {
        return aiSourceText.value.trim().length > 0;
      } else if (aiSourceType.value === 'question') {
        return aiSourceQuestion.value.trim().length > 0;
      } else if (aiSourceType.value === 'file') {
        return aiFileContent.value.trim().length > 0;
      }
      return false;
    });
    
    // Generate materials with AI
    const generateWithAi = async () => {
      try {
        // Reset any previous errors
        error.value = '';
        
        // Check for folder selection
        if (!selectedFolder.value) {
          error.value = 'Please select a folder for your study materials';
          return;
        }
        
        // Check input content based on source type
        let sourceContent = '';
        if (aiSourceType.value === 'text') {
          sourceContent = aiSourceText.value;
          if (!sourceContent.trim()) {
            error.value = 'Please enter some text content to generate materials';
            return;
          }
        } else if (aiSourceType.value === 'question') {
          sourceContent = aiSourceQuestion.value;
          if (!sourceContent.trim()) {
            error.value = 'Please enter a question to generate materials';
            return;
          }
        } else if (aiSourceType.value === 'file') {
          sourceContent = aiFileContent.value;
          if (!sourceContent.trim()) {
            error.value = 'The file appears to be empty. Please upload a file with content';
            return;
          }
        }
        
        // Begin loading
        loading.value = true;
        
        // Check authentication
        if (!auth.currentUser) {
          error.value = "You must be logged in to generate materials with AI";
          router.push('/login');
          return;
        }
        
        try {
          // Call service to generate study materials
          const generatedMaterials = await DeepseekService.generateStudyMaterials(
            sourceContent,
            aiSourceType.value
          );
          
          if (!generatedMaterials || generatedMaterials.length === 0) {
            error.value = 'No materials could be generated. Try providing different content.';
            return;
          }
          
          // Store the generated materials
          aiGeneratedMaterials.value = generatedMaterials;
          
          // Move to preview step
          aiStep.value = 'preview';
        } catch (innerErr) {
          console.error('Error in AI generation:', innerErr);
          error.value = innerErr.message || 'Failed to generate materials with AI';
        }
      } catch (err) {
        console.error('Error generating materials with AI:', err);
        error.value = err.message || 'Failed to generate materials with AI';
      } finally {
        loading.value = false;
      }
    };
    
    // Remove a card from generated materials
    const removeGeneratedCard = (index) => {
      aiGeneratedMaterials.value.splice(index, 1);
    };
    
    // Save all generated materials
    const saveGeneratedMaterials = async () => {
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
        
        // Check if we have materials to save
        if (aiGeneratedMaterials.value.length === 0) {
          error.value = 'No materials to save';
          return;
        }
        
        // Check if folder is selected
        if (!selectedFolder.value) {
          error.value = 'Please select a folder for your study materials';
          return;
        }
        
        // Ensure a learning deadline is set
        if (!deadline.value) {
          error.value = 'Please set a learning deadline to create your study plan';
          return;
        }
        
        // Determine deadline in days if any was selected
        const deadlineDays = getDeadlineInDays();
        
        // Use the selected folder for the category
        const folderCategory = selectedFolder.value.name;
        
        // Save each material card
        const savePromises = aiGeneratedMaterials.value.map(material => {
          return StudyService.saveStudyMaterial(
            auth.currentUser.uid,
            material.title || 'Untitled Material',
            material.content,
            folderCategory,     // Use folder name as category
            deadlineDays        // All cards will have the same learning deadline
          );
        });
        
        // Wait for all saves to complete
        const savedMaterialIds = await Promise.all(savePromises);
        
        // Create an array of saved materials
        const savedMaterials = savedMaterialIds.map((id, index) => {
          return {
            id: id,
            title: aiGeneratedMaterials.value[index].title || 'Untitled Material',
            content: aiGeneratedMaterials.value[index].content,
            category: folderCategory,
            folderId: selectedFolder.value.id,
            createdAt: new Date(),
            userId: auth.currentUser.uid,
            deadline: deadlineDays
          };
        });
        
        // Emit the saved materials
        if (savedMaterials.length === 1) {
          emit('material-saved', savedMaterials[0]);
        } else if (savedMaterials.length > 1) {
          emit('materials-saved', savedMaterials);
        } else {
          error.value = 'Failed to save materials. Please try again.';
        }
        
        // Reset form
        resetForm();
      } catch (err) {
        console.error('Error saving generated materials:', err);
        error.value = err.message || 'Failed to save study materials';
      } finally {
        loading.value = false;
      }
    };
    
    // Reset the form
    const resetForm = () => {
      aiStep.value = 'input';
      aiSourceText.value = '';
      aiSourceQuestion.value = '';
      aiFileName.value = '';
      aiFileContent.value = '';
      aiGeneratedMaterials.value = [];
      selectedFolder.value = null;
      folderSearchTerm.value = '';
      deadline.value = '';
      customDeadlineDate.value = '';
    };
    
    return {
      // AI state variables
      aiStep,
      aiSourceType,
      aiSourceText,
      aiSourceQuestion,
      aiFileName,
      aiGeneratedMaterials,
      // Folder variables
      selectedFolder,
      folders,
      isLoadingFolders,
      showFolderDropdown,
      folderSearchTerm,
      folderSearchInput,
      filteredFolders,
      // Common state
      error,
      loading,
      // Deadline variables
      deadline,
      customDeadlineDate,
      minDate,
      // Computed properties
      canGenerateWithAi,
      // Folder methods
      toggleFolderDropdown,
      handleFolderSearch,
      selectFolder,
      createNewFolder,
      // AI methods
      handleAiFileUpload,
      generateWithAi,
      removeGeneratedCard,
      saveGeneratedMaterials,
      // Common methods
      selectDeadline,
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

/* AI Source Options Styling */
.ai-source-options {
  display: flex;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-3);
  margin-top: var(--spacing-2);
  flex-wrap: wrap;
}

.ai-source-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: 0.75rem 1rem;
  border: 1px solid var(--neutral-300);
  border-radius: var(--radius-md);
  background-color: white;
  cursor: pointer;
  transition: all var(--transition-normal);
  flex: 1;
  min-width: 120px;
}

.ai-source-btn:hover {
  border-color: var(--primary-color);
  background-color: var(--neutral-50);
}

.ai-source-btn.active {
  border-color: var(--primary-color);
  background-color: rgba(99, 102, 241, 0.05);
  box-shadow: var(--shadow-sm);
}

.ai-source-btn svg {
  color: var(--primary-color);
}

.ai-source-btn span {
  font-weight: var(--font-weight-medium);
}

/* File Upload Styling */
.file-upload-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-2);
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
  gap: var(--spacing-2);
  padding: 0.5rem 1rem;
  background-color: var(--neutral-100);
  border: 1px dashed var(--neutral-400);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-size: var(--font-size-sm);
  color: var(--neutral-700);
}

.file-upload-label:hover {
  background-color: var(--neutral-200);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.file-name {
  font-size: var(--font-size-sm);
  color: var(--neutral-700);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

/* Loading spinner */
.loading-spinner {
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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

/* AI Preview Container Styling */
.ai-preview-container {
  animation: fadeIn 0.3s ease;
}

.preview-title {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-2);
}

.preview-description {
  color: var(--neutral-600);
  margin-bottom: var(--spacing-6);
}

.ai-loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-12) 0;
  text-align: center;
}

.ai-loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid rgba(99, 102, 241, 0.2);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1.5s linear infinite;
  margin-bottom: var(--spacing-4);
}

.loading-description {
  color: var(--neutral-500);
  font-size: var(--font-size-sm);
  max-width: 400px;
  margin-top: var(--spacing-2);
}

/* Generated Card Styles */
.ai-generated-cards {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
  margin-bottom: var(--spacing-8);
}

.ai-material-card {
  background-color: white;
  border-radius: var(--radius-lg);
  border: 1px solid var(--neutral-200);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
}

.ai-material-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-3px);
}

.card-header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
}

.card-index {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--primary-color);
  background-color: rgba(99, 102, 241, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
}

.remove-card-btn {
  background: none;
  border: none;
  color: var(--neutral-500);
  cursor: pointer;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.remove-card-btn:hover {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.card-content-editable {
  animation: fadeIn 0.3s ease;
}

.mb-2 {
  margin-bottom: var(--spacing-2);
}

.no-cards-message {
  text-align: center;
  padding: var(--spacing-8);
  background-color: var(--neutral-100);
  border-radius: var(--radius-lg);
  color: var(--neutral-600);
}

.preview-actions {
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-6);
  gap: var(--spacing-4);
}

.action-group {
  display: flex;
  gap: var(--spacing-2);
}

.btn-content {
  display: flex;
  align-items: center;
}

.mr-2 {
  margin-right: var(--spacing-2);
}

.ml-2 {
  margin-left: var(--spacing-2);
}

/* Responsive styles */
@media (max-width: 768px) {
  .form-actions, .preview-actions {
    flex-direction: column;
    gap: var(--spacing-4);
  }
  
  .form-actions .btn, .preview-actions .btn {
    width: 100%;
  }
  
  .deadline-presets {
    flex-direction: column;
  }
  
  .ai-source-options {
    flex-direction: column;
  }
}
</style>