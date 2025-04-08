<template>
  <div class="practice-test-upload-container">
    <div class="header">
      <h1>Upload Practice Test</h1>
      <p>Upload a document with questions and answers to create a practice test.</p>
    </div>
    
    <div class="content-container">
      <div class="upload-section">
        <div class="file-upload-container">
          <input 
            type="file" 
            id="fileUpload" 
            ref="fileInput"
            @change="handleFileUpload" 
            accept=".pdf,.doc,.docx,.txt"
            class="file-input"
          />
          <label for="fileUpload" class="file-upload-label">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <span v-if="!selectedFile">
              Drag and drop a file here<br>or click to browse
            </span>
            <span v-else>
              {{ selectedFile.name }}
            </span>
          </label>
        </div>
        <p class="file-info">Supported formats: PDF, Word documents, TXT</p>
        
        <div class="form-group">
          <label for="testTitle">Test Title</label>
          <input 
            type="text" 
            id="testTitle" 
            v-model="testTitle" 
            placeholder="Enter a title for your test"
            class="form-control"
          />
        </div>
        
        <div class="options-section">
          <h3>Test Options</h3>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="enableConfidence" />
              <span class="checkbox-text">Enable confidence ratings</span>
            </label>
            <div class="helper-text">Ask students to rate their confidence in answers to identify misconceptions.</div>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="enableMetacognitive" />
              <span class="checkbox-text">Enable metacognitive insights</span>
            </label>
            <div class="helper-text">Analyze answer patterns to provide personalized learning insights.</div>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="enableTimer" />
              <span class="checkbox-text">Enable timer</span>
            </label>
            <div class="helper-text">Set a time limit for each question.</div>
          </div>
          
          <div class="form-group" v-if="enableTimer">
            <label for="timerValue">Time per question (seconds)</label>
            <input 
              type="number" 
              id="timerValue" 
              v-model="timerValue" 
              min="10" 
              max="300"
              class="form-control"
            />
          </div>
        </div>
        
        <div class="action-buttons">
          <button class="btn btn-outline" @click="goBack">Cancel</button>
          <button 
            class="btn btn-primary" 
            :disabled="!selectedFile || !testTitle.trim()" 
            @click="processUploadedFile"
          >
            <span v-if="uploading">
              <svg class="spinner" viewBox="0 0 50 50">
                <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
              </svg>
              Processing...
            </span>
            <span v-else>Create Test</span>
          </button>
        </div>
      </div>
      
      <div class="info-section">
        <div class="info-card">
          <h3>How it works</h3>
          <ol>
            <li>Upload a document containing questions and answers</li>
            <li>Our system will parse the document to extract questions and answers</li>
            <li>Review and edit the questions if needed</li>
            <li>Start practicing with your custom test</li>
          </ol>
          
          <div class="tips-section">
            <h4>Tips for best results</h4>
            <ul>
              <li>Format questions with clear numbering (e.g., "Q1:" or "1.")</li>
              <li>Mark answers clearly (e.g., "A:" or "Answer:")</li>
              <li>For multiple-choice questions, label options with letters (A, B, C, D)</li>
              <li>Keep one question and its answer together</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'PracticeTestUploadView',
  setup() {
    const router = useRouter();
    const fileInput = ref(null);
    const selectedFile = ref(null);
    const testTitle = ref('');
    const uploading = ref(false);
    
    // Test options
    const enableConfidence = ref(true);
    const enableMetacognitive = ref(true);
    const enableTimer = ref(true);
    const timerValue = ref(60);
    
    // Handle file upload
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        selectedFile.value = file;
        
        // Auto-generate title from filename if empty
        if (!testTitle.value.trim()) {
          testTitle.value = file.name.replace(/\.[^/.]+$/, "");
        }
      }
    };
    
    // Process uploaded file
    const processUploadedFile = () => {
      if (!selectedFile.value || !testTitle.value.trim()) return;
      
      uploading.value = true;
      
      // In a real app, you would process the file here
      // For now, we'll simulate a delay and create a mock test
      setTimeout(() => {
        // Create test options object
        const options = {
          confidence: enableConfidence.value,
          metacognitive: enableMetacognitive.value,
          timer: enableTimer.value ? timerValue.value : 0
        };
        
        // Navigate to test taking page with test ID
        // In a real app, you would save the test to the database and get an ID
        const testId = 'test-' + Date.now();
        router.push({
          name: 'PracticeTestTake',
          params: { id: testId },
          query: { 
            title: testTitle.value,
            source: 'upload',
            options: JSON.stringify(options)
          }
        });
        
        uploading.value = false;
      }, 1500);
    };
    
    // Go back to previous page
    const goBack = () => {
      router.back();
    };
    
    // Clean up
    onBeforeUnmount(() => {
      // Reset file input
      if (fileInput.value) {
        fileInput.value.value = '';
      }
      selectedFile.value = null;
    });
    
    return {
      fileInput,
      selectedFile,
      testTitle,
      uploading,
      enableConfidence,
      enableMetacognitive,
      enableTimer,
      timerValue,
      handleFileUpload,
      processUploadedFile,
      goBack
    };
  }
};
</script>

<style scoped>
.practice-test-upload-container {
  padding: var(--spacing-6);
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  margin-bottom: var(--spacing-8);
  text-align: center;
}

.header h1 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--neutral-900);
  margin-bottom: var(--spacing-2);
}

.header p {
  font-size: var(--font-size-lg);
  color: var(--neutral-600);
  max-width: 600px;
  margin: 0 auto;
}

.content-container {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: var(--spacing-8);
}

.upload-section {
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-6);
}

.file-upload-container {
  border: 2px dashed var(--neutral-300);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  text-align: center;
  transition: all var(--transition-normal);
  margin-bottom: var(--spacing-4);
}

.file-upload-container:hover {
  border-color: var(--primary-color);
  background-color: rgba(99, 102, 241, 0.05);
}

.file-input {
  display: none;
}

.file-upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-4);
  cursor: pointer;
  color: var(--neutral-600);
}

.file-upload-label svg {
  color: var(--primary-color);
  opacity: 0.8;
  transition: all var(--transition-normal);
}

.file-upload-label:hover svg {
  opacity: 1;
  transform: translateY(-4px);
}

.file-info {
  font-size: var(--font-size-sm);
  color: var(--neutral-500);
  text-align: center;
  margin-bottom: var(--spacing-4);
}

.form-group {
  margin-bottom: var(--spacing-4);
}

.form-group label {
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

.options-section {
  background-color: var(--neutral-50);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-6);
}

.options-section h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-900);
  margin: 0 0 var(--spacing-4);
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: var(--spacing-1);
}

.checkbox-text {
  margin-left: var(--spacing-2);
  font-weight: var(--font-weight-medium);
  color: var(--neutral-800);
}

.helper-text {
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
  margin-left: var(--spacing-6);
  margin-bottom: var(--spacing-3);
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-3);
}

.btn {
  padding: var(--spacing-2) var(--spacing-6);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.btn-outline {
  background-color: transparent;
  border: 1px solid var(--neutral-300);
  color: var(--neutral-700);
}

.btn-outline:hover {
  background-color: var(--neutral-100);
  border-color: var(--neutral-400);
  color: var(--neutral-900);
}

.btn-primary {
  background-color: var(--primary-color);
  border: 1px solid var(--primary-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-color-dark);
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.info-section {
  align-self: flex-start;
}

.info-card {
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-6);
}

.info-card h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-900);
  margin: 0 0 var(--spacing-4);
}

.info-card ol, .info-card ul {
  padding-left: var(--spacing-6);
  margin-bottom: var(--spacing-4);
}

.info-card li {
  margin-bottom: var(--spacing-2);
  color: var(--neutral-700);
}

.tips-section {
  background-color: var(--primary-color-lightest);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--primary-color);
}

.tips-section h4 {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--primary-color-dark);
  margin: 0 0 var(--spacing-2);
}

.tips-section ul {
  margin-bottom: 0;
}

.tips-section li {
  margin-bottom: var(--spacing-2);
  color: var(--neutral-700);
}

/* Animation for spinner */
.spinner {
  animation: rotate 2s linear infinite;
  width: 20px;
  height: 20px;
  display: inline-block;
  margin-right: var(--spacing-2);
}

.spinner .path {
  stroke: white;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .content-container {
    grid-template-columns: 1fr;
  }
  
  .info-section {
    order: -1;
    margin-bottom: var(--spacing-6);
  }
}
</style>