<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Create Blurt Card</h3>
          <button class="close-btn" @click="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="option-cards">
            <div class="option-card" @click="selectOption('manual')">
              <div class="option-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </div>
              <h4 class="option-title">Make Your Own</h4>
              <p class="option-description">Create a Blurt Card manually by entering your own content.</p>
            </div>
            
            <div class="option-card" @click="selectOption('ai')">
              <div class="option-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 8V4H8"></path>
                  <rect x="2" y="2" width="20" height="8" rx="2"></rect>
                  <path d="M2 12h20"></path>
                  <path d="M2 18h20"></path>
                  <path d="M2 22h20"></path>
                </svg>
              </div>
              <h4 class="option-title">Create with AI</h4>
              <p class="option-description">Let AI generate Blurt Cards based on your input or questions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import { watch } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'StudyCardModal',
  
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['close', 'select-option'],
  
  setup(props, { emit }) {
    const router = useRouter();
    
    const closeModal = () => {
      emit('close');
    };
    
    const selectOption = (option) => {
      emit('select-option', option);
      closeModal();
      
      // Navigate to the appropriate page based on selection
      if (option === 'manual') {
        router.push('/study/create');
      } else if (option === 'ai') {
        router.push('/study/create-with-ai');
      }
    };
    
    // If ESC key is pressed, close the modal
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && props.isOpen) {
        closeModal();
      }
    };
    
    // Add/remove event listener for ESC key
    watch(
      () => props.isOpen,
      (isOpen) => {
        if (isOpen) {
          document.addEventListener('keydown', handleEscKey);
          // Prevent scrolling on the body when modal is open
          document.body.style.overflow = 'hidden';
        } else {
          document.removeEventListener('keydown', handleEscKey);
          // Re-enable scrolling when modal is closed
          document.body.style.overflow = '';
        }
      }
    );
    
    return {
      closeModal,
      selectOption
    };
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--spacing-4);
  animation: fadeIn 0.2s ease-out;
  backdrop-filter: blur(2px);
}

.modal-content {
  background-color: white;
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 600px;
  box-shadow: var(--shadow-xl);
  animation: slideUp 0.3s var(--transition-bounce);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-4) var(--spacing-6);
  border-bottom: 1px solid var(--neutral-200);
}

.modal-header h3 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-900);
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: var(--spacing-1);
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  cursor: pointer;
  color: var(--neutral-500);
  transition: all var(--transition-normal);
}

.close-btn:hover {
  background-color: var(--neutral-100);
  color: var(--neutral-700);
}

.modal-body {
  padding: var(--spacing-6);
}

.option-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-4);
}

.option-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-6);
  border-radius: var(--radius-lg);
  border: 1px solid var(--neutral-200);
  background-color: white;
  cursor: pointer;
  transition: all var(--transition-normal);
  text-align: center;
}

.option-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color);
}

.option-icon {
  margin-bottom: var(--spacing-4);
  color: var(--primary-color);
  background-color: rgba(99, 102, 241, 0.1);
  width: 64px;
  height: 64px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-title {
  margin: 0 0 var(--spacing-2) 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-900);
}

.option-description {
  margin: 0;
  color: var(--neutral-600);
  font-size: var(--font-size-sm);
  line-height: 1.5;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@media (max-width: 640px) {
  .option-cards {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    max-width: 100%;
    margin: var(--spacing-4);
    max-height: calc(100vh - var(--spacing-8));
    overflow-y: auto;
  }
}
</style>