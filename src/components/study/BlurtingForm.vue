<template>
  <div class="blurting-form card">
    <div class="card-header">
      <h3>{{ title }}</h3>
      <div class="timer-badge" :class="timeLeft.includes('0:') ? 'urgent' : ''">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span>{{ timeLeft }}</span>
      </div>
    </div>
    
    <div class="card-body">
      <div v-if="!submitted" class="instructions">
        <p>
          Now, try to recall the content you just studied. Type as much as you can remember without looking at the original material. This "blurting" technique helps strengthen your memory.
        </p>
      </div>
      
      <form @submit.prevent="handleSubmit" v-if="!submitted">
        <div class="form-group">
          <textarea
            v-model="recalledText"
            class="form-control"
            rows="12"
            placeholder="Start typing what you remember..."
            :disabled="loading"
            autofocus
          ></textarea>
        </div>
        
        <div class="form-actions">
          <button 
            type="submit" 
            class="btn btn-primary" 
            :disabled="loading"
          >
            <span v-if="loading" class="loading-spinner"></span>
            <span v-else>Submit Recall</span>
          </button>
        </div>
      </form>
      
      <div v-if="submitted" class="results-section">
        <h4 class="results-title">Your Results</h4>
        
        <div class="match-percentage text-center">
          <div class="percentage-display">
            <svg viewBox="0 0 36 36" class="circular-chart">
              <path class="circle-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path class="circle" :class="matchPercentageClass"
                :stroke-dasharray="`${matchPercentage}, 100`"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.35" class="percentage">{{ matchPercentage }}%</text>
            </svg>
          </div>
          <p class="percentage-label">
            <strong>Recall Score</strong>
          </p>
        </div>
        
        <div class="comparison-container">
          <div class="tabs">
            <button 
              @click="activeTab = 'heatmap'" 
              class="tab-button" 
              :class="{ active: activeTab === 'heatmap' }"
            >
              Heatmap View
            </button>
            <button 
              @click="activeTab = 'split'" 
              class="tab-button" 
              :class="{ active: activeTab === 'split' }"
            >
              Split View
            </button>
          </div>
          
          <div class="tab-content">
            <div v-if="activeTab === 'heatmap'" class="heatmap-section">
              <h5>Comparison Heatmap</h5>
              <div class="heatmap-container">
                <p>
                  <template v-for="(item, index) in heatmapData.original" :key="index">
                    <span 
                      class="heatmap-text" 
                      :class="{ 'heatmap-matched': item.matched, 'heatmap-unmatched': !item.matched }"
                    >
                      {{ item.word }}
                    </span>
                  </template>
                </p>
              </div>
              <div class="heatmap-legend">
                <div class="legend-item">
                  <span class="legend-color matched"></span>
                  <span>Remembered</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color unmatched"></span>
                  <span>Missed</span>
                </div>
              </div>
            </div>
            
            <div v-else-if="activeTab === 'split'" class="split-view">
              <div class="split-section">
                <h5>Original Text</h5>
                <div class="split-content original">
                  {{ originalText }}
                </div>
              </div>
              
              <div class="split-section">
                <h5>Your Recall</h5>
                <div class="split-content recall">
                  {{ recalledText }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="next-steps">
          <h5>Recommended Review Schedule</h5>
          <p class="schedule-intro">
            Based on your performance, we recommend reviewing this material at:
          </p>
          <ul class="schedule-list">
            <li v-for="(date, index) in reviewSchedule" :key="index" class="schedule-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{{ formatDate(date) }}</span>
            </li>
          </ul>
          
          <div class="actions-row">
            <button @click="handleReset" class="btn btn-primary">
              Study Something Else
            </button>
            <button @click="handleStudyAgain" class="btn btn-outline">
              Practice Again
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
// Removed unused store import
import StudyService from '@/services/study.service';
import ComparisonService from '@/services/comparison.service';
import { auth } from '@/services/firebase';

export default {
  name: 'BlurtingForm',
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
    }
  },
  emits: ['reset', 'study-again'],
  
  setup(props, { emit }) {
    const recalledText = ref('');
    const submitted = ref(false);
    const loading = ref(false);
    const matchPercentage = ref(0);
    const heatmapData = ref({ original: [], recalled: [] });
    const reviewSchedule = ref([]);
    const countdownTimerValue = ref(300); // 5 minutes in seconds
    const countdownTimer = ref(null);
    const activeTab = ref('heatmap');
    const originalText = ref(props.content);
    
    const router = useRouter();
    // Removed unused store variable
    
    const timeLeft = computed(() => {
      const minutes = Math.floor(countdownTimerValue.value / 60);
      const seconds = countdownTimerValue.value % 60;
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    });
    
    const matchPercentageClass = computed(() => {
      if (matchPercentage.value >= 80) return 'high';
      if (matchPercentage.value >= 60) return 'medium';
      if (matchPercentage.value >= 40) return 'low';
      return 'very-low';
    });
    
    const startCountdown = () => {
      countdownTimer.value = setInterval(() => {
        if (countdownTimerValue.value > 0) {
          countdownTimerValue.value -= 1;
        } else {
          clearInterval(countdownTimer.value);
          if (!submitted.value) {
            handleSubmit();
          }
        }
      }, 1000);
    };
    
    const handleSubmit = async () => {
      try {
        loading.value = true;
        
        // Stop the timer
        clearInterval(countdownTimer.value);
        
        // Compare the texts
        const comparisonResult = ComparisonService.compareTexts(
          props.content,
          recalledText.value
        );
        
        matchPercentage.value = comparisonResult.matchPercentage;
        heatmapData.value = comparisonResult.heatmapData;
        
        // Save the attempt
        if (!auth.currentUser) {
          router.push('/login');
          return;
        }
        
        const attemptId = await StudyService.saveStudyAttempt(
          props.materialId,
          recalledText.value,
          matchPercentage.value
        );
        
        // Generate review schedule
        reviewSchedule.value = await StudyService.generateSpacedRepetitionSchedule(
          attemptId,
          matchPercentage.value
        );
        
        submitted.value = true;
        
      } catch (err) {
        console.error('Failed to process recall:', err);
      } finally {
        loading.value = false;
      }
    };
    
    const handleReset = () => {
      emit('reset');
    };
    
    const handleStudyAgain = () => {
      // Reset the form to practice with the same material
      submitted.value = false;
      recalledText.value = '';
      matchPercentage.value = 0;
      heatmapData.value = { original: [], recalled: [] };
      countdownTimerValue.value = 300; // Reset timer to 5 minutes
      
      // Notify parent component
      emit('study-again');
      
      // Start the countdown again
      startCountdown();
    };
    
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }).format(date);
    };
    
    onMounted(() => {
      startCountdown();
    });
    
    onBeforeUnmount(() => {
      if (countdownTimer.value) {
        clearInterval(countdownTimer.value);
      }
    });
    
    return {
      recalledText,
      submitted,
      loading,
      matchPercentage,
      heatmapData,
      reviewSchedule,
      timeLeft,
      matchPercentageClass,
      activeTab,
      originalText,
      handleSubmit,
      handleReset,
      handleStudyAgain,
      formatDate
    };
  }
}
</script>

<style scoped>
.blurting-form {
  margin-bottom: var(--spacing-lg);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin-bottom: 0;
  font-weight: var(--font-weight-semibold);
}

.timer-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: 0.35rem 0.75rem;
  background-color: var(--neutral-100);
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-medium);
  color: var(--neutral-700);
  font-size: var(--font-size-sm);
}

.timer-badge.urgent {
  background-color: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.instructions {
  margin-bottom: var(--spacing-6);
  padding: var(--spacing-4);
  background-color: rgba(99, 102, 241, 0.05);
  border-left: 3px solid var(--primary-color);
  border-radius: var(--radius-md);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--spacing-6);
}

/* Results Section */
.results-section {
  animation: fadeIn 0.5s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.results-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-6);
  text-align: center;
}

/* Circular Percentage Display */
.percentage-display {
  width: 150px;
  height: 150px;
  margin: 0 auto var(--spacing-4);
}

.circular-chart {
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
}

.circle-bg {
  fill: none;
  stroke: var(--neutral-200);
  stroke-width: 3;
}

.circle {
  fill: none;
  stroke-width: 3;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  transition: stroke-dasharray 1s ease;
}

.circle.high {
  stroke: #10b981;
}

.circle.medium {
  stroke: #06b6d4;
}

.circle.low {
  stroke: #f59e0b;
}

.circle.very-low {
  stroke: #ef4444;
}

.percentage {
  fill: var(--neutral-900);
  font-size: 0.4em;
  font-weight: var(--font-weight-bold);
  text-anchor: middle;
  font-family: var(--font-family-base);
}

.percentage-label {
  text-align: center;
  color: var(--neutral-700);
}

/* Comparison Tabs */
.comparison-container {
  margin-top: var(--spacing-8);
  margin-bottom: var(--spacing-8);
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.tabs {
  display: flex;
  background-color: var(--neutral-100);
  border-bottom: 1px solid var(--neutral-200);
}

.tab-button {
  flex: 1;
  padding: var(--spacing-3) var(--spacing-4);
  background-color: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-normal);
  color: var(--neutral-600);
}

.tab-button.active {
  border-bottom-color: var(--primary-color);
  color: var(--primary-color);
}

.tab-button:hover:not(.active) {
  background-color: rgba(99, 102, 241, 0.05);
  color: var(--neutral-900);
}

.tab-content {
  padding: var(--spacing-6);
}

/* Heatmap */
.heatmap-section h5,
.split-section h5 {
  margin-bottom: var(--spacing-4);
  font-weight: var(--font-weight-semibold);
}

.heatmap-container {
  background-color: var(--neutral-50);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-4);
  line-height: 1.8;
}

.heatmap-text {
  position: relative;
  margin-right: 3px;
  padding: 2px 4px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.heatmap-matched {
  background-color: rgba(16, 185, 129, 0.15);
}

.heatmap-matched::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #10b981;
}

.heatmap-unmatched {
  background-color: rgba(239, 68, 68, 0.1);
}

.heatmap-unmatched::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #ef4444;
}

.heatmap-legend {
  display: flex;
  gap: var(--spacing-6);
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-sm);
  color: var(--neutral-700);
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: var(--radius-sm);
}

.legend-color.matched {
  background-color: rgba(16, 185, 129, 0.15);
  border-bottom: 2px solid #10b981;
}

.legend-color.unmatched {
  background-color: rgba(239, 68, 68, 0.1);
  border-bottom: 2px solid #ef4444;
}

/* Split View */
.split-view {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-4);
}

.split-content {
  background-color: var(--neutral-50);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  height: 250px;
  overflow-y: auto;
  font-size: var(--font-size-sm);
  line-height: 1.6;
}

.split-content.original {
  border-left: 3px solid var(--primary-color);
}

.split-content.recall {
  border-left: 3px solid var(--secondary-color);
}

/* Next Steps */
.next-steps {
  background-color: var(--neutral-50);
  padding: var(--spacing-6);
  border-radius: var(--radius-lg);
}

.next-steps h5 {
  margin-bottom: var(--spacing-4);
  font-weight: var(--font-weight-semibold);
}

.schedule-intro {
  margin-bottom: var(--spacing-4);
  color: var(--neutral-700);
}

.schedule-list {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--spacing-6) 0;
}

.schedule-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) 0;
  border-bottom: 1px solid var(--neutral-300);
  font-weight: var(--font-weight-medium);
}

.schedule-item:last-child {
  border-bottom: none;
}

.actions-row {
  display: flex;
  gap: var(--spacing-4);
}

.loading-spinner {
  display: inline-block;
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

/* Responsive styles */
@media (max-width: 768px) {
  .split-view {
    grid-template-columns: 1fr;
  }
  
  .actions-row {
    flex-direction: column;
  }
  
  .actions-row .btn {
    width: 100%;
  }
}
</style>