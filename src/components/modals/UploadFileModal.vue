<template>
  <div v-if="isVisible" class="modal-backdrop" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Upload File</h2>
        <button class="close-button" @click="closeModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <p class="modal-description">Upload a file to generate practice questions based on its content.</p>
        
        <div class="form-group">
          <label for="title" class="form-label">Title</label>
          <input 
            type="text" 
            id="title" 
            v-model="title" 
            class="form-input" 
            placeholder="Enter a title for this material"
          />
        </div>
        
        <div class="form-group">
          <label class="form-label">Upload Document</label>
          <div class="file-upload-container">
            <input
              type="file"
              id="file-upload"
              @change="handleFileUpload"
              class="file-input"
              accept=".txt,.pdf,.doc,.docx,.md"
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
            Supported formats: .txt, .pdf, .doc, .docx, .md
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Difficulty Level</label>
          <div class="difficulty-selector">
            <button 
              v-for="level in difficultyLevels" 
              :key="level.value" 
              @click="selectedDifficulty = level.value" 
              class="difficulty-btn" 
              :class="{ active: selectedDifficulty === level.value }"
            >
              {{ level.label }}
            </button>
          </div>
        </div>
        
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="closeModal">Cancel</button>
          <button class="btn btn-primary" @click="handleSubmit" :disabled="!isValid || isLoading">
            <span v-if="isLoading" class="loading-spinner"></span>
            <span v-else>Generate Questions</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';

export default {
  name: 'UploadFileModal',
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
    const selectedFile = ref(null);
    const fileContent = ref('');
    const selectedDifficulty = ref('medium');
    const isLoading = ref(false);
    
    const difficultyLevels = [
      { value: 'easy', label: 'Easy' },
      { value: 'medium', label: 'Medium' },
      { value: 'hard', label: 'Hard' }
    ];
    
    // Update isVisible when props.visible changes
    watch(() => props.visible, (newValue) => {
      isVisible.value = newValue;
      if (newValue) {
        // Reset form when opening
        title.value = '';
        selectedFile.value = null;
        fileContent.value = '';
        selectedDifficulty.value = 'medium';
      }
    });
    
    const isValid = computed(() => {
      return title.value.trim() !== '' && selectedFile.value !== null;
    });
    
    const closeModal = () => {
      isVisible.value = false;
      emit('close');
    };
    
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      selectedFile.value = file;
      
      // Auto-populate title with file name (without extension)
      if (!title.value.trim()) {
        const fileNameWithoutExt = file.name.split('.').slice(0, -1).join('.');
        title.value = fileNameWithoutExt;
      }
      
      // Read file content for text files
      if (file.type === 'text/plain' || file.name.endsWith('.md')) {
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
      
      // Prepare data for submission
      const formData = {
        title: title.value,
        file: selectedFile.value,
        fileContent: fileContent.value,
        difficulty: selectedDifficulty.value
      };
      
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
      selectedFile,
      selectedDifficulty,
      difficultyLevels,
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

.form-input {
  width: 100%;
  padding: var(--spacing-3);
  border: 1px solid var(--neutral-300);
  border-radius: var(--radius-md);
  font-size: var(--font-size-md);
  transition: all var(--transition-fast);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
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

.difficulty-selector {
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
}

.difficulty-btn {
  padding: var(--spacing-2) var(--spacing-4);
  background-color: var(--neutral-100);
  border: 1px solid var(--neutral-300);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: var(--font-size-sm);
  color: var(--neutral-700);
}

.difficulty-btn:hover {
  background-color: var(--neutral-200);
  border-color: var(--neutral-400);
}

.difficulty-btn.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
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
  .modal-actions {
    flex-direction: column-reverse;
    gap: var(--spacing-2);
  }
  
  .btn {
    width: 100%;
  }
}
</style>