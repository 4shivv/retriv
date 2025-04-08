<template>
  <div class="study-page">
    <div class="study-header">
      <h1>Paste Text</h1>
      <p class="study-description">Generate practice questions by pasting your text source material</p>
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
      
      <!-- Content Section -->
      <div class="content-section">
        <label for="content" class="section-label">Content</label>
        <div class="input-container">
          <textarea
            id="content"
            v-model="content"
            class="full-input content-textarea"
            rows="10"
            placeholder="Paste your text here..."
          ></textarea>
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
  name: 'PasteTextView',
  
  setup() {
    const router = useRouter();
    const store = useStore();
    const title = ref('');
    const content = ref('');
    const selectedDifficulty = ref('medium');
    const isLoading = ref(false);
    const error = ref('');
    
    const difficultyLevels = [
      { value: 'easy', label: 'Easy' },
      { value: 'medium', label: 'Medium' },
      { value: 'hard', label: 'Hard' }
    ];
    
    const isValid = computed(() => {
      return title.value.trim() !== '' && content.value.trim() !== '';
    });
    
    const handleSubmit = async () => {
      if (!isValid.value) {
        error.value = 'Please enter both a title and content.';
        return;
      }
      
      try {
        isLoading.value = true;
        error.value = '';
        
        // Prepare data for submission
        const formData = {
          title: title.value,
          content: content.value,
          difficulty: selectedDifficulty.value
        };
        
        // Dispatch to store action
        await store.dispatch('practiceTests/createFromPastedText', formData);
        
        // Navigate back to dashboard
        router.push('/dashboard');
      } catch (err) {
        console.error('Error creating practice test:', err);
        error.value = 'Failed to create practice test. Please try again.';
      } finally {
        isLoading.value = false;
      }
    };
    
    const cancel = () => {
      router.push('/dashboard');
    };
    
    return {
      title,
      content,
      selectedDifficulty,
      difficultyLevels,
      isLoading,
      error,
      isValid,
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

.content-textarea {
  min-height: 250px;
  resize: vertical;
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
