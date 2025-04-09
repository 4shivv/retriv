<template>
  <div class="practice-tests-list">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading practice tests...</p>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="practiceTests.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
        </svg>
      </div>
      <h3>No practice tests yet</h3>
      <p>Create your first practice test to start practicing.</p>
      <button class="btn btn-primary" @click="createPracticeTest">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>Create Practice Test</span>
      </button>
    </div>
    
    <!-- Practice Tests Grid -->
    <div v-else class="practice-tests-grid">
      <PracticeTestCard 
        v-for="test in practiceTests" 
        :key="test.id"
        :test="test"
        @delete-test="confirmDeleteTest"
      />
    </div>
    
    <!-- View All Button (if more than 3 tests) -->
    <div v-if="practiceTests.length > 3 && !viewAll" class="view-all-container">
      <button class="btn btn-outline btn-sm view-all-btn" @click="$emit('view-all')">
        View All {{ practiceTests.length }} Practice Tests
      </button>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import PracticeTestCard from './PracticeTestCard.vue';

export default {
  name: 'PracticeTestList',
  components: {
    PracticeTestCard
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    practiceTests: {
      type: Array,
      default: () => []
    },
    viewAll: {
      type: Boolean,
      default: false
    }
  },
  emits: ['create-test', 'delete-test', 'view-all'],
  setup(props, { emit }) {
    const store = useStore();
    
    // Create a new practice test
    const createPracticeTest = () => {
      emit('create-test');
      store.dispatch('modals/openPracticeTestModal');
    };
    
    // Confirm deletion of a test
    const confirmDeleteTest = (testId) => {
      if (confirm('Are you sure you want to delete this practice test? This action cannot be undone.')) {
        emit('delete-test', testId);
      }
    };
    
    return {
      createPracticeTest,
      confirmDeleteTest
    };
  }
};
</script>

<style scoped>
.practice-tests-list {
  width: 100%;
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: var(--neutral-600);
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid rgba(99, 102, 241, 0.2);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-4);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Empty State */
.empty-state {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-8);
  box-shadow: var(--shadow-sm);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 250px;
}

.empty-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--neutral-100);
  color: var(--neutral-500);
  border-radius: 50%;
  margin-bottom: var(--spacing-4);
}

.empty-state h3 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-2);
  color: var(--neutral-900);
}

.empty-state p {
  color: var(--neutral-600);
  margin-bottom: var(--spacing-6);
}

/* Practice Tests Grid */
.practice-tests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-5);
}

/* View All Button */
.view-all-container {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-6);
}

.view-all-btn {
  position: relative;
  overflow: hidden;
  min-width: 200px;
  justify-content: center;
}

.view-all-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

/* Button Styles */
.btn {
  cursor: pointer;
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-normal);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  padding: 0.75rem 1.5rem;
}

.btn-primary {
  background: var(--primary-gradient);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-outline {
  background-color: transparent;
  border: 1px solid var(--neutral-300);
  color: var(--neutral-700);
}

.btn-outline:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.btn-sm {
  font-size: var(--font-size-sm);
  padding: 0.5rem 1rem;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .practice-tests-grid {
    grid-template-columns: 1fr;
  }
}
</style>
