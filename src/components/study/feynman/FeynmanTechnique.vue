<template>
  <div class="feynman-technique">
    <div v-if="showForm">
      <feynman-form
        :material-id="materialId"
        :title="title"
        :content="content"
        @reset="$emit('reset')"
        @completed="handleCompletion"
      />
    </div>
    <div v-else>
      <div class="feynman-header" v-if="nextReviewDate">
        <div class="next-review-alert">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>
            Next review scheduled for <strong>{{ formatReviewDate(nextReviewDate) }}</strong>
          </span>
        </div>
      </div>
      <feynman-view
        :material-id="materialId"
        :title="title"
        @start-feynman="showForm = true"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import FeynmanForm from './FeynmanForm.vue';
import FeynmanView from './FeynmanView.vue';
import StudyService from '@/services/study.service';

export default {
  name: 'FeynmanTechnique',
  components: {
    FeynmanForm,
    FeynmanView
  },
  props: {
    materialId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    startMode: {
      type: String,
      default: 'view', // 'view' or 'form'
      validator: (value) => ['view', 'form'].includes(value)
    }
  },
  emits: ['reset', 'completed'],
  
  setup(props, { emit }) {
    const showForm = ref(props.startMode === 'form');
    const nextReviewDate = ref(null);
    
    const handleCompletion = (result) => {
      showForm.value = false;
      emit('completed', result);
      loadNextReviewDate(); // Refresh the review date after completion
    };
    
    // Load the next scheduled review date for this material
    const loadNextReviewDate = async () => {
      try {
        const reviewDate = await StudyService.getNextReviewDate(props.materialId);
        nextReviewDate.value = reviewDate;
      } catch (error) {
        console.error('Error loading next review date:', error);
      }
    };
    
    // Format the review date for display
    const formatReviewDate = (date) => {
      if (!date) return '';
      
      const now = new Date();
      const reviewDate = new Date(date);
      
      // If it's today
      if (reviewDate.toDateString() === now.toDateString()) {
        return `Today at ${reviewDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
      
      // If it's tomorrow
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (reviewDate.toDateString() === tomorrow.toDateString()) {
        return `Tomorrow at ${reviewDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
      
      // Otherwise show full date
      return reviewDate.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit'
      });
    };
    
    // Load the next review date when component mounts
    onMounted(() => {
      loadNextReviewDate();
    });
    
    return {
      showForm,
      nextReviewDate,
      handleCompletion,
      formatReviewDate
    };
  }
};
</script>

<style scoped>
.feynman-technique {
  width: 100%;
}

.feynman-header {
  margin-bottom: var(--spacing-4);
}

.next-review-alert {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-4);
  background-color: rgba(99, 102, 241, 0.1);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--primary-color);
}

.next-review-alert svg {
  color: var(--primary-color);
  flex-shrink: 0;
}

.next-review-alert span {
  font-size: var(--font-size-sm);
  color: var(--neutral-800);
}
</style>