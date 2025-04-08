<template>
  <div class="study-page">
    <div class="study-header">
      <h1>Upload File</h1>
      <p class="study-description">Generate practice questions by uploading a document</p>
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
            placeholder="Enter a title for this test"
          />
        </div>
      </div>
      
      <!-- File Upload Section -->
      <div class="content-section">
        <label class="section-label">Upload Document</label>
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
      
      <!-- Preview Section -->
      <div v-if="fileContent" class="content-section">
        <label class="section-label">File Preview</label>
        <div class="file-preview">
          <div class="file-preview-content">{{ filePreview }}</div>
        </div>
      </div>
      
      <!-- Difficulty Level Section -->
      <div class="content-section">
        <label class="section-label">Difficulty Level</label>
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
        <p class="helper-text">Choose the difficulty level of the questions to be generated.</p>
      </div>
      
      <!-- Action Buttons -->
      <div class="action-buttons">
        <button type="button" class="btn btn-outline btn-lg" @click="cancel">Cancel</button>
        <button type="button" @click="handleSubmit" class="btn btn-primary btn-lg" :disabled="isLoading || !isValid">
          <span v-if="isLoading" class="loading-spinner"></span>
          <span v-else>Generate Questions</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'UploadFileView',
  
  setup() {
    const router = useRouter();
    const store = useStore();
    const title = ref('');
    const selectedFile = ref(null);
    const fileContent = ref('');
    const selectedDifficulty = ref('medium');
    const isLoading = ref(false);
    const error = ref('');
    
    const difficultyLevels = [
      { value: 'easy', label: 'Easy' },
      { value: 'medium', label: 'Medium' },
      { value: 'hard', label: 'Hard' }
    ];
    
    const isValid = computed(() => {
      return title.value.trim() !== '' && selectedFile.value !== null;
    });
    
    const filePreview = computed(() => {
      if (!fileContent.value) return '';
      
      // Limit preview to first 500 characters
      const preview = fileContent.value.substring(0, 500);
      return preview + (fileContent.value.length > 500 ? '...' : '');
    });
    
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
      } else {
        // For non-text files, just clear the content preview
        fileContent.value = '';
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
    
    const handleSubmit = async () => {
      if (!isValid.value) {
        error.value = 'Please enter a title and select a file.';
        return;
      }
      
      try {
        isLoading.value = true;
        error.value = '';
        
        // Prepare data for submission
        const formData = {
          title: title.value,
          file: selectedFile.value,
          fileContent: fileContent.value,
          difficulty: selectedDifficulty.value
        };
        
        // Dispatch to store action
        await store.dispatch('practiceTests/createFromFileUpload', formData);
        
        // Navigate back to dashboard
        router.push('/dashboard');
      } catch (err) {
        console.error('Error uploading file:', err);
        error.value = 'Failed to upload file. Please try again.';
      } finally {
        isLoading.value = false;
      }
    };
    
    const cancel = () => {
      router.push('/dashboard');
    };
    
    return {
      title,
      selectedFile,
      fileContent,
      selectedDifficulty,
      difficultyLevels,
      isLoading,
      error,
      isValid,
      filePreview,
      handleFileUpload,
      removeFile,
      formatFileSize,
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

/* File Upload Styling */
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

.file-preview {
  background-color: var(--neutral-50);
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  margin-top: var(--spacing-2);
}

.file-preview-content {
  font-family: monospace;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  font-size: var(--font-size-sm);
  color: var(--neutral-800);
  max-height: 300px;
  overflow-y: auto;
}

.helper-text {
  font-size: 0.875rem;
  color: var(--neutral-600);
  margin-top: 0.5rem;
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

.action-buttons {
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

.btn-outline {
  background-color: white;
  border-color: var(--neutral-300);
  color: var(--neutral-700);
}

.btn-outline:hover {
  background-color: var(--neutral-100);
  border-color: var(--neutral-400);
}

.btn-lg {
  padding: var(--spacing-3) var(--spacing-6);
  font-size: var(--font-size-md);
}

.loading-spinner {
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

.alert {
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-6);
}

.alert-danger {
  background-color: rgba(239, 68, 68, 0.1);
  border-left: 4px solid #ef4444;
}

.alert-text {
  color: var(--neutral-800);
}

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
  
  .btn {
    width: 100%;
  }
}
</style>
