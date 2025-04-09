<template>
  <div class="practice-test-card" :class="{ 'in-progress': test.inProgress }">
    <div class="test-header">
      <div class="test-badge" :class="{ 'new': isNew, 'completed': test.completed }">
        {{ badgeText }}
      </div>
      <div class="question-count">
        {{ test.questionCount }} {{ test.questionCount === 1 ? 'Question' : 'Questions' }}
      </div>
    </div>
    
    <h3 class="test-title">{{ test.title }}</h3>
    
    <div class="test-meta">
      <div class="test-date">{{ formattedDate }}</div>
      <div class="test-type">{{ testTypeLabel }}</div>
    </div>
    
    <div v-if="test.completed" class="test-results">
      <div class="progress">
        <div class="progress-bar" :style="{ width: completionPercentage + '%' }" 
             :class="getScoreClass(completionPercentage)"></div>
      </div>
      <span class="progress-text">{{ completionPercentage }}% score</span>
    </div>
    
    <div class="test-actions">
      <button v-if="!test.completed" class="btn btn-primary btn-sm" @click.stop="takeTest">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        <span>Take Test</span>
      </button>
      
      <button v-else class="btn btn-outline btn-sm" @click.stop="reviewTest">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        <span>Review</span>
      </button>
      
      <button class="btn btn-icon btn-sm" @click.stop="$emit('delete-test', test.id)">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'PracticeTestCard',
  props: {
    test: {
      type: Object,
      required: true
    }
  },
  emits: ['delete-test'],
  setup(props) {
    const router = useRouter();
    
    // Format the creation date
    const formattedDate = computed(() => {
      if (!props.test.createdAt) return 'Unknown date';
      
      const date = props.test.createdAt instanceof Date 
        ? props.test.createdAt 
        : new Date(props.test.createdAt);
      
      if (isNaN(date.getTime())) {
        return 'Unknown date';
      }
      
      // Format the date
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        return 'Today';
      } else if (diffDays <= 2) {
        return 'Yesterday';
      } else if (diffDays <= 7) {
        return `${diffDays} days ago`;
      } else {
        return date.toLocaleDateString();
      }
    });
    
    // Determine if the test is new (created within the last 24 hours)
    const isNew = computed(() => {
      if (!props.test.createdAt) return false;
      
      const date = props.test.createdAt instanceof Date 
        ? props.test.createdAt 
        : new Date(props.test.createdAt);
      
      if (isNaN(date.getTime())) {
        return false;
      }
      
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffHours = diffTime / (1000 * 60 * 60);
      
      return diffHours <= 24;
    });
    
    // Calculate completion percentage
    const completionPercentage = computed(() => {
      if (!props.test.completed || !props.test.score) return 0;
      return Math.round(props.test.score * 100);
    });
    
    // Determine the appropriate badge text
    const badgeText = computed(() => {
      if (props.test.inProgress) return 'In Progress';
      if (props.test.completed) return 'Completed';
      if (isNew.value) return 'New';
      return 'Ready';
    });
    
    // Get test type label
    const testTypeLabel = computed(() => {
      if (!props.test.type) return 'Test';
      
      switch (props.test.type) {
        case 'openEndedShortAnswer':
          return 'Short Answer';
        case 'multipleChoice':
          return 'Multiple Choice';
        case 'flashcards':
          return 'Flashcards';
        default:
          return 'Test';
      }
    });
    
    // Get score class based on percentage
    const getScoreClass = (percentage) => {
      if (percentage >= 90) return 'excellent';
      if (percentage >= 80) return 'good';
      if (percentage >= 70) return 'fair';
      return 'needs-improvement';
    };
    
    // Navigate to take the test
    const takeTest = () => {
      router.push(`/study/practice-test/${props.test.id}`);
    };
    
    // Navigate to review the test
    const reviewTest = () => {
      router.push(`/study/practice-test/${props.test.id}/review`);
    };
    
    return {
      formattedDate,
      isNew,
      completionPercentage,
      badgeText,
      testTypeLabel,
      getScoreClass,
      takeTest,
      reviewTest
    };
  }
};
</script>

<style scoped>
.practice-test-card {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-5);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  border: 1px solid var(--neutral-200);
  position: relative;
  overflow: hidden;
}

.practice-test-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-light);
}

.practice-test-card.in-progress {
  border-left: 4px solid #3b82f6;
}

.test-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
}

.test-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: var(--neutral-100);
  color: var(--neutral-600);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.test-badge.new {
  background-color: rgba(99, 102, 241, 0.1);
  color: var(--primary-color);
}

.test-badge.completed {
  background-color: rgba(16, 185, 129, 0.1);
  color: rgb(16, 185, 129);
}

.question-count {
  font-size: var(--font-size-xs);
  color: var(--neutral-500);
  font-weight: var(--font-weight-medium);
}

.test-title {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-3);
  color: var(--neutral-900);
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.test-meta {
  display: flex;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-4);
  color: var(--neutral-500);
  font-size: var(--font-size-xs);
}

.test-results {
  margin-bottom: var(--spacing-4);
}

.progress {
  height: 0.5rem;
  background-color: var(--neutral-200);
  border-radius: var(--radius-full);
  margin-bottom: var(--spacing-2);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: var(--radius-full);
}

.progress-bar.excellent {
  background: linear-gradient(90deg, #10b981, #0ea5e9);
}

.progress-bar.good {
  background: linear-gradient(90deg, #0ea5e9, #6366f1);
}

.progress-bar.fair {
  background: linear-gradient(90deg, #f59e0b, #f97316);
}

.progress-bar.needs-improvement {
  background: linear-gradient(90deg, #f97316, #ef4444);
}

.progress-text {
  font-size: var(--font-size-xs);
  color: var(--neutral-600);
}

.test-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn {
  cursor: pointer;
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-normal);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: var(--primary-gradient);
  color: white;
  padding: 0.5rem 1rem;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-outline {
  background-color: transparent;
  border: 1px solid var(--neutral-300);
  color: var(--neutral-700);
  padding: 0.5rem 1rem;
}

.btn-outline:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.btn-icon {
  background-color: var(--neutral-100);
  color: var(--neutral-600);
  padding: 0.5rem;
  border-radius: var(--radius-md);
}

.btn-icon:hover {
  background-color: var(--neutral-200);
  color: var(--neutral-800);
}

.btn-sm {
  font-size: var(--font-size-sm);
  padding: 0.35rem 0.75rem;
}

.btn-sm svg {
  margin-right: 0.25rem;
}

.btn-icon.btn-sm {
  padding: 0.35rem;
}

.btn-icon.btn-sm svg {
  margin-right: 0;
}
</style>
