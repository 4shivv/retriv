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
      <!-- Display any error that occurred -->
      <div v-if="error" class="alert alert-danger mb-4">
        <div class="alert-content">
          <div class="alert-text">{{ error }}</div>
        </div>
      </div>
      
      <div v-if="!submitted" class="instructions">
        <p>
          Now, try to recall the content you just studied. Type as much as you can remember without looking at the original material. This "blurting" technique helps strengthen your memory.
        </p>
        <div v-if="pastAttempts && pastAttempts.length > 0" class="past-attempts-summary">
          <h4>Your Past Performance</h4>
          <div class="attempts-chart">
            <div class="chart-bars">
              <div v-for="(attempt, index) in pastAttempts.slice(0, 5)" :key="index" class="chart-bar-container">
                <div class="chart-bar" :style="{ height: `${attempt.matchPercentage}%` }" :class="getScoreClass(attempt.matchPercentage)">
                  <span class="chart-value">{{ attempt.matchPercentage }}%</span>
                </div>
                <div class="chart-label">{{ formatShortDate(attempt.timestamp) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <form @submit.prevent="handleSubmitRecall" v-if="!submitted">
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

          <div v-if="pastAttempts && pastAttempts.length > 0" class="performance-trend">
            <div v-if="isImproving" class="trend-badge improving">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
              <span>Improving</span>
            </div>
            <div v-else-if="isDecreasing" class="trend-badge decreasing">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
              <span>Decreasing</span>
            </div>
            <div v-else class="trend-badge stable">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Stable</span>
            </div>
            
            <div class="attempt-number">Attempt #{{ attemptNumber }}</div>
          </div>
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
            <button 
              @click="activeTab = 'history'" 
              class="tab-button" 
              :class="{ active: activeTab === 'history' }"
            >
              History
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

            <div v-else-if="activeTab === 'history'" class="history-view">
              <h5>Study History</h5>
              <div v-if="pastAttempts && pastAttempts.length > 0" class="performance-history">
                <div class="history-chart">
                  <div class="chart-line">
                    <div class="chart-y-axis">
                      <div class="y-axis-tick">100%</div>
                      <div class="y-axis-tick">75%</div>
                      <div class="y-axis-tick">50%</div>
                      <div class="y-axis-tick">25%</div>
                      <div class="y-axis-tick">0%</div>
                    </div>
                    <div class="chart-content">
                      <div class="threshold-line" style="bottom: 80%;">Excellent (80%)</div>
                      <div class="threshold-line" style="bottom: 50%;">Average (50%)</div>
                      <div class="chart-points">
                        <div 
                          v-for="(attempt, index) in pastAttempts" 
                          :key="index" 
                          class="chart-point" 
                          :class="getScoreClass(attempt.matchPercentage)"
                          :style="{ left: `${(index / (pastAttempts.length - 1)) * 100}%`, bottom: `${attempt.matchPercentage}%` }"
                          @mouseover="showTooltip(index)"
                          @mouseleave="hideTooltip()"
                        >
                          <div v-if="tooltipIndex === index" class="chart-tooltip">
                            <div class="tooltip-date">{{ formatDateWithTime(attempt.timestamp) }}</div>
                            <div class="tooltip-score">Score: {{ attempt.matchPercentage }}%</div>
                          </div>
                        </div>
                      </div>
                      <svg class="chart-line-svg" :viewBox="`0 0 ${pastAttempts.length - 1} 100`" preserveAspectRatio="none">
                        <polyline 
                          :points="getChartLinePoints()" 
                          fill="none" 
                          stroke="rgba(99, 102, 241, 0.6)" 
                          stroke-width="2"
                        />
                      </svg>
                    </div>
                  </div>
                  <div class="chart-x-axis">
                    <div 
                      v-for="(attempt, index) in pastAttempts" 
                      :key="index" 
                      class="x-axis-tick"
                      :style="{ left: `${(index / (pastAttempts.length - 1)) * 100}%` }"
                    >
                      {{ formatShortDate(attempt.timestamp) }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="no-history">
                <p>No previous study history for this material.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="next-steps">
          <h5>Spaced Repetition Schedule</h5>
          <p class="schedule-intro">
            Based on your performance, you should review this material at these times to strengthen your memory:
          </p>
          <ul class="schedule-list">
            <li v-for="(date, index) in reviewSchedule" :key="index" class="schedule-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{{ formatDateWithTime(date) }}</span>
              <span class="interval-label">{{ getIntervalLabel(date) }}</span>
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
    const pastAttempts = ref([]);
    const attemptNumber = ref(1);
    const tooltipIndex = ref(null);
    const error = ref(''); // Add error state
    
    const router = useRouter();
    
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

    const isImproving = computed(() => {
      if (pastAttempts.value.length < 2) return false;
      
      const previousScore = pastAttempts.value[0].matchPercentage;
      const currentScore = matchPercentage.value;
      
      return currentScore > previousScore + 5; // At least 5% improvement
    });

    const isDecreasing = computed(() => {
      if (pastAttempts.value.length < 2) return false;
      
      const previousScore = pastAttempts.value[0].matchPercentage;
      const currentScore = matchPercentage.value;
      
      return previousScore > currentScore + 5; // At least 5% decrease
    });
    
    const startCountdown = () => {
      countdownTimer.value = setInterval(() => {
        if (countdownTimerValue.value > 0) {
          countdownTimerValue.value -= 1;
        } else {
          clearInterval(countdownTimer.value);
          if (!submitted.value) {
            handleSubmitRecall();
          }
        }
      }, 1000);
    };

    const fetchPastAttempts = async () => {
      try {
        console.log("Fetching past attempts for material:", props.materialId);
        const attempts = await StudyService.getStudyAttempts(props.materialId);
        console.log("Retrieved attempts:", attempts);
        pastAttempts.value = attempts;
        
        // Set the attempt number based on past attempts
        attemptNumber.value = attempts.length + 1;
      } catch (err) {
        console.error('Failed to fetch past attempts:', err);
        error.value = `Failed to fetch past attempts: ${err.message}`;
      }
    };
    
    // Changed function name to avoid confusion with form's submit event
    const handleSubmitRecall = async () => {
      try {
        // Reset error
        error.value = '';
        
        // Validate input
        if (!recalledText.value.trim()) {
          error.value = 'Please enter some text before submitting.';
          return;
        }
        
        console.log("Starting recall submission...");
        loading.value = true;
        
        // Stop the timer
        if (countdownTimer.value) {
          clearInterval(countdownTimer.value);
        }
        
        // Check authentication early
        if (!auth.currentUser) {
          console.error("User not authenticated");
          router.push('/login');
          return;
        }
        
        console.log("Comparing texts...");
        // Compare the texts
        const comparisonResult = ComparisonService.compareTexts(
          props.content,
          recalledText.value
        );
        
        console.log("Comparison result:", comparisonResult);
        matchPercentage.value = comparisonResult.matchPercentage;
        heatmapData.value = comparisonResult.heatmapData;
        
        console.log("Saving study attempt...");
        // Save the attempt
        const attemptId = await StudyService.saveStudyAttempt(
          props.materialId,
          recalledText.value,
          matchPercentage.value
        );
        
        console.log("Attempt saved with ID:", attemptId);
        
        console.log("Generating spaced repetition schedule...");
        // Generate review schedule
        reviewSchedule.value = await StudyService.generateSpacedRepetitionSchedule(
          attemptId,
          matchPercentage.value
        );
        
        console.log("Generated review schedule:", reviewSchedule.value);
        
        // Refresh past attempts to include this one
        await fetchPastAttempts();
        
        submitted.value = true;
        console.log("Submission complete!");
        
      } catch (err) {
        console.error('Failed to process recall:', err);
        error.value = `Failed to process recall: ${err.message}`;
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
      error.value = '';
      
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
        year: 'numeric'
      }).format(date);
    };

    const formatDateWithTime = (dateString) => {
      if (!dateString) return 'N/A';
      
      const date = typeof dateString === 'object' && dateString.toDate ? 
        dateString.toDate() : new Date(dateString);
      
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }).format(date);
    };

    const formatShortDate = (dateString) => {
      if (!dateString) return '';
      
      const date = typeof dateString === 'object' && dateString.toDate ? 
        dateString.toDate() : new Date(dateString);
      
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      }).format(date);
    };

    const getIntervalLabel = (dateString) => {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(date - now);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      
      if (diffDays > 0) {
        return diffDays === 1 ? '(In 1 day)' : `(In ${diffDays} days)`;
      } else if (diffHours > 0) {
        return diffHours === 1 ? '(In 1 hour)' : `(In ${diffHours} hours)`;
      } else {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return diffMinutes <= 1 ? '(Soon)' : `(In ${diffMinutes} minutes)`;
      }
    };

    const getScoreClass = (score) => {
      if (score >= 90) return 'excellent';
      if (score >= 80) return 'good';
      if (score >= 70) return 'fair';
      if (score >= 50) return 'poor';
      return 'very-poor';
    };

    const showTooltip = (index) => {
      tooltipIndex.value = index;
    };

    const hideTooltip = () => {
      tooltipIndex.value = null;
    };

    const getChartLinePoints = () => {
      if (!pastAttempts.value || pastAttempts.value.length < 2) return '';
      
      return pastAttempts.value.map((attempt, index) => 
        `${index}, ${attempt.matchPercentage}`
      ).join(' ');
    };
    
    onMounted(async () => {
      console.log("BlurtingForm mounted with materialId:", props.materialId);
      // Fetch past attempts for this material
      await fetchPastAttempts();
      
      // Start the countdown
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
      pastAttempts,
      attemptNumber,
      tooltipIndex,
      isImproving,
      isDecreasing,
      error,
      handleSubmitRecall,
      handleReset,
      handleStudyAgain,
      formatDate,
      formatDateWithTime,
      formatShortDate,
      getIntervalLabel,
      getScoreClass,
      showTooltip,
      hideTooltip,
      getChartLinePoints
    };
  }
}
</script>

<style scoped>
.blurting-form {
  margin-bottom: var(--spacing-lg);
}

/* Alert styling */
.alert {
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-4);
}

.alert-danger {
  background-color: rgba(239, 68, 68, 0.1);
  color: #b91c1c;
  border-left: 3px solid #ef4444;
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

/* Past Attempts Summary in Instructions */
.past-attempts-summary {
  margin-top: var(--spacing-4);
  padding-top: var(--spacing-4);
  border-top: 1px dashed var(--neutral-300);
}

.past-attempts-summary h4 {
  font-size: var(--font-size-md);
  margin-bottom: var(--spacing-3);
  font-weight: var(--font-weight-medium);
  color: var(--neutral-700);
}

.attempts-chart {
  margin-top: var(--spacing-3);
}

.chart-bars {
  display: flex;
  justify-content: space-between;
  height: 100px;
  gap: var(--spacing-2);
}

.chart-bar-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  position: relative;
}

.chart-bar {
  width: 100%;
  background-color: rgba(99, 102, 241, 0.3);
  position: absolute;
  bottom: 0;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 5px;
  max-width: 40px;
}

.chart-bar.excellent {
  background-color: rgba(16, 185, 129, 0.6);
}

.chart-bar.good {
  background-color: rgba(6, 182, 212, 0.6);
}

.chart-bar.fair {
  background-color: rgba(245, 158, 11, 0.6);
}

.chart-bar.poor {
  background-color: rgba(249, 115, 22, 0.6);
}

.chart-bar.very-poor {
  background-color: rgba(239, 68, 68, 0.6);
}

.chart-value {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: white;
}

.chart-label {
  position: absolute;
  bottom: -20px;
  font-size: var(--font-size-xs);
  color: var(--neutral-600);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--spacing-6);
}

/* Make the submit button more prominent */
.form-actions .btn-primary {
  font-size: var(--font-size-md);
  padding: 0.75rem 1.75rem;
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

/* Performance Trend */
.performance-trend {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: var(--spacing-3);
  gap: var(--spacing-3);
}

.trend-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: 0.3rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.trend-badge.improving {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.trend-badge.decreasing {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.trend-badge.stable {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.attempt-number {
  font-size: var(--font-size-xs);
  color: var(--neutral-600);
  background-color: var(--neutral-100);
  padding: 0.3rem 0.75rem;
  border-radius: var(--radius-full);
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
.split-section h5,
.history-view h5 {
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

/* History View */
.history-view {
  margin-bottom: var(--spacing-4);
}

.performance-history {
  background-color: var(--neutral-50);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
}

.history-chart {
  height: 300px;
  position: relative;
}

.chart-line {
  display: flex;
  height: 250px;
  width: 100%;
  position: relative;
}

.chart-y-axis {
  width: 40px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: var(--spacing-2);
  border-right: 1px solid var(--neutral-300);
}

.y-axis-tick {
  font-size: var(--font-size-xs);
  color: var(--neutral-500);
  transform: translateY(50%);
}

.chart-content {
  flex: 1;
  height: 100%;
  position: relative;
  padding-left: var(--spacing-2);
}

.threshold-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background-color: var(--neutral-300);
  font-size: var(--font-size-xs);
  color: var(--neutral-600);
  display: flex;
  align-items: center;
  padding-left: var(--spacing-2);
}

.chart-points {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.chart-point {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-left: -5px;
  margin-bottom: -5px;
  z-index: 2;
  cursor: pointer;
}

.chart-point.excellent {
  background-color: #10b981;
}

.chart-point.good {
  background-color: #06b6d4;
}

.chart-point.fair {
  background-color: #f59e0b;
}

.chart-point.poor {
  background-color: #f97316;
}

.chart-point.very-poor {
  background-color: #ef4444;
}

.chart-tooltip {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--neutral-800);
  color: white;
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  white-space: nowrap;
  pointer-events: none;
  z-index: 3;
}

.tooltip-date {
  font-weight: var(--font-weight-medium);
  margin-bottom: 2px;
}

.chart-line-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.chart-x-axis {
  height: 30px;
  display: flex;
  width: 100%;
  position: relative;
  margin-left: 40px;
  border-top: 1px solid var(--neutral-300);
}

.x-axis-tick {
  position: absolute;
  transform: translateX(-50%);
  font-size: var(--font-size-xs);
  color: var(--neutral-500);
  top: 5px;
}

.no-history {
  text-align: center;
  padding: var(--spacing-6);
  color: var(--neutral-600);
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

.interval-label {
  margin-left: auto;
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
  font-weight: var(--font-weight-normal);
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

  .tabs {
    flex-direction: column;
  }

  .tab-button {
    padding: var(--spacing-2) var(--spacing-4);
  }

  .tab-button.active {
    border-bottom: none;
    border-left: 2px solid var(--primary-color);
    background-color: rgba(99, 102, 241, 0.05);
  }
}
</style>