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
      
      <div class="source-type-selector">
      <div class="source-option" 
           :class="{ active: sourceType === 'text' }"
           @click="sourceType = 'text'">
        <div class="option-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <div class="option-label">Source Text</div>
      </div>

      <div class="source-option" 
           :class="{ active: sourceType === 'question' }"
           @click="sourceType = 'question'">
        <div class="option-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <div class="option-label">Ask a Question</div>
      </div>

      <div class="source-option" 
           :class="{ active: sourceType === 'file' }"
           @click="sourceType = 'file'">
        <div class="option-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <path d="M12 18v-6"></path>
            <path d="M8 15h8"></path>
          </svg>
        </div>
        <div class="option-label">Upload a File</div>
      </div>
    </div>

    <div class="input-section">
      <div v-if="sourceType === 'text'">
        <label for="source-text" class="input-label">
          Paste your source material here
          <span class="input-tip">AI will break this down into focused study cards</span>
        </label>
        <textarea 
          id="source-text" 
          v-model="sourceContent" 
          class="input-area"
          placeholder="Paste text from your notes, textbook, or any learning material..."
          rows="10"></textarea>
      </div>

      <div v-else-if="sourceType === 'question'">
        <label for="source-question" class="input-label">
          Enter your question
          <span class="input-tip">AI will create comprehensive study materials to answer this</span>
        </label>
        <textarea 
          id="source-question" 
          v-model="sourceContent" 
          class="input-area"
          placeholder="E.g., 'Explain the process of photosynthesis' or 'How does the electoral college work?'"
          rows="4"></textarea>
      </div>

      <div v-else-if="sourceType === 'file'">
        <label for="source-file" class="input-label">
          Upload a file
          <span class="input-tip">Supported formats: .txt, .pdf, .doc, .docx</span>
        </label>
        <div class="file-upload-area" 
             :class="{ 'has-file': fileUploaded }"
             @click="triggerFileInput"
             @dragover.prevent="dragOver = true"
             @dragleave.prevent="dragOver = false"
             @drop.prevent="handleFileDrop">
          <input 
            type="file" 
            ref="fileInput" 
            @change="handleFileChange" 
            class="file-input" 
            accept=".txt,.pdf,.doc,.docx" />
          
          <div v-if="!fileUploaded" class="upload-placeholder" :class="{ 'drag-over': dragOver }">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <span class="upload-text">
              Drag & drop a file or click to browse
            </span>
          </div>
          
          <div v-else class="file-info">
            <div class="file-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            </div>
            <div class="file-details">
              <div class="file-name">{{ fileName }}</div>
              <div class="file-size">{{ formatFileSize(fileSize) }}</div>
            </div>
            <button class="remove-file" @click.stop="removeFile">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        <div v-if="fileError" class="file-error">{{ fileError }}</div>
      </div>
    </div>

    <div class="generate-options">
      <!-- Card Count Option -->
      <div class="option-group">
        <label class="option-label">
          Number of study cards to generate:
          <div class="counter-input">
            <button class="counter-btn" @click="decrementCardCount" :disabled="cardCount <= 1">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <input type="number" v-model.number="cardCount" min="1" max="20" class="counter-value" />
            <button class="counter-btn" @click="incrementCardCount" :disabled="cardCount >= 20">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
        </label>
      </div>
      
      <!-- Category Selection -->
      <div class="option-group">
        <label class="option-label">Category:</label>
        <select v-model="selectedCategory" class="form-control">
          <option value="" disabled>Select a category</option>
          <!-- System Categories -->
          <optgroup label="Default Categories">
            <option v-for="cat in systemCategories" :key="cat" :value="cat">{{ cat }}</option>
          </optgroup>
          <!-- Custom Categories -->
          <optgroup label="Your Categories" v-if="userCustomCategories.length > 0">
            <option v-for="cat in userCustomCategories" :key="cat" :value="cat">{{ cat }}</option>
          </optgroup>
          <!-- Frequent Categories -->
          <optgroup label="Frequently Used" v-if="frequentCategories.length > 0">
            <option v-for="cat in frequentCategories" :key="cat" :value="cat">{{ cat }}</option>
          </optgroup>
        </select>
      </div>
      
      <!-- Learning Deadline -->
      <div class="option-group">
        <label class="option-label">Learning Deadline (optional):</label>
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
      </div>
    </div>

    <div class="form-actions">
      <button type="button" class="btn btn-outline btn-lg" @click="cancelGeneration">Cancel</button>
      <button type="button" class="btn btn-primary btn-lg" @click="generateMaterials" :disabled="isGenerating || !canGenerate">
        <span v-if="isGenerating" class="loading-spinner"></span>
        <span v-else>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
            <path d="M18.5 22q-1.05 0-1.775-.725T16 19.5q0-1.05.725-1.775T18.5 17q1.05 0 1.775.725T21 19.5q0 1.05-.725 1.775T18.5 22ZM18.5 7q-1.05 0-1.775-.725T16 4.5q0-1.05.725-1.775T18.5 2q1.05 0 1.775.725T21 4.5q0 1.05-.725 1.775T18.5 7ZM5.5 14.5q-1.05 0-1.775-.725T3 12q0-1.05.725-1.775T5.5 9.5q1.05 0 1.775.725T8 12q0 1.05-.725 1.775T5.5 14.5ZM18.5 12l-13 0M18.5 4.5l-13 7.5M18.5 19.5l-13-7.5"></path>
          </svg>
          Generate Study Cards
        </span>
      </button>
    </div>

    <!-- Generated Materials Preview -->
    <div v-if="generatedMaterials.length > 0" class="generated-materials">
      <h3 class="preview-title">Generated Study Cards</h3>
      
      <div class="preview-cards">
        <div 
          v-for="(material, index) in generatedMaterials" 
          :key="index" 
          class="preview-card"
          :class="{ 'selected': material.selected }"
          @click="toggleMaterialSelection(index)">
          <div class="card-header">
            <h4 class="card-title">{{ material.title }}</h4>
            <div class="card-selection">
              <div class="checkbox" :class="{ 'checked': material.selected }">
                <svg v-if="material.selected" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
          </div>
          
          <div class="card-content">
            <p>{{ formatContentForDisplay(material.content) }}</p>
          </div>
        </div>
      </div>
      
      <div class="preview-actions">
        <div class="selection-summary">
          <div class="selection-info">
            {{ selectedCount }} of {{ generatedMaterials.length }} cards selected
          </div>
          <div class="selection-details" v-if="selectedCount > 0">
            <div class="selection-detail-item">
              <span class="detail-label">Category:</span>
              <span class="detail-value">{{ selectedCategory }}</span>
            </div>
            <div class="selection-detail-item" v-if="deadline">
              <span class="detail-label">Learning Deadline:</span>
              <span class="detail-value">
                {{ deadline === 'custom' ? formatCustomDeadline(customDeadlineDate) : 
                  deadline === '1' ? '1 Day' :
                  deadline === '3' ? '3 Days' :
                  deadline === '7' ? '1 Week' :
                  deadline === '14' ? '2 Weeks' :
                  deadline === '30' ? '1 Month' : '' }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="button-group">
          <button type="button" class="btn btn-outline btn-lg" @click="toggleSelectAll">
            {{ allSelected ? 'Deselect All' : 'Select All' }}
          </button>
          <button type="button" class="btn btn-primary btn-lg" @click="saveMaterials" :disabled="selectedCount === 0 || !selectedCategory">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            Save Selected Cards
          </button>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import DeepseekService from '@/services/deepseek.service';
import StudyService from '@/services/study.service';
import { auth } from '@/services/firebase';
import { useRouter } from 'vue-router';

export default {
  name: 'AiGenerateForm',
  emits: ['cancel', 'material-saved', 'materials-saved'],
  
  setup(props, { emit }) {
    const router = useRouter();
    // Form state
    const sourceType = ref('text');
    const sourceContent = ref('');
    const cardCount = ref(5);
    const isGenerating = ref(false);
    const generatedMaterials = ref([]);
    const error = ref('');
    
    // Category and deadline state
    const selectedCategory = ref('');
    const deadline = ref('');
    const customDeadlineDate = ref('');
    
    // Predefined categories
    const systemCategories = [
      'Programming',
      'Languages',
      'Science',
      'Math',
      'History',
      'Art'
    ];
    
    // Custom categories
    const userCustomCategories = ref([]);
    const frequentCategories = ref([]);
    
    // File upload state
    const fileInput = ref(null);
    const fileUploaded = ref(false);
    const fileName = ref('');
    const fileSize = ref(0);
    const fileError = ref('');
    const dragOver = ref(false);
    const fileContent = ref('');
    
    // Computed properties
    const canGenerate = computed(() => {
      if (sourceType.value === 'text' || sourceType.value === 'question') {
        return sourceContent.value.trim().length > 0;
      } else if (sourceType.value === 'file') {
        return fileUploaded.value;
      }
      return false;
    });
    
    const selectedCount = computed(() => {
      return generatedMaterials.value.filter(m => m.selected).length;
    });
    
    const allSelected = computed(() => {
      return generatedMaterials.value.length > 0 && 
             selectedCount.value === generatedMaterials.value.length;
    });
    
    // Methods
    const incrementCardCount = () => {
      if (cardCount.value < 20) {
        cardCount.value++;
      }
    };
    
    const decrementCardCount = () => {
      if (cardCount.value > 1) {
        cardCount.value--;
      }
    };
    
    const triggerFileInput = () => {
      fileInput.value.click();
    };
    
    const handleFileChange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        await processFile(file);
      }
    };
    
    const handleFileDrop = async (event) => {
      dragOver.value = false;
      const file = event.dataTransfer.files[0];
      if (file) {
        await processFile(file);
      }
    };
    
    const processFile = async (file) => {
      // Check file type
      const allowedTypes = [
        'text/plain', 
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        fileError.value = 'Unsupported file type. Please upload a .txt, .pdf, .doc, or .docx file.';
        return;
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        fileError.value = 'File is too large. Maximum size is 10MB.';
        return;
      }
      
      fileError.value = '';
      fileUploaded.value = true;
      fileName.value = file.name;
      fileSize.value = file.size;
      
      // Read file content
      try {
        // For txt files, read directly
        if (file.type === 'text/plain') {
          const reader = new FileReader();
          reader.onload = (e) => {
            fileContent.value = e.target.result;
            sourceContent.value = e.target.result;
          };
          reader.readAsText(file);
        } else {
          // For other files, we would use a library to extract text
          // This is a placeholder - in a real implementation, you would need
          // to use appropriate libraries to extract text from PDFs, DOCs, etc.
          fileContent.value = `Content extracted from ${file.name}`;
          sourceContent.value = fileContent.value;
        }
      } catch (error) {
        console.error('Error reading file:', error);
        fileError.value = 'Error reading file. Please try again.';
      }
    };
    
    const removeFile = () => {
      fileUploaded.value = false;
      fileName.value = '';
      fileSize.value = 0;
      fileContent.value = '';
      sourceContent.value = '';
      fileInput.value.value = null;
    };
    
    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes';
      
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    const generateMaterials = async () => {
      if (!canGenerate.value) return;
      
      isGenerating.value = true;
      error.value = '';
      
      try {
        // Check authentication
        if (!auth.currentUser) {
          error.value = "You must be logged in to generate materials with AI";
          router.push('/login');
          return;
        }
        
        // Check if category is selected
        if (!selectedCategory.value) {
          error.value = 'Please select a category for your study materials';
          return;
        }
        
        let content = sourceContent.value;
        
        // If file is uploaded, use fileContent
        if (sourceType.value === 'file' && fileContent.value) {
          content = fileContent.value;
        }
        
        // Call the DeepseekService to generate materials
        const materials = await DeepseekService.generateStudyMaterials(content, sourceType.value);
        
        // Add selected property to each material
        generatedMaterials.value = materials.map(material => ({ 
          ...material, 
          selected: true 
        }));
        
        // Limit to the requested number of cards
        if (generatedMaterials.value.length > cardCount.value) {
          generatedMaterials.value = generatedMaterials.value.slice(0, cardCount.value);
        }
      } catch (err) {
        console.error('Error generating materials:', err);
        error.value = err.message || 'Failed to generate study materials';
      } finally {
        isGenerating.value = false;
      }
    };
    
    const toggleMaterialSelection = (index) => {
      if (index >= 0 && index < generatedMaterials.value.length) {
        generatedMaterials.value[index].selected = !generatedMaterials.value[index].selected;
      }
    };
    
    const toggleSelectAll = () => {
      const newValue = !allSelected.value;
      generatedMaterials.value.forEach(material => {
        material.selected = newValue;
      });
    };
    
    const saveMaterials = async () => {
      // Filter only selected materials
      const selectedMaterials = generatedMaterials.value.filter(m => m.selected);
      
      if (selectedMaterials.length === 0) {
        return;
      }
      
      if (!selectedCategory.value) {
        error.value = 'Please select a category for your study materials';
        return;
      }
      
      try {
        // Check if user is authenticated
        if (!auth.currentUser) {
          console.error("No authenticated user");
          error.value = "You must be logged in to save materials";
          router.push('/login');
          return;
        }
        
        // Determine deadline in days
        const deadlineDays = getDeadlineInDays();
        
        // Save each material to the database
        const savedMaterials = [];
        
        for (const material of selectedMaterials) {
          const materialId = await StudyService.saveStudyMaterial(
            auth.currentUser.uid,
            material.title,
            material.content,
            selectedCategory.value, // Use the selected category
            deadlineDays           // Use the deadline
          );
          
          savedMaterials.push({
            id: materialId,
            title: material.title,
            content: material.content,
            category: selectedCategory.value,
            deadline: deadlineDays,
            createdAt: new Date(),
            userId: auth.currentUser.uid
          });
        }
        
        // Emit materials saved event
        if (savedMaterials.length === 1) {
          emit('material-saved', savedMaterials[0]);
        } else {
          emit('materials-saved', savedMaterials);
        }
      } catch (err) {
        console.error('Error saving materials:', err);
        error.value = err.message || 'Failed to save study materials';
      }
    };
    
    const cancelGeneration = () => {
      emit('cancel');
    };
    
    // Helper method to format content for display
    const formatContentForDisplay = (content) => {
      // If content is already a string, just return it
      if (typeof content === 'string') {
        return content;
      }
      
      // If content is a JSON string, try to parse it
      if (typeof content === 'string' && 
          (content.trim().startsWith('[') || content.trim().startsWith('```json'))) {
        try {
          // Clean JSON formatting
          const cleaned = content
            .replace(/```json\s*/g, '')
            .replace(/```/g, '')
            .trim();
          
          // Parse the JSON
          const parsed = JSON.parse(cleaned);
          
          // If it's an array with objects that have content fields
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].content) {
            return parsed[0].content;
          }
        } catch (e) {
          // If parsing fails, return the original content
          console.error('Error parsing content for display:', e);
        }
      }
      
      // Default case: return the content as-is or empty string if it's null/undefined
      return content || '';
    };
    
    // Deadline handling
    const minDate = computed(() => {
      const today = new Date();
      return today.toISOString().split('T')[0];
    });
    
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
    
    // Format custom deadline date for display
    const formatCustomDeadline = (dateStr) => {
      if (!dateStr) return '';
      
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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
    
    // Load user's custom categories
    const loadUserCustomCategories = async () => {
      try {
        const materials = await StudyService.getStudyMaterials();
        const customCats = new Set();
        
        materials.forEach(material => {
          if (material.category && !systemCategories.includes(material.category)) {
            customCats.add(material.category);
          }
        });
        
        userCustomCategories.value = Array.from(customCats);
      } catch (err) {
        console.error('Failed to load custom categories:', err);
      }
    };
    
    // Load frequent categories from localStorage
    const loadFrequentCategories = () => {
      const saved = localStorage.getItem('frequentCategories');
      if (saved) {
        try {
          frequentCategories.value = JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse frequent categories:', e);
          frequentCategories.value = [];
        }
      }
    };
    
    // Load categories on mount
    onMounted(() => {
      loadUserCustomCategories();
      loadFrequentCategories();
    });
    
    return {
      sourceType,
      sourceContent,
      cardCount,
      isGenerating,
      generatedMaterials,
      fileInput,
      fileUploaded,
      fileName,
      fileSize,
      fileError,
      dragOver,
      canGenerate,
      selectedCount,
      allSelected,
      selectedCategory,
      deadline,
      customDeadlineDate,
      systemCategories,
      userCustomCategories,
      frequentCategories,
      minDate,
      incrementCardCount,
      decrementCardCount,
      triggerFileInput,
      handleFileChange,
      handleFileDrop,
      removeFile,
      formatFileSize,
      generateMaterials,
      toggleMaterialSelection,
      toggleSelectAll,
      saveMaterials,
      cancelGeneration,
      formatContentForDisplay,
      selectDeadline,
      formatCustomDeadline,
      getDeadlineInDays
    };
  }
};
</script>

<style scoped>
.study-input-form {
  margin-bottom: var(--spacing-8);
}

.option-group {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.form-header {
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-subtitle {
  color: #666;
  font-size: 0.95rem;
}

.source-type-selector {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 0.5rem;
  border: 1px solid #e9ecef;
}

.source-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.source-option:hover {
  background-color: #e9ecef;
}

.source-option.active {
  background-color: #6c5ce7;
  color: white;
}

.option-icon {
  margin-bottom: 0.5rem;
}

.option-label {
  font-size: 0.95rem;
  font-weight: 500;
}

.input-section {
  margin-bottom: 1.5rem;
}

.input-label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
}

.input-tip {
  display: block;
  font-size: 0.85rem;
  font-weight: 400;
  color: #6c757d;
  margin-top: 0.25rem;
}

.input-area {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
  resize: vertical;
}

.input-area:focus {
  outline: none;
  border-color: #6c5ce7;
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.1);
}

.file-upload-area {
  position: relative;
  width: 100%;
  height: 150px;
  border: 2px dashed #ced4da;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
}

.file-upload-area:hover {
  border-color: #6c5ce7;
  background-color: rgba(108, 92, 231, 0.05);
}

.file-upload-area.has-file {
  height: auto;
  min-height: 80px;
  border-style: solid;
  background-color: #f8f9fa;
}

.file-input {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #6c757d;
  padding: 2rem;
}

.upload-placeholder.drag-over {
  background-color: rgba(108, 92, 231, 0.1);
}

.upload-text {
  margin-top: 1rem;
  text-align: center;
}

.file-info {
  display: flex;
  align-items: center;
  padding: 1rem;
  width: 100%;
}

.file-icon {
  margin-right: 1rem;
  color: #6c5ce7;
}

.file-details {
  flex: 1;
}

.file-name {
  font-weight: 500;
  margin-bottom: 0.25rem;
  word-break: break-all;
}

.file-size {
  font-size: 0.85rem;
  color: #6c757d;
}

.remove-file {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.remove-file:hover {
  background-color: rgba(220, 53, 69, 0.1);
}

.file-error {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.generate-options {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.counter-input {
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
}

.counter-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: #e9ecef;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.counter-btn:hover:not(:disabled) {
  background-color: #dee2e6;
}

.counter-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.counter-value {
  width: 50px;
  height: 36px;
  text-align: center;
  margin: 0 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-cancel {
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  color: #495057;
}

.btn-cancel:hover {
  background-color: #e9ecef;
}

.btn-generate {
  background-color: #6c5ce7;
  border: none;
  color: white;
  font-weight: 600;
}

.btn-generate:hover:not(:disabled) {
  background-color: #5b4dc7;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(108, 92, 231, 0.2);
}

.btn-generate:disabled {
  background-color: #a29bfe;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Generated Materials Section */
.generated-materials {
  margin-top: 2rem;
  border-top: 1px solid #e9ecef;
  padding-top: 1.5rem;
}

.preview-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.preview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.preview-card {
  border: 1px solid #e9ecef;
  border-radius: 6px;
  overflow: hidden;
  transition: all 0.2s ease;
  cursor: pointer;
}

.preview-card:hover {
  border-color: #ced4da;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.preview-card.selected {
  border-color: #6c5ce7;
  box-shadow: 0 2px 12px rgba(108, 92, 231, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.card-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #ced4da;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.checkbox.checked {
  background-color: #6c5ce7;
  border-color: #6c5ce7;
  color: white;
}

.card-content {
  padding: 1rem;
  font-size: 0.95rem;
  color: #495057;
  max-height: 200px;
  overflow-y: auto;
}

.preview-actions {
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-6);
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

.selection-summary {
  flex: 1;
}

.button-group {
  display: flex;
  gap: var(--spacing-2);
}

.selection-info {
  font-size: 0.9rem;
  color: var(--neutral-600);
  margin-bottom: var(--spacing-2);
}

.selection-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: var(--neutral-100);
  padding: 0.75rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--neutral-200);
  margin-bottom: 0.5rem;
}

.selection-detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.detail-label {
  font-weight: var(--font-weight-medium);
  color: var(--neutral-600);
}

.detail-value {
  color: var(--neutral-800);
  font-weight: var(--font-weight-semibold);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--spacing-8);
  gap: var(--spacing-4);
}

.mr-2 {
  margin-right: 0.5rem;
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

@media (max-width: 768px) {
  .source-type-selector {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .preview-cards {
    grid-template-columns: 1fr;
  }
  
  .form-actions, .save-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .selection-info {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>