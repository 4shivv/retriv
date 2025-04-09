<template>
  <div v-if="isVisible" class="modal-backdrop" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Create Similar Test</h2>
        <button class="close-button" @click="closeModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <p class="modal-description">Generate similar open-ended short answer questions based on your source material.</p>
        
        <div class="form-group">
          <label for="title" class="form-label">Test Title</label>
          <input 
            type="text" 
            id="title" 
            v-model="title" 
            class="form-input" 
            placeholder="Enter a title for this test"
          />
        </div>
        
        <div class="form-group">
          <label class="form-label">Source Type</label>
          <div class="source-selector">
            <button 
              @click="sourceType = 'manual'" 
              class="source-btn" 
              :class="{ active: sourceType === 'manual' }"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="17" y1="10" x2="3" y2="10"></line>
                <line x1="21" y1="6" x2="3" y2="6"></line>
                <line x1="21" y1="14" x2="3" y2="14"></line>
                <line x1="17" y1="18" x2="3" y2="18"></line>
              </svg>
              <span>Paste Questions</span>
            </button>
            
            <button 
              @click="sourceType = 'file'" 
              class="source-btn" 
              :class="{ active: sourceType === 'file' }"
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
        
        <!-- Manual input form -->
        <div v-if="sourceType === 'manual'" class="form-group">
          <label for="questions" class="form-label">Enter Questions and Answers</label>
          <div class="help-text">Enter your source questions and answers. AI will generate a similar set of open-ended short answer questions.</div>
          <textarea 
            id="questions" 
            v-model="manualQuestions" 
            class="form-textarea" 
            rows="10" 
            placeholder="Question 1: What is the capital of France?
Answer: Paris

Question 2: Who wrote Romeo and Juliet?
Answer: William Shakespeare"
          ></textarea>
        </div>
        
        <!-- File upload form -->
        <div v-if="sourceType === 'file'" class="form-group">
          <label class="form-label">Upload Questions File</label>
          <div class="file-upload-container">
            <input
              type="file"
              id="file-upload"
              @change="handleFileUpload"
              class="file-input"
              accept=".txt,.csv,.md"
              :disabled="isLoading"
            />
            <label for="file-upload" class="file-upload-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span>Choose file or drop file here</span>
            </label>
          </div>
          <div v-if="selectedFile" class="selected-file">
            <div class="file-info">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <div class="file-details">
                <div class="file-name">{{ selectedFile.name }}</div>
                <div class="file-size">{{ formatFileSize(selectedFile.size) }}</div>
              </div>
            </div>
            <button class="remove-file-btn" @click="removeFile">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="file-formats">
            Supported formats: .txt, .csv, .md
          </div>
        </div>
        
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="closeModal">Cancel</button>
          <button class="btn btn-primary" @click="handleSubmit" :disabled="!isValid || isLoading">
            <span v-if="isLoading" class="loading-spinner"></span>
            <span v-else>Generate Similar Test</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';

export default {
  name: 'CreateSimilarTestModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const isVisible = ref(props.visible);
    const title = ref('');
    const sourceType = ref('manual');
    const manualQuestions = ref('');
    const selectedFile = ref(null);
    const fileContent = ref('');
    const isLoading = ref(false);
    
    // Update isVisible when props.visible changes
    watch(() => props.visible, (newValue) => {
      isVisible.value = newValue;
      if (newValue) {
        // Reset form when opening
        resetForm();
      }
    });
    
    const resetForm = () => {
      title.value = '';
      sourceType.value = 'manual';
      manualQuestions.value = '';
      selectedFile.value = null;
      fileContent.value = '';
    };
    
    const isValid = computed(() => {
      if (!title.value.trim()) return false;
      
      switch (sourceType.value) {
        case 'manual':
          return manualQuestions.value.trim() !== '';
        case 'file':
          return selectedFile.value !== null;
        default:
          return false;
      }
    });
    
    const closeModal = () => {
      isVisible.value = false;
      emit('close');
    };
    
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      selectedFile.value = file;
      
      // Auto-populate title if empty
      if (!title.value.trim()) {
        const fileNameWithoutExt = file.name.split('.').slice(0, -1).join('.');
        title.value = `Similar to ${fileNameWithoutExt}`;
      }
      
      // Read file content for text files
      if (file.type === 'text/plain' || file.type === 'text/csv' || file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          fileContent.value = e.target.result;
        };
        reader.readAsText(file);
      }
    };
    
    const removeFile = () => {
      selectedFile.value = null;
      fileContent.value = '';
    };
    
    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes';
      
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    const handleSubmit = () => {
      if (!isValid.value) return;
      
      isLoading.value = true;
      
      // Count questions in source to determine how many to generate
      let questionCount = 0;
      
      if (sourceType.value === 'manual') {
        // Estimate question count from manual input
        const matches = manualQuestions.value.match(/question|q:/gi);
        questionCount = matches ? matches.length : 5; // Default to 5 if can't determine
      } else if (sourceType.value === 'file') {
        // Estimate question count from file content
        const matches = fileContent.value.match(/question|q:/gi);
        questionCount = matches ? matches.length : 5; // Default to 5 if can't determine
      }
      
      // Prepare data for submission based on sourceType
      let formData = {
        title: title.value,
        estimatedQuestionCount: questionCount
      };
      
      switch (sourceType.value) {
        case 'manual':
          formData.sourceType = 'manual';
          formData.questions = manualQuestions.value;
          break;
        case 'file':
          formData.sourceType = 'file';
          formData.file = selectedFile.value;
          formData.fileContent = fileContent.value;
          break;
      }
      
      // Emit the data to the parent component
      emit('submit', formData);
      
      // Close modal and reset loading state
      setTimeout(() => {
        isLoading.value = false;
        closeModal();
      }, 500);
    };
    
    return {
      isVisible,
      title,
      sourceType,
      manualQuestions,
      selectedFile,
      isLoading,
      isValid,
      closeModal,
      handleFileUpload,
      removeFile,
      formatFileSize,
      handleSubmit
    };
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.2s ease;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.modal-content {
  background-color: white;
  border-radius: var(--radius-lg);
  width: 800px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
  animation: scaleIn 0.2s ease;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-4) var(--spacing-6);
  border-bottom: 1px solid var(--neutral-200);
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 10;
}

.modal-header h2 {
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

.modal-description {
  text-align: center;
  color: var(--neutral-600);
  margin-bottom: var(--spacing-6);
  font-size: var(--font-size-md);
}

.form-group {
  margin-bottom: var(--spacing-6);
}

.form-label {
  display: block;
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-2);
  color: var(--neutral-800);
}

.help-text {
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
  margin-bottom: var(--spacing-2);
}

.form-input, .form-textarea {
  width: 100%;
  padding: var(--spacing-3);
  border: 1px solid var(--neutral-300);
  border-radius: var(--radius-md);
  font-size: var(--font-size-md);
  transition: all var(--transition-fast);
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.form-textarea {
  resize: vertical;
  min-height: 200px;
  font-family: inherit;
}

.source-selector {
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
  margin-bottom: var(--spacing-4);
}

.source-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-4);
  background-color: var(--neutral-100);
  border: 1px solid var(--neutral-300);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: var(--font-size-sm);
  color: var(--neutral-700);
  flex: 1;
  justify-content: center;
}

.source-btn:hover {
  background-color: var(--neutral-200);
  border-color: var(--neutral-400);
}

.source-btn.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.source-btn.active svg {
  color: white;
}

.source-btn svg {
  color: var(--primary-color);
}

.file-upload-container {
  margin-bottom: var(--spacing-3);
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-3);
  padding: var(--spacing-6);
  border: 2px dashed var(--neutral-300);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--neutral-600);
  background-color: var(--neutral-50);
}

.file-upload-label:hover {
  border-color: var(--primary-color);
  background-color: rgba(99, 102, 241, 0.05);
  color: var(--primary-color);
}

.file-upload-label svg {
  color: var(--primary-color);
}

.selected-file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-3) var(--spacing-4);
  background-color: var(--neutral-50);
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-3);
}

.file-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.file-details {
  display: flex;
  flex-direction: column;
}

.file-name {
  font-weight: var(--font-weight-medium);
  color: var(--neutral-800);
  margin-bottom: var(--spacing-1);
}

.file-size {
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
}

.remove-file-btn {
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

.remove-file-btn:hover {
  background-color: var(--neutral-200);
  color: var(--neutral-900);
}

.file-formats {
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
  margin-top: var(--spacing-2);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-4);
  margin-top: var(--spacing-8);
}

.btn {
  padding: var(--spacing-2) var(--spacing-6);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-md);
  border: 1px solid transparent;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: white;
  border-color: var(--neutral-300);
  color: var(--neutral-700);
}

.btn-secondary:hover {
  background-color: var(--neutral-100);
  border-color: var(--neutral-400);
}

.loading-spinner {
  width: 1.25rem;
  height: 1.25rem;
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
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .source-selector {
    flex-direction: column;
  }
  
  .modal-actions {
    flex-direction: column-reverse;
    gap: var(--spacing-2);
  }
  
  .btn {
    width: 100%;
  }
}
</style>