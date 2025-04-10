<template>
  <div class="study-page">
    <div class="study-header">
      <h1>Create With AI</h1>
      <p class="study-description">Let AI create Blurt Cards based on your content or questions</p>
    </div>
    
    <!-- Main Content Area -->
    <div class="study-content">
      <div v-if="error" class="alert alert-danger">
        <div class="alert-content">
          <div class="alert-text">{{ error }}</div>
        </div>
      </div>
      
      <div v-if="aiStep === 'input'">
        <!-- Source Type Section -->
        <div class="content-section">
          <label class="section-label">Source Type</label>
          <p class="helper-text">Select how you want to create your study materials.</p>
          
          <div class="source-type-options">
            <div 
              class="source-type-option" 
              :class="{ active: aiSourceType === 'text' }"
              @click="aiSourceType = 'text'"
            >
              <div class="option-icon-container">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="17" y1="10" x2="3" y2="10"></line>
                  <line x1="21" y1="6" x2="3" y2="6"></line>
                  <line x1="21" y1="14" x2="3" y2="14"></line>
                  <line x1="17" y1="18" x2="3" y2="18"></line>
                </svg>
              </div>
              <div class="option-content">
                <h3>Paste Text</h3>
                <p>Paste your text content and AI will generate Blurt Cards</p>
              </div>
            </div>
            
            <div 
              class="source-type-option" 
              :class="{ active: aiSourceType === 'question' }"
              @click="aiSourceType = 'question'"
            >
              <div class="option-icon-container">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <div class="option-content">
                <h3>Ask Question</h3>
                <p>Ask a question and AI will create Blurt Cards with answers</p>
              </div>
            </div>
            
            <div 
              class="source-type-option" 
              :class="{ active: aiSourceType === 'file' }"
              @click="aiSourceType = 'file'"
            >
              <div class="option-icon-container">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div class="option-content">
                <h3>Upload File</h3>
                <p>Upload a document and AI will extract Blurt Cards</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Source Content Section -->
        <div class="content-section">
          <!-- Text Input Source -->
          <div v-if="aiSourceType === 'text'">
            <label for="aiSourceText" class="section-label">Content</label>
            <div class="input-container">
              <textarea
                id="aiSourceText"
                v-model="aiSourceText"
                class="full-input content-textarea"
                rows="10"
                placeholder="Paste or type your text content here. The AI will analyze this content and generate study materials."
              ></textarea>
            </div>
          </div>
          
          <!-- Question Input Source -->
          <div v-if="aiSourceType === 'question'">
            <label for="aiSourceQuestion" class="section-label">Your Question</label>
            <div class="input-container">
              <textarea
                id="aiSourceQuestion"
                v-model="aiSourceQuestion"
                class="full-input content-textarea"
                rows="6"
                placeholder="Enter your question here. The AI will generate comprehensive study materials that answer this question."
              ></textarea>
            </div>
          </div>
          
          <!-- File Input Source -->
          <div v-if="aiSourceType === 'file'">
            <label class="section-label">Upload Source File</label>
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
            <p class="helper-text">
              Supported file types: .txt, .md, .doc, .docx
            </p>
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
          
        <!-- Learning Deadline Selection -->
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
        <div class="preview-header">
          <h2 class="preview-title">AI-Generated Blurt Cards</h2>
          <p class="preview-description">Review the generated materials below. You can edit, remove, or save them as is.</p>
        </div>
        
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
          <p class="loading-description">The AI is analyzing your content and creating optimized Blurt Cards.</p>
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
              <div class="card-field">
                <label class="card-field-label">Title</label>
                <input 
                  type="text" 
                  v-model="card.title" 
                  class="full-input" 
                  placeholder="Card title"
                />
              </div>
              
              <div class="card-field">
                <label class="card-field-label">Content</label>
                <textarea 
                  v-model="card.content" 
                  class="full-input content-textarea" 
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
          <button type="button" @click="aiStep = 'input'" class="btn btn-outline btn-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Back</span>
          </button>
          
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
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import DeepseekService from '@/services/deepseek.service';
import StudyService from '@/services/study.service';
import { auth } from '@/services/firebase';

export default {
  name: 'CreateWithAIView',
  
  setup() {
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
      router.push('/dashboard');
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
        
        if (savedMaterials.length > 0) {
          // Navigate to the dashboard with the category filter
          router.push('/dashboard?category=' + encodeURIComponent(folderCategory));
        } else {
          error.value = 'Failed to save materials. Please try again.';
        }
        
      } catch (err) {
        console.error('Error saving generated materials:', err);
        error.value = err.message || 'Failed to save study materials';
      } finally {
        loading.value = false;
      }
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
.source-type-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.source-type-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 1rem;
  border: 2px solid var(--neutral-200);
  border-radius: 12px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.source-type-option:hover {
  border-color: var(--primary-color);
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.source-type-option.active {
  border-color: var(--primary-color);
  background-color: rgba(99, 102, 241, 0.05);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.option-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background-color: var(--primary-color);
  border-radius: 50%;
  margin-bottom: 1rem;
  color: white;
}

.option-content h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--neutral-900);
}

.option-content p {
  font-size: 0.875rem;
  color: var(--neutral-600);
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

.btn-content {
  display: flex;
  align-items: center;
}

.mr-2 {
  margin-right: 0.5rem;
}

.ml-2 {
  margin-left: 0.5rem;
}

/* AI Preview Container Styling */
.ai-preview-container {
  animation: fadeIn 0.3s ease;
}

.preview-header {
  margin-bottom: 2rem;
}

.preview-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--neutral-900);
}

.preview-description {
  color: var(--neutral-600);
  font-size: 0.875rem;
}

.ai-loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 0;
  text-align: center;
}

.ai-loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid rgba(99, 102, 241, 0.2);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1.5s linear infinite;
  margin-bottom: 1rem;
}

.loading-description {
  color: var(--neutral-500);
  font-size: 0.875rem;
  max-width: 400px;
  margin-top: 0.5rem;
}

/* Generated Card Styles */
.ai-generated-cards {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.ai-material-card {
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--neutral-200);
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.ai-material-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
}

.card-header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-index {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--primary-color);
  background-color: rgba(99, 102, 241, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
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
  border-radius: 9999px;
  transition: all 0.15s ease;
}

.remove-card-btn:hover {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.card-content-editable {
  animation: fadeIn 0.3s ease;
}

.card-field {
  margin-bottom: 1rem;
}

.card-field:last-child {
  margin-bottom: 0;
}

.card-field-label {
  display: block;
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--neutral-700);
  margin-bottom: 0.5rem;
}

.no-cards-message {
  text-align: center;
  padding: 2rem;
  background-color: var(--neutral-100);
  border-radius: 12px;
  color: var(--neutral-600);
}

.preview-actions {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 2rem;
  gap: 1rem;
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
  
  .action-buttons, .preview-actions {
    flex-direction: column;
  }
  
  .deadline-presets {
    flex-direction: column;
  }
  
  .source-type-options {
    grid-template-columns: 1fr;
  }
}
</style>