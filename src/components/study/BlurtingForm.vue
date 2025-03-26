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
          <div class="performance-chart-container">
            <div class="chart-header">
              <div class="chart-title">Recall Score History</div>
              <div class="chart-legend">
                <div class="legend-item">
                  <span class="legend-color excellent"></span>
                  <span>Excellent (90%+)</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color good"></span>
                  <span>Good (80-89%)</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color fair"></span>
                  <span>Fair (70-79%)</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color poor"></span>
                  <span>Poor (&lt; 70%)</span>
                </div>
              </div>
            </div>
            <div class="performance-trend-chart">
              <div class="y-axis">
                <div v-for="tick in 6" :key="'y-' + tick" class="axis-tick">
                  {{ 100 - (tick - 1) * 20 }}%
                </div>
              </div>
              <div class="chart-area">
                <!-- Reference lines -->
                <div class="reference-line" style="bottom: 90%;">Excellent (90%)</div>
                <div class="reference-line" style="bottom: 70%;">Fair (70%)</div>
                
                <!-- Data points and connecting curve -->
                <svg class="trend-curve" preserveAspectRatio="none" :viewBox="`0 0 ${pastAttempts.length - 1} 100`">
                  <path :d="getChartPath()" fill="none" stroke="rgba(99, 102, 241, 0.7)" stroke-width="2"></path>
                </svg>
                
                <div 
                  v-for="(attempt, index) in pastAttempts" 
                  :key="'point-' + index" 
                  class="data-point" 
                  :class="getScoreClass(attempt.matchPercentage)"
                  :style="{
                    left: `${(index / (pastAttempts.length - 1)) * 100}%`, 
                    bottom: `${attempt.matchPercentage}%`
                  }"
                  @mouseenter="activatePoint(index)"
                  @mouseleave="deactivatePoint()"
                >
                  <div v-if="activePoint === index" class="data-tooltip">
                    <div class="tooltip-date">{{ formatDateWithTime(attempt.timestamp) }}</div>
                    <div class="tooltip-score">{{ attempt.matchPercentage }}%</div>
                  </div>
                </div>
              </div>
              <div class="x-axis">
                <div 
                  v-for="(attempt, index) in pastAttempts" 
                  :key="'x-' + index" 
                  class="axis-label"
                  :style="{ left: `${(index / (pastAttempts.length - 1)) * 100}%` }"
                >
                  {{ formatShortDate(attempt.timestamp) }}
                </div>
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
                <!-- Enhanced Performance History Chart -->
                <div class="enhanced-chart-container">
                  <!-- Chart Header with Performance Insights -->
                  <div class="chart-header">
                    <div class="performance-trend">
                      <div class="trend-indicator" :class="performanceTrendClass">
                        <svg v-if="isImproving" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="18 15 12 9 6 15"></polyline>
                        </svg>
                        <svg v-else-if="isDecreasing" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        <span>{{ performanceTrendText }}</span>
                      </div>
                      <div class="insight-badge" v-if="performanceInsight">
                        {{ performanceInsight }}
                      </div>
                    </div>
                    <div class="chart-legend">
                      <div class="legend-item">
                        <span class="legend-color excellent"></span>
                        <span>Excellent (80%+)</span>
                      </div>
                      <div class="legend-item">
                        <span class="legend-color good"></span>
                        <span>Good (70-80%)</span>
                      </div>
                      <div class="legend-item">
                        <span class="legend-color average"></span>
                        <span>Average (50-70%)</span>
                      </div>
                      <div class="legend-item">
                        <span class="legend-color poor"></span>
                        <span>Poor (&lt;50%)</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Enhanced Chart Area -->
                  <div class="enhanced-chart">
                    <!-- Y-Axis -->
                    <div class="chart-y-axis">
                      <div class="y-axis-tick"><span>100%</span></div>
                      <div class="y-axis-tick"><span>75%</span></div>
                      <div class="y-axis-tick"><span>50%</span></div>
                      <div class="y-axis-tick"><span>25%</span></div>
                      <div class="y-axis-tick"><span>0%</span></div>
                    </div>
                    
                    <!-- Chart Content Area -->
                    <div class="chart-content-area">
                      <!-- Threshold Lines -->
                      <div class="threshold-line excellent-threshold" style="bottom: 80%;">
                        <span class="threshold-label">Excellent (80%)</span>
                      </div>
                      <div class="threshold-line average-threshold" style="bottom: 50%;">
                        <span class="threshold-label">Average (50%)</span>
                      </div>
                      
                      <!-- Data Visualization -->
                      <div class="data-visualization">
                        <!-- Area Chart Background -->
                        <svg class="area-chart" :viewBox="`0 0 ${pastAttempts.length - 1} 100`" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stop-color="rgba(99, 102, 241, 0.6)" />
                              <stop offset="100%" stop-color="rgba(99, 102, 241, 0.1)" />
                            </linearGradient>
                          </defs>
                          <path 
                            :d="getAreaChartPath()" 
                            fill="url(#areaGradient)"
                            stroke="none"
                          />
                        </svg>
                        
                        <!-- Line Chart -->
                        <svg class="line-chart" :viewBox="`0 0 ${pastAttempts.length - 1} 100`" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stop-color="#4f46e5" />
                              <stop offset="100%" stop-color="#8b5cf6" />
                            </linearGradient>
                          </defs>
                          <polyline 
                            :points="getChartLinePoints()" 
                            fill="none" 
                            stroke="url(#lineGradient)" 
                            stroke-width="3"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        
                        <!-- Data Points -->
                        <div 
                          v-for="(attempt, index) in pastAttempts" 
                          :key="index" 
                          class="data-point" 
                          :class="getScoreClass(attempt.matchPercentage)"
                          :style="{ left: `${(index / (pastAttempts.length - 1)) * 100}%`, bottom: `${attempt.matchPercentage}%` }"
                          @mouseenter="showTooltip(index)"
                          @mouseleave="hideTooltip()"
                        >
                          <div v-if="tooltipIndex === index" class="enhanced-tooltip">
                            <div class="tooltip-date">{{ formatDateWithTime(attempt.timestamp) }}</div>
                            <div class="tooltip-score" :class="getScoreClass(attempt.matchPercentage)">
                              <span>Score: {{ attempt.matchPercentage }}%</span>
                            </div>
                            <div class="tooltip-interval" v-if="attempt.calculatedInterval">
                              <span>Next interval: {{ formatInterval(attempt.calculatedInterval) }}</span>
                            </div>
                          </div>
                          <svg v-if="index === 0" class="pulse-ring" width="40" height="40" viewBox="0 0 40 40">
                            <circle cx="20" cy="20" r="15" fill="none" stroke="rgba(99, 102, 241, 0.3)" stroke-width="2">
                              <animate attributeName="r" from="15" to="20" dur="1.5s" begin="0s" repeatCount="indefinite"/>
                              <animate attributeName="opacity" from="1" to="0" dur="1.5s" begin="0s" repeatCount="indefinite"/>
                            </circle>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- X-Axis -->
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
                
                <!-- Spaced Repetition Schedule -->
                <div class="enhanced-schedule-section">
                  <h5>Spaced Repetition Schedule</h5>
                  <div class="timeline-container">
                    <div class="timeline-line"></div>
                    <div 
                      v-for="(date, index) in reviewSchedule" 
                      :key="index" 
                      class="timeline-event"
                      :class="{ 
                        'past-event': isPastDate(date), 
                        'current-event': isCurrentDate(date),
                        'future-event': !isPastDate(date) && !isCurrentDate(date)
                      }"
                    >
                      <div class="event-dot" :class="{
                        'pulse': isCurrentDate(date) 
                      }"></div>
                      <div class="event-content">
                        <div class="event-time">{{ formatDateWithTime(date) }}</div>
                        <div class="event-label">{{ getEventLabel(date) }}</div>
                      </div>
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
            Based on your performance, we've created a scientifically-optimized review schedule to strengthen your long-term memory:
          </p>
          
          <div class="schedule-timeline">
            <div class="timeline-track"></div>
            <div v-for="(date, index) in reviewSchedule" :key="'timeline-' + index" 
              class="timeline-point" 
              :class="{ 'current': isCurrentDate(date), 'past': isPastDate(date) }"
              :style="{ left: calculateTimelinePosition(date, reviewSchedule) + '%' }">
              <div class="timeline-marker"></div>
              <div class="timeline-label" :class="{ 'alt-position': index % 2 === 1 }">
                <div class="timeline-date">{{ formatReviewDate(date) }}</div>
                <div class="timeline-gap">{{ getIntervalLabel(date) }}</div>
              </div>
            </div>
          </div>
          
          <div class="schedule-explanation">
            <div class="explanation-card">
              <div class="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
              </div>
              <div class="card-content">
                <h6>Why This Schedule Works</h6>
                <p>
                  This schedule is based on the Ebbinghaus Forgetting Curve and proven spaced repetition research. 
                  By reviewing material right before you're likely to forget it, you strengthen neural pathways more effectively.
                </p>
              </div>
            </div>
          </div>
          
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
    const activePoint = ref(null);
    const tooltipIndex = ref(null);
    const error = ref('');
    const nextReviewDate = ref(null);
    
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
        
        // Get next review date if available
        nextReviewDate.value = await StudyService.getNextReviewDate(props.materialId);
      } catch (err) {
        console.error('Failed to fetch past attempts:', err);
        error.value = `Failed to fetch past attempts: ${err.message}`;
      }
    };
    
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
    
    const formatReviewDate = (dateString) => {
      if (!dateString) return '';
      
      const date = typeof dateString === 'object' && dateString.toDate ?
        dateString.toDate() : new Date(dateString);
      
      const now = new Date();
      
      // If it's today
      if (date.toDateString() === now.toDateString()) {
        return new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: 'numeric'
        }).format(date);
      }
      
      // If it's tomorrow
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow, ' + new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: 'numeric'
        }).format(date);
      }
      
      // If it's within a week
      const oneWeek = new Date(now);
      oneWeek.setDate(oneWeek.getDate() + 7);
      if (date < oneWeek) {
        return new Intl.DateTimeFormat('en-US', {
          weekday: 'long',
          hour: 'numeric',
          minute: 'numeric'
        }).format(date);
      }
      
      // Otherwise, show the full date
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
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
    
    const getChangeClass = (currentScore, previousScore) => {
      const difference = currentScore - previousScore;
      if (difference >= 10) return 'increase-large';
      if (difference > 0) return 'increase-small';
      if (difference <= -10) return 'decrease-large';
      if (difference < 0) return 'decrease-small';
      return 'no-change';
    };
    
    const calculateChange = (currentScore, previousScore) => {
      const difference = currentScore - previousScore;
      return difference > 0 ? `+${difference.toFixed(1)}%` : `${difference.toFixed(1)}%`;
    };

    const activatePoint = (index) => {
      activePoint.value = index;
    };

    const deactivatePoint = () => {
      activePoint.value = null;
    };

    const isPastDate = (timestamp) => {
      if (!timestamp) return false;
      
      const date = new Date(timestamp);
      const now = new Date();
      
      // Check if the date is in the past
      return date < now;
    };

    const isCurrentDate = (timestamp) => {
      if (!timestamp) return false;
      
      const date = new Date(timestamp);
      const now = new Date();
      
      // Check if the date is today
      return date.toDateString() === now.toDateString();
    };
    
    const getChartPath = () => {
      if (!pastAttempts.value || pastAttempts.value.length < 2) return '';
      
      // Create the SVG path data
      let pathData = '';
      
      pastAttempts.value.forEach((attempt, index) => {
        const x = index / (pastAttempts.value.length - 1) * (pastAttempts.value.length - 1);
        const y = 100 - attempt.matchPercentage;
        
        if (index === 0) {
          pathData = `M${x},${y}`;
        } else {
          // Use curve for smoother line
          pathData += ` L${x},${y}`;
        }
      });
      
      return pathData;
    };
    
    // Generate a retention curve path based on Ebbinghaus forgetting curve principles
    const getRetentionCurvePath = () => {
      if (!pastAttempts.value || pastAttempts.value.length === 0) return '';
      
      // Start from the current performance
      const startY = 100 - matchPercentage.value;
      
      // The theoretical forgetting curve follows a negative exponential
      // We'll approximate it with a bezier curve
      let pathData = `M0,${startY}`;
      
      // If performance is very high (>90%), show a flatter curve
      if (matchPercentage.value > 90) {
        pathData += ` C30,${startY + 10} 50,${startY + 15} 100,${startY + 25}`;
      } 
      // If performance is good (>80%), show a moderate decline
      else if (matchPercentage.value > 80) {
        pathData += ` C30,${startY + 15} 50,${startY + 25} 100,${startY + 40}`;
      }
      // If performance is moderate (>70%), show a steeper decline
      else if (matchPercentage.value > 70) {
        pathData += ` C20,${startY + 20} 40,${startY + 35} 100,${startY + 55}`;
      }
      // For poor performance, show a very steep initial decline
      else {
        pathData += ` C15,${startY + 30} 30,${startY + 45} 100,${Math.min(95, startY + 65)}`;
      }
      
      return pathData;
    };
    
    // Calculate the position for the next review indicator on the timeline
    const calculateNextReviewPosition = () => {
      if (!nextReviewDate.value) return 50; // Default to middle if no date
      
      const now = new Date();
      const nextReview = new Date(nextReviewDate.value);
      const timeDiff = nextReview - now;
      
      // Convert to days
      const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
      
      // Map days to position percentage (0 days = 0%, 90 days = 100%)
      // Use logarithmic scale to better represent early reviews
      if (daysDiff < 1) {
        // Less than a day - position between 0-25%
        return Math.max(5, (daysDiff * 25));
      } else if (daysDiff < 7) {
        // Less than a week - position between 25-50%
        return 25 + ((daysDiff - 1) / 6 * 25);
      } else if (daysDiff < 30) {
        // Less than a month - position between 50-75%
        return 50 + ((daysDiff - 7) / 23 * 25);
      } else {
        // More than a month - position between 75-95%
        return Math.min(95, 75 + ((daysDiff - 30) / 60 * 20));
      }
    };
    
    // Calculate position for timeline points
    const calculateTimelinePosition = (date, allDates) => {
      if (!date || !allDates || allDates.length === 0) return 0;
      
      const now = new Date();
      const reviewDate = new Date(date);
      
      // Find earliest and latest dates
      let earliestDate = now;
      let latestDate = now;
      
      if (allDates.length > 0) {
        const dates = allDates.map(d => new Date(d));
        latestDate = new Date(Math.max.apply(null, dates));
        
        // Add buffer to latest date (20% more than the actual span)
        const timeSpan = latestDate - now;
        latestDate = new Date(latestDate.getTime() + timeSpan * 0.2);
      }
      
      // Calculate position as percentage of the timeline
      const timelineSpan = latestDate - earliestDate;
      const datePosition = reviewDate - earliestDate;
      
      return Math.min(100, Math.max(0, (datePosition / timelineSpan) * 100));
    };
    
    // New methods for the enhanced chart
    const showTooltip = (index) => {
      tooltipIndex.value = index;
    };

    const hideTooltip = () => {
      tooltipIndex.value = null;
    };

    const getAreaChartPath = () => {
      if (!pastAttempts.value || pastAttempts.value.length < 2) return '';
      
      const width = pastAttempts.value.length - 1;
      let path = 'M0 ' + (100 - pastAttempts.value[0].matchPercentage);
      
      // Add points for the top line
      for (let i = 1; i < pastAttempts.value.length; i++) {
        const x = i;
        const y = 100 - pastAttempts.value[i].matchPercentage;
        path += ` L${x} ${y}`;
      }
      
      // Complete the path to create the area
      path += ` L${width} 100 L0 100 Z`;
      
      return path;
    };

    const getChartLinePoints = () => {
      if (!pastAttempts.value || pastAttempts.value.length < 2) return '';
      
      return pastAttempts.value.map((attempt, index) => 
        `${index}, ${100 - attempt.matchPercentage}`
      ).join(' ');
    };
    
    // Format an interval (in days) to a human-readable string
    const formatInterval = (interval) => {
      if (!interval) return '';
      
      if (interval < 0.04) return 'Less than 1 hour';
      if (interval < 1) {
        const hours = Math.round(interval * 24);
        return hours === 1 ? '1 hour' : `${hours} hours`;
      }
      if (interval < 7) {
        const days = Math.round(interval * 10) / 10;
        return days === 1 ? '1 day' : `${days} days`;
      }
      if (interval < 30) {
        const weeks = Math.round(interval / 7 * 10) / 10;
        return weeks === 1 ? '1 week' : `${weeks} weeks`;
      }
      const months = Math.round(interval / 30 * 10) / 10;
      return months === 1 ? '1 month' : `${months} months`;
    };
    
    // Get event label based on the date and index
    const getEventLabel = (date) => {
      if (isPastDate(date)) {
        return 'Completed';
      }
      
      if (isCurrentDate(date)) {
        return 'Due now';
      }
      
      // For future events, show the relative time
      const now = new Date();
      const reviewDate = new Date(date);
      
      const diffTime = Math.abs(reviewDate - now);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        return `Due in ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
      }
      
      if (diffDays === 1) return 'Due tomorrow';
      if (diffDays < 7) return `Due in ${diffDays} days`;
      if (diffDays < 14) return 'Due next week';
      if (diffDays < 30) return `Due in ${Math.floor(diffDays / 7)} weeks`;
      if (diffDays < 60) return 'Due next month';
      
      return `Due in ${Math.floor(diffDays / 30)} months`;
    };

    // Computed properties for enhanced chart
    const performanceTrendClass = computed(() => {
      if (isImproving.value) return 'improving';
      if (isDecreasing.value) return 'decreasing';
      return 'stable';
    });
    
    const performanceTrendText = computed(() => {
      if (isImproving.value) return 'Improving';
      if (isDecreasing.value) return 'Decreasing';
      return 'Stable';
    });
    
    const performanceInsight = computed(() => {
      if (!pastAttempts.value || pastAttempts.value.length < 2) return '';
      
      const latestScore = pastAttempts.value[0].matchPercentage;
      
      if (isImproving.value && latestScore > 80) {
        return 'Great progress! Retention is excellent.';
      } else if (isImproving.value) {
        return 'Making good progress!';
      } else if (isDecreasing.value && latestScore < 60) {
        return 'Consider reviewing more frequently';
      } else if (isDecreasing.value) {
        return 'Retention declining slightly';
      } else if (latestScore > 80) {
        return 'Consistently strong performance';
      } else if (latestScore < 50) {
        return 'Material may need more focus';
      }
      
      return '';
    });
    
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
      activePoint,
      tooltipIndex,
      isImproving,
      isDecreasing,
      error,
      nextReviewDate,
      performanceTrendClass,
      performanceTrendText,
      performanceInsight,
      handleSubmitRecall,
      handleReset,
      handleStudyAgain,
      formatDate,
      formatDateWithTime,
      formatShortDate,
      formatReviewDate,
      getIntervalLabel,
      getScoreClass,
      getChangeClass,
      calculateChange,
      activatePoint,
      deactivatePoint,
      showTooltip,
      hideTooltip,
      getAreaChartPath,
      getChartLinePoints,
      formatInterval,
      getEventLabel,
      isPastDate,
      isCurrentDate,
      getChartPath,
      getRetentionCurvePath,
      calculateNextReviewPosition,
      calculateTimelinePosition
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

/* Performance Chart in Instructions */
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

.performance-chart-container {
  margin-top: var(--spacing-3);
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  box-shadow: var(--shadow-sm);
}

.chart-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-3);
}

.chart-title {
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-md);
  color: var(--neutral-800);
}

.chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-3);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-xs);
  color: var(--neutral-600);
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: var(--radius-sm);
}

.legend-color.excellent {
  background-color: rgba(16, 185, 129, 0.7);
}

.legend-color.good {
  background-color: rgba(6, 182, 212, 0.7);
}

.legend-color.fair {
  background-color: rgba(245, 158, 11, 0.7);
}

.legend-color.poor {
  background-color: rgba(239, 68, 68, 0.7);
}

.legend-color.matched {
  background-color: rgba(16, 185, 129, 0.15);
  border-bottom: 2px solid #10b981;
}

.legend-color.unmatched {
  background-color: rgba(239, 68, 68, 0.1);
  border-bottom: 2px solid #ef4444;
}

.performance-trend-chart {
  position: relative;
  height: 200px;
  margin-top: var(--spacing-4);
}

.y-axis {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.axis-tick {
  font-size: var(--font-size-xs);
  color: var(--neutral-500);
}

.chart-area {
  position: absolute;
  top: 0;
  left: 40px;
  right: 0;
  bottom: 25px;
  border-bottom: 1px solid var(--neutral-300);
  border-left: 1px solid var(--neutral-300);
}

.reference-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  border-top: 1px dashed var(--neutral-300);
  font-size: var(--font-size-xs);
  color: var(--neutral-500);
  padding-left: var(--spacing-2);
}

.reference-line.dashed {
  border-top-style: dashed;
}

.data-point {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  transform: translate(-50%, 50%);
  z-index: 2;
  cursor: pointer;
  transition: all 0.2s ease;
}

.data-point.excellent {
  background-color: rgba(16, 185, 129, 0.7);
}

.data-point.good {
  background-color: rgba(6, 182, 212, 0.7);
}

.data-point.fair {
  background-color: rgba(245, 158, 11, 0.7);
}

.data-point.poor {
  background-color: rgba(239, 68, 68, 0.7);
}

.data-point.very-poor {
  background-color: rgba(239, 68, 68, 0.9);
}

.data-point:hover, .data-point:focus {
  transform: translate(-50%, 50%) scale(1.5);
}

.data-tooltip {
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
  z-index: 10;
  box-shadow: var(--shadow-lg);
}

.tooltip-date {
  font-weight: var(--font-weight-medium);
  margin-bottom: 2px;
}

.tooltip-score {
  font-weight: var(--font-weight-semibold);
}

.trend-curve {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
}

.x-axis {
  position: absolute;
  left: 40px;
  right: 0;
  bottom: 0;
  height: 25px;
}

.axis-label {
  position: absolute;
  font-size: var(--font-size-xs);
  color: var(--neutral-500);
  transform: translateX(-50%);
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

/* Memory Curve Chart */
.memory-curve-chart {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  margin-bottom: var(--spacing-6);
  box-shadow: var(--shadow-sm);
}

.chart-subtitle {
  font-size: var(--font-size-xs);
  color: var(--neutral-500);
  margin-top: 2px;
}

.chart-view {
  position: relative;
  height: 180px;
  margin-top: var(--spacing-4);
}

.forgetting-curve, .retention-curve {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.next-review-indicator {
  position: absolute;
  bottom: 0;
  top: 0;
  z-index: 2;
}

.indicator-line {
  position: absolute;
  width: 1px;
  height: 100%;
  background-color: var(--primary-color);
  left: 0;
}

.indicator-label {
  position: absolute;
  bottom: -20px;
  left: 0;
  transform: translateX(-50%);
  background-color: var(--primary-color);
  color: white;
  padding: 2px 6px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
}

/* History Table */
.attempt-history-table {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  box-shadow: var(--shadow-sm);
}

.attempt-history-table h6 {
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-3);
  font-size: var(--font-size-md);
}

.history-table {
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.history-table-header {
  display: flex;
  background-color: var(--neutral-100);
  font-weight: var(--font-weight-semibold);
  border-bottom: 1px solid var(--neutral-200);
}

.history-table-row {
  display: flex;
  border-bottom: 1px solid var(--neutral-200);
}

.history-table-row:last-child {
  border-bottom: none;
}

.history-cell {
  padding: var(--spacing-2) var(--spacing-3);
}

.date-cell {
  flex: 2;
}

.score-cell {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.change-cell {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.score-pill {
  display: inline-block;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: white;
}

.score-pill.excellent {
  background-color: rgba(16, 185, 129, 0.9);
}

.score-pill.good {
  background-color: rgba(6, 182, 212, 0.9);
}

.score-pill.fair {
  background-color: rgba(245, 158, 11, 0.9);
}

.score-pill.poor {
  background-color: rgba(249, 115, 22, 0.9);
}

.score-pill.very-poor {
  background-color: rgba(239, 68, 68, 0.9);
}

.change-indicator {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.change-indicator.increase-large {
  color: #10b981;
}

.change-indicator.increase-small {
  color: #14b8a6;
}

.change-indicator.decrease-large {
  color: #ef4444;
}

.change-indicator.decrease-small {
  color: #f97316;
}

.change-indicator.no-change {
  color: var(--neutral-500);
}

.no-history {
  text-align: center;
  padding: var(--spacing-6);
  color: var(--neutral-600);
}

/* Schedule Timeline */
.schedule-timeline {
  position: relative;
  height: 100px;
  margin: var(--spacing-6) 0;
}

.timeline-track {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--neutral-300);
  transform: translateY(-50%);
}

.timeline-point {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.timeline-marker {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--primary-color);
  position: relative;
  z-index: 1;
  transform: translateX(-50%);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

.timeline-point.current .timeline-marker {
  background-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

.timeline-point.past .timeline-marker {
  background-color: var(--neutral-400);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

.timeline-label {
  position: absolute;
  top: 15px;
  left: 0;
  transform: translateX(-50%);
  text-align: center;
  min-width: 100px;
}

.timeline-label.alt-position {
  top: -45px;
}

.timeline-date {
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-1);
  color: var(--neutral-800);
}

.timeline-gap {
  font-size: var(--font-size-xs);
  color: var(--neutral-600);
}

/* Schedule Explanation */
.schedule-explanation {
  margin: var(--spacing-6) 0;
}

.explanation-card {
  background-color: var(--neutral-50);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-4);
}

.card-icon {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-md);
  background-color: rgba(99, 102, 241, 0.1);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-content h6 {
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-2);
  font-size: var(--font-size-md);
}

.card-content p {
  color: var(--neutral-700);
  margin-bottom: 0;
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

.actions-row {
  display: flex;
  gap: var(--spacing-4);
  margin-top: var(--spacing-6);
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

/* Enhanced History View */
.history-view {
  margin-bottom: var(--spacing-4);
}

.history-view h5 {
  margin-bottom: var(--spacing-4);
  font-weight: var(--font-weight-semibold);
}

.performance-history {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  box-shadow: var(--shadow-md);
}

/* Chart Header & Legend */
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
  flex-wrap: wrap;
  gap: var(--spacing-3);
}

.performance-trend {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.trend-indicator {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  box-shadow: var(--shadow-sm);
}

.trend-indicator.improving {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.trend-indicator.decreasing {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.trend-indicator.stable {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.insight-badge {
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  background-color: rgba(99, 102, 241, 0.1);
  color: var(--primary-color);
}

.chart-legend {
  display: flex;
  gap: var(--spacing-3);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-xs);
  color: var(--neutral-600);
}

.legend-color {
  width: 16px;
  height: 4px;
  border-radius: 2px;
}

.legend-color.excellent {
  background-color: #10b981;
}

.legend-color.good {
  background-color: #06b6d4;
}

.legend-color.average {
  background-color: #f59e0b;
}

.legend-color.poor {
  background-color: #ef4444;
}

/* Enhanced Chart Container */
.enhanced-chart-container {
  margin-bottom: var(--spacing-6);
}

.enhanced-chart {
  display: flex;
  height: 280px;
  position: relative;
  margin-bottom: var(--spacing-4);
}

.chart-y-axis {
  width: 40px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: var(--spacing-2);
  border-right: 1px dashed var(--neutral-300);
}

.y-axis-tick {
  font-size: var(--font-size-xs);
  color: var(--neutral-500);
  transform: translateY(50%);
  position: relative;
}

.y-axis-tick span {
  position: absolute;
  right: var(--spacing-2);
  transform: translateY(-50%);
}

.chart-content-area {
  flex: 1;
  position: relative;
  height: 100%;
  overflow: hidden;
}

.threshold-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background-color: var(--neutral-200);
  z-index: 1;
}

.threshold-line.excellent-threshold {
  background-color: rgba(16, 185, 129, 0.2);
}

.threshold-line.average-threshold {
  background-color: rgba(245, 158, 11, 0.2);
}

.threshold-label {
  position: absolute;
  right: var(--spacing-2);
  top: -10px;
  font-size: var(--font-size-xs);
  color: var(--neutral-500);
  background-color: rgba(255, 255, 255, 0.8);
  padding: 2px 4px;
  border-radius: var(--radius-sm);
}

.data-visualization {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
}

.area-chart, .line-chart {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.data-point {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-left: -6px;
  margin-bottom: -6px;
  z-index: 10;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.data-point:hover {
  transform: scale(1.3);
}

.data-point.excellent {
  background-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

.data-point.good {
  background-color: #06b6d4;
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.2);
}

.data-point.fair {
  background-color: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
}

.data-point.poor {
  background-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

.pulse-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9;
  pointer-events: none;
}

.enhanced-tooltip {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  color: var(--neutral-700);
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  white-space: nowrap;
  pointer-events: none;
  z-index: 20;
  box-shadow: var(--shadow-lg);
  min-width: 160px;
  border: 1px solid var(--neutral-200);
}

.tooltip-date {
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-1);
  color: var(--neutral-800);
}

.tooltip-score {
  margin-bottom: var(--spacing-1);
  padding: 3px 6px;
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-medium);
  display: inline-block;
}

.tooltip-score.excellent {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.tooltip-score.good {
  background-color: rgba(6, 182, 212, 0.1);
  color: #06b6d4;
}

.tooltip-score.fair {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.tooltip-score.poor {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.tooltip-interval {
  font-size: var(--font-size-xs);
  color: var(--neutral-600);
}

.chart-x-axis {
  height: 30px;
  position: relative;
  display: flex;
  justify-content: space-between;
  border-top: 1px dashed var(--neutral-300);
  padding-left: 40px;
}

.x-axis-tick {
  position: absolute;
  transform: translateX(-50%);
  font-size: var(--font-size-xs);
  color: var(--neutral-500);
  top: var(--spacing-2);
  white-space: nowrap;
}

/* Enhanced Spaced Repetition Schedule */
.enhanced-schedule-section {
  margin-top: var(--spacing-6);
  padding-top: var(--spacing-6);
  border-top: 1px solid var(--neutral-200);
}

.timeline-container {
  position: relative;
  padding: var(--spacing-6) 0;
  margin-left: 20px;
}

.timeline-line {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, var(--primary-light), var(--primary-dark));
}

.timeline-event {
  position: relative;
  padding-left: 30px;
  margin-bottom: var(--spacing-6);
}

.timeline-event:last-child {
  margin-bottom: 0;
}

.event-dot {
  position: absolute;
  left: -5px;
  top: 6px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  z-index: 2;
}

.past-event .event-dot {
  background-color: var(--neutral-400);
}

.current-event .event-dot {
  background-color: var(--primary-color);
}

.future-event .event-dot {
  background-color: var(--primary-light);
}

.event-dot.pulse {
  box-shadow: 0 0 0 rgba(99, 102, 241, 0.7);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
  }
}

.event-content {
  background-color: white;
  border-radius: var(--radius-md);
  padding: var(--spacing-3) var(--spacing-4);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--neutral-200);
  transition: all 0.3s ease;
}

.past-event .event-content {
  opacity: 0.7;
}

.current-event .event-content {
  border-color: var(--primary-color);
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.2);
}

.timeline-event:hover .event-content {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.event-time {
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-1);
  color: var(--neutral-800);
}

.event-label {
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
}

.past-event .event-label {
  text-decoration: line-through;
  color: var(--neutral-500);
}

.current-event .event-label {
  color: var(--primary-color);
  font-weight: var(--font-weight-medium);
}

@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .chart-legend {
    flex-wrap: wrap;
    margin-top: var(--spacing-2);
  }
  
  .enhanced-chart {
    height: 240px;
  }
}
</style>