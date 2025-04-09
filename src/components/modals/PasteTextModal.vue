<template>
  <div v-if="isVisible" class="modal-backdrop" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Paste Text</h2>
        <button class="close-button" @click="closeModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <p class="modal-description">Paste your text source material to generate open-ended short answer questions covering all content.</p>
        
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
          <label for="content" class="form-label">Content</label>
          <textarea 
            id="content" 
            v-model="content" 
            class="form-textarea" 
            rows="10" 
            placeholder="Paste your text here..."
          ></textarea>
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
  name: 'PasteTextModal',
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
    const content = ref('');
    const isLoading = ref(false);
    
    // Update isVisible when props.visible changes
    watch(() => props.visible, (newValue) => {
      isVisible.value = newValue;
      if (newValue) {
        // Reset form when opening
        title.value = '';
        content.value = '';
      }
    });
    
    const isValid = computed(() => {
      return title.value.trim() !== '' && content.value.trim() !== '';
    });
    
    const closeModal = () => {
      isVisible.value = false;
      emit('close');
    };
    
    const handleSubmit = () => {
      if (!isValid.value) return;
      
      isLoading.value = true;
      
      // Prepare data for submission
      const formData = {
        title: title.value,
        content: content.value
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
      content,
      isLoading,
      isValid,
      closeModal,
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