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
          <div class="textarea-container">
            <textarea
              v-model="recalledText"
              class="form-control"
              rows="12"
              placeholder="Start typing what you remember..."
              :disabled="loading || isRecording"
              autofocus
              ref="textareaRef"
            ></textarea>
            <div class="speech-controls">
              <div class="speech-buttons-container">
                <button 
                  type="button" 
                  @click="toggleSpeechRecognition" 
                  class="btn btn-speech" 
                  :class="{ 'recording': isRecording }"
                  :disabled="loading"
                  :title="isRecording ? 'Stop recording' : 'Start speech to text'"
                >
                  <svg v-if="!isRecording" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                </button>
                <div v-if="isRecording" class="recording-indicator">
                  <span class="recording-text">Recording...</span>
                  <span class="recording-dot"></span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="browserSupportsSpeech === false" class="speech-warning">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>Your browser doesn't support speech recognition. Please use Chrome or Edge browser for this feature.</span>
          </div>
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

            <div v-else-if="activeTab === 'history'">
              <ModernHistoryView 
                :pastAttempts="pastAttempts" 
                :reviewSchedule="reviewSchedule"
                :isImproving="isImproving"
                :isDecreasing="isDecreasing"
                :performanceTrendText="performanceTrendText"
                :performanceInsight="performanceInsight"
                @add-to-calendar="addToCalendar"
              />
            </div>
          </div>
        </div>
        
        <div class="next-steps">
          <h5>Your Personalized Learning Journey</h5>
          <p class="schedule-intro">
            We've created a scientifically-optimized review schedule based on your performance pattern and the latest memory research. This personalized plan maximizes your long-term retention with minimal time investment.
          </p>
          
          <!-- Forgetting Curve Visualization -->
          <div class="forgetting-curve-container">
            <h6>Your Memory Retention Curve</h6>
            <div class="curve-visualization">
              <svg viewBox="0 0 500 200" class="curve-graph">
                <!-- Axis -->
                <line x1="50" y1="150" x2="450" y2="150" stroke="#e5e7eb" stroke-width="1"></line> <!-- X axis -->
                <line x1="50" y1="30" x2="50" y2="150" stroke="#e5e7eb" stroke-width="1"></line> <!-- Y axis -->
                
                <!-- Axis Labels -->
                <text x="250" y="180" text-anchor="middle" class="axis-label">Time</text>
                <text x="20" y="90" text-anchor="middle" class="axis-label" transform="rotate(-90, 20, 90)">Retention</text>
                
                <!-- Timepoint Markers -->
                <line x1="50" y1="145" x2="50" y2="155" stroke="#9ca3af" stroke-width="1"></line>
                <text x="50" y="170" text-anchor="middle" class="time-label">Now</text>
                
                <!-- Retention Markers -->
                <line x1="45" y1="50" x2="55" y2="50" stroke="#9ca3af" stroke-width="1"></line>
                <text x="35" y="55" text-anchor="end" class="retention-label">90%</text>
                
                <line x1="45" y1="100" x2="55" y2="100" stroke="#9ca3af" stroke-width="1"></line>
                <text x="35" y="105" text-anchor="end" class="retention-label">50%</text>
                
                <line x1="45" y1="130" x2="55" y2="130" stroke="#9ca3af" stroke-width="1"></line>
                <text x="35" y="135" text-anchor="end" class="retention-label">20%</text>
                
                <!-- Forgetting Curve without practice -->
                <path :d="getRetentionCurvePath(false)" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="5,5"></path>
                
                <!-- Optimized Curve with spaced repetition -->
                <path :d="getRetentionCurvePath(true)" fill="none" stroke="#6366f1" stroke-width="2"></path>
                
                <!-- Review Points -->
                <g v-for="(date, index) in reviewSchedule" :key="'review-point-' + index">
                  <!-- Calculate x position based on days from now -->
                  <circle 
                    :cx="50 + calculateGraphPosition(date)" 
                    :cy="calculateRetentionPoint(date)" 
                    r="5" 
                    :class="getReviewPointClass(date)"
                    @mouseenter="activeReviewPoint = index"
                    @mouseleave="activeReviewPoint = null"
                  ></circle>
                  
                  <!-- Add pulsing effect to today's review point -->
                  <circle v-if="isCurrentDate(date)"
                    :cx="50 + calculateGraphPosition(date)" 
                    :cy="calculateRetentionPoint(date)" 
                    r="8"
                    class="review-point-pulse"
                  ></circle>
                  
                  <!-- Review Point Tooltip -->
                  <g v-if="activeReviewPoint === index">
                    <rect 
                      :x="45 + calculateGraphPosition(date) - 60" 
                      :y="calculateRetentionPoint(date) - 55" 
                      width="120" 
                      height="45" 
                      rx="4" 
                      class="tooltip-bg"></rect>
                    <text 
                      :x="45 + calculateGraphPosition(date)" 
                      :y="calculateRetentionPoint(date) - 35" 
                      text-anchor="middle" 
                      class="tooltip-text">{{ formatReviewDate(date) }}</text>
                    <text 
                      :x="45 + calculateGraphPosition(date)" 
                      :y="calculateRetentionPoint(date) - 15" 
                      text-anchor="middle" 
                      class="tooltip-subtext">{{ getReviewTypeLabel(date) }}</text>
                  </g>
                </g>
              </svg>
              
              <div class="curve-legend">
                <div class="legend-item">
                  <span class="legend-color no-practice"></span>
                  <span>Without Practice</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color with-practice"></span>
                  <span>With Retriv's Spaced Repetition</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Review Schedule Cards -->
          <div class="review-schedule-container">
            <h6>Your Upcoming Review Schedule</h6>
            <div class="schedule-grid">
              <div v-for="(date, index) in reviewSchedule.slice(0, 5)" :key="'schedule-' + index" class="schedule-card" :class="getScheduleCardClass(date, index)">
                <div class="schedule-card-header">
                  <div class="schedule-tag" :class="getScheduleTagClass(date)">{{ getScheduleTagText(date) }}</div>
                  <div class="schedule-time">{{ formatReviewDate(date) }}</div>
                </div>
                <div class="schedule-interval">{{ getIntervalLabel(date) }}</div>
                <div class="schedule-note">{{ getScheduleNote(date) }}</div>
              </div>
            </div>
          </div>
          
          
          <div class="actions-row">
            <button @click="addToCalendar" class="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
                <path d="M8 14h.01"></path>
                <path d="M12 14h.01"></path>
                <path d="M16 14h.01"></path>
                <path d="M8 18h.01"></path>
                <path d="M12 18h.01"></path>
                <path d="M16 18h.01"></path>
              </svg>
              Add Reviews to Calendar
            </button>
            <button @click="handleReset" class="btn btn-outline">
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
import ModernHistoryView from './ModernHistoryView.vue';

export default {
  name: 'BlurtingForm',
  components: {
    ModernHistoryView
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
    const activeReviewPoint = ref(null);
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
    const isRecording = ref(false);
    const recognition = ref(null);
    const browserSupportsSpeech = ref(null);
    const textareaRef = ref(null);
    
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
        // Just show the time for tomorrow since the tag already says "Tomorrow"
        return new Intl.DateTimeFormat('en-US', {
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
    const getRetentionCurvePath = (withPractice = false) => {
      // Start from the current performance
      const startY = withPractice ? 50 : 50; // Start at the same point
      
      if (withPractice) {
        // Enhanced retention curve with spaced repetition
        let pathData = `M50,${startY}`;
        
        // Plot the curve with recovery at review points
        // This creates a sawtooth pattern that rises at each review
        let xPos = 50;
        let yPos = startY;
        
        // Sort review schedule by time
        const sortedSchedule = [...reviewSchedule.value].sort((a, b) => new Date(a) - new Date(b));
        
        // Initial decline (first segment before any reviews)
        if (sortedSchedule.length > 0) {
          const firstReviewX = 50 + calculateGraphPosition(sortedSchedule[0]);
          
          // Calculate natural memory decay to first review point
          const decayY = Math.min(140, startY + 30);
          pathData += ` C${xPos + 20},${startY + 10} ${firstReviewX - 20},${decayY - 5} ${firstReviewX},${decayY}`;
          
          // Update position
          xPos = firstReviewX;
          yPos = decayY;
          
          // Add each review point with a boost in retention
          sortedSchedule.forEach((date, i) => {
            const reviewX = 50 + calculateGraphPosition(date);
            
            // Skip if this is the first point (already handled)
            if (i === 0) return;
            
            // Calculate natural memory decay between review points
            const nextDecayY = Math.min(140, yPos + 15 - (i * 3));
            
            // Add curve segment to next review point
            pathData += ` C${xPos + 20},${yPos + 5} ${reviewX - 20},${nextDecayY - 5} ${reviewX},${nextDecayY}`;
            
            // Update position for next segment
            xPos = reviewX;
            yPos = nextDecayY;
          });
          
          // Final segment after last review
          pathData += ` C${xPos + 20},${yPos + 5} ${400 - 20},${yPos + 10} ${400},${yPos + 15}`;
        } else {
          // If no review schedule, show a generic curve
          pathData += ` C150,${startY + 20} 300,${startY + 40} 400,${startY + 60}`;
        }
        
        return pathData;
      } else {
        // Standard forgetting curve without practice (exponential decay)
        let pathData = `M50,${startY}`;
        
        // Create exponential forgetting curve based on Ebbinghaus
        pathData += ` C100,${startY + 30} 150,${startY + 60} 200,${startY + 80}`;
        pathData += ` C250,${startY + 90} 300,${startY + 95} 400,${startY + 100}`;
        
        return pathData;
      }
    };
    
    // Calculate position on the graph based on time difference from now
    const calculateGraphPosition = (date) => {
      if (!date) return 0;
      
      const reviewDate = new Date(date);
      const now = new Date();
      
      // Calculate days difference
      const diffTime = Math.abs(reviewDate - now);
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      // Scale the position logarithmically to fit the graph
      // First day takes 40% of the x-axis, remaining 60% for longer-term
      if (diffDays < 1) {
        // Less than 1 day - map to 0-100 range
        return diffDays * 100;
      } else if (diffDays < 7) {
        // 1-7 days - map to 100-220 range
        return 100 + ((diffDays - 1) / 6) * 120;
      } else if (diffDays < 30) {
        // 7-30 days - map to 220-300 range
        return 220 + ((diffDays - 7) / 23) * 80;
      } else {
        // >30 days - map to 300-400 range
        return Math.min(400, 300 + (diffDays - 30) / 30 * 100);
      }
    };
    
    // Calculate the retention point for a specific review date
    const calculateRetentionPoint = (date) => {
      if (!date) return 50; // Default
      
      const reviewDate = new Date(date);
      const now = new Date();
      
      // Get index in the review schedule
      const sortedSchedule = [...reviewSchedule.value].sort((a, b) => new Date(a) - new Date(b));
      const index = sortedSchedule.findIndex(d => new Date(d).getTime() === reviewDate.getTime());
      
      // First review point is always at a lower retention
      if (index === 0) {
        return 80;
      }
      
      // Calculate days difference
      const diffTime = Math.abs(reviewDate - now);
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      // Retention improves with successive reviews
      const baseRetention = 80 - (index * 5);
      
      // Adjust for time - more distant reviews show lower pre-review retention
      let timeAdjustment = 0;
      if (diffDays < 1) {
        timeAdjustment = 0;
      } else if (diffDays < 7) {
        timeAdjustment = diffDays * 2;
      } else {
        timeAdjustment = 14 + (diffDays - 7);
      }
      
      return Math.min(130, baseRetention + timeAdjustment);
    };
    
    // Get the CSS class for a review point
    const getReviewPointClass = (date) => {
      if (isPastDate(date)) return 'review-point past';
      if (isCurrentDate(date)) return 'review-point current';
      return 'review-point future';
    };
    
    // Get a label for the review type based on position in schedule
    const getReviewTypeLabel = (date) => {
      if (!date) return '';
      
      const reviewDate = new Date(date);
      const now = new Date();
      const diffTime = Math.abs(reviewDate - now);
      const diffHours = diffTime / (1000 * 60 * 60);
      
      if (diffHours < 2) return 'Rapid Reinforcement';
      if (diffHours < 8) return 'Same Day Review';
      if (diffHours < 24) return 'Next Day Review';
      if (diffHours < 24 * 7) return 'Spaced Review';
      return 'Long-term Review';
    };
    
    // Get CSS class for schedule card
    const getScheduleCardClass = (date, index) => {
      if (isPastDate(date)) return 'past-review';
      if (isCurrentDate(date)) return 'current-review';
      if (index === 0) return 'next-review';
      return '';
    };
    
    // Get CSS class for schedule tag
    const getScheduleTagClass = (date) => {
      if (isPastDate(date)) return 'tag-past';
      if (isCurrentDate(date)) {
        const now = new Date();
        const reviewDate = new Date(date);
        const diffHours = (reviewDate - now) / (1000 * 60 * 60);
        
        // If it's due within the next hour, make it more urgent
        if (diffHours < 1) return 'tag-due-now';
        return 'tag-current';
      }
      
      const reviewDate = new Date(date);
      const now = new Date();
      const diffTime = Math.abs(reviewDate - now);
      const diffHours = diffTime / (1000 * 60 * 60);
      
      if (diffHours < 2) return 'tag-immediate';
      if (diffHours < 24) return 'tag-today';
      if (diffHours < 24 * 2) return 'tag-tomorrow';
      return 'tag-future';
    };
    
    // Get text for schedule tag
    const getScheduleTagText = (date) => {
      if (isPastDate(date)) return 'Completed';
      if (isCurrentDate(date)) {
        const now = new Date();
        const reviewDate = new Date(date);
        const diffHours = (reviewDate - now) / (1000 * 60 * 60);
        
        // If it's due within the next hour, make it more urgent
        if (diffHours < 1) return 'Due Now';
        return 'Due Today';
      }
      
      const reviewDate = new Date(date);
      const now = new Date();
      
      // If it's today but later
      if (reviewDate.toDateString() === now.toDateString()) {
        return 'Later Today';
      }
      
      // If it's tomorrow
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (reviewDate.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
      }
      
      // Otherwise, return the type
      return getReviewTypeShortLabel(date);
    };
    
    // Get a short label for review type
    const getReviewTypeShortLabel = (date) => {
      const reviewDate = new Date(date);
      const now = new Date();
      const diffTime = reviewDate - now;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      if (diffDays < 7) return 'Week 1';
      if (diffDays < 14) return 'Week 2';
      if (diffDays < 30) return 'Month 1';
      if (diffDays < 90) return 'Month 2-3';
      return 'Long-term';
    };
    
    // Get explanatory note for each schedule card
    const getScheduleNote = (date) => {
      if (isPastDate(date)) return 'This review has been completed.';
      if (isCurrentDate(date)) return 'This review is due today. Complete it to boost retention.';
      
      const reviewDate = new Date(date);
      const now = new Date();
      const diffTime = reviewDate - now;
      const diffHours = diffTime / (1000 * 60 * 60);
      
      if (diffHours < 2) return 'Critical time for new memory formation.';
      if (diffHours < 8) return 'Reinforces memory before sleep consolidation.';
      if (diffHours < 24) return 'Strengthens neural connections while still fresh.';
      if (diffHours < 24 * 7) return 'Prevents forgetting during critical first week.';
      return 'Moves knowledge to long-term memory.';      
    };
    
    // Add study sessions to calendar (mock implementation)
    const addToCalendar = () => {
      // In a real implementation, this would generate a calendar file or use calendar API
      alert('Review sessions would be added to your calendar. This feature is coming soon!');
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
        return 'Due today';
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
    
    // Initialize speech recognition
    const initSpeechRecognition = () => {
      // Check if the browser supports speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        console.log('Speech recognition not supported by your browser');
        browserSupportsSpeech.value = false;
        return;
      }
      
      browserSupportsSpeech.value = true;
      recognition.value = new SpeechRecognition();
      
      // Configure recognition
      recognition.value.continuous = true;
      recognition.value.interimResults = true;
      recognition.value.lang = 'en-US'; // Default to English
      
      // Set up event handlers
      recognition.value.onresult = (event) => {
        // We're only using final results for now, not interim results
        // let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
          // We're not using interim results in this implementation
          // else {
          //   interimTranscript += event.results[i][0].transcript;
          // }
        }
        
        // Append final transcript to the textarea
        if (finalTranscript) {
          // Add a space if there's already text and it doesn't end with a space
          const needsSpace = recalledText.value && !recalledText.value.endsWith(' ');
          recalledText.value += (needsSpace ? ' ' : '') + finalTranscript;
        }
      };
      
      recognition.value.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        isRecording.value = false;
        
        if (event.error === 'not-allowed') {
          error.value = 'Microphone access denied. Please check your browser settings.';
        }
      };
      
      recognition.value.onend = () => {
        // Only set isRecording to false if we didn't manually stop
        // (This helps prevent the recognition from stopping unexpectedly)
        if (isRecording.value) {
          try {
            recognition.value.start();
          } catch (e) {
            console.log('Recognition already started');
            isRecording.value = false;
          }
        }
      };
    };
    
    // Toggle speech recognition on/off
    const toggleSpeechRecognition = () => {
      if (!browserSupportsSpeech.value) {
        return;
      }
      
      if (isRecording.value) {
        // Stop recording
        try {
          recognition.value.stop();
          isRecording.value = false;
        } catch (e) {
          console.error('Error stopping recognition', e);
        }
      } else {
        // Start recording
        try {
          recognition.value.start();
          isRecording.value = true;
          
          // Focus the textarea after starting recording
          if (textareaRef.value) {
            textareaRef.value.focus();
          }
        } catch (e) {
          console.error('Error starting recognition', e);
          error.value = 'Could not start speech recognition. Please try again.';
        }
      }
    };

    onMounted(async () => {
      console.log("BlurtingForm mounted with materialId:", props.materialId);
      // Fetch past attempts for this material
      await fetchPastAttempts();
      
      // Start the countdown
      startCountdown();
      
      // Initialize speech recognition
      initSpeechRecognition();
    });
    
    onBeforeUnmount(() => {
      if (countdownTimer.value) {
        clearInterval(countdownTimer.value);
      }
      
      // Stop speech recognition if it's running
      if (recognition.value && isRecording.value) {
        try {
          recognition.value.stop();
          isRecording.value = false;
        } catch (e) {
          console.error('Error stopping recognition on unmount', e);
        }
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
      isRecording,
      browserSupportsSpeech,
      textareaRef,
      toggleSpeechRecognition,
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
      getRetentionCurvePath,
      calculateGraphPosition,
      calculateRetentionPoint,
      getReviewPointClass,
      getReviewTypeLabel,
      getScheduleCardClass,
      getScheduleTagClass,
      getScheduleTagText,
      getScheduleNote,
      addToCalendar,
      activeReviewPoint,
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
      calculateNextReviewPosition,
      calculateTimelinePosition
    };
  }
}
</script>

<style scoped>
/* Textarea with Speech Controls */
.textarea-container {
  position: relative;
}

.speech-controls {
  position: absolute;
  bottom: var(--spacing-3);
  right: var(--spacing-3);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  z-index: 10;
}

.speech-buttons-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  background-color: rgba(255, 255, 255, 0.9);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--neutral-200);
}

.btn-speech {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--neutral-100);
  color: var(--neutral-600);
  border: 1px solid var(--neutral-300);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
  margin: 0;
  flex-shrink: 0;
}

.btn-speech:hover {
  background-color: var(--neutral-200);
  color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-speech.recording {
  background-color: #ef4444;
  color: white;
  border-color: #ef4444;
  animation: pulse-recording 2s infinite;
}

.btn-speech:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
}

.btn-speech svg {
  margin: 0;
  padding: 0;
  width: 20px;
  height: 20px;
}

@keyframes pulse-recording {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

.recording-indicator {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: #ef4444;
  white-space: nowrap;
  margin-left: var(--spacing-2);
}

.recording-text {
  white-space: nowrap;
}

.recording-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ef4444;
  animation: blink 1s infinite;
  flex-shrink: 0;
}

@keyframes blink {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}

.speech-warning {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-top: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  background-color: rgba(250, 204, 21, 0.1);
  color: #b45309;
  font-size: var(--font-size-xs);
}
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

/* Next Steps - Redesigned */
.next-steps {
  background-color: var(--neutral-50);
  padding: var(--spacing-6);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.next-steps h5 {
  margin-bottom: var(--spacing-4);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-xl);
  color: var(--neutral-900);
}

.next-steps h6 {
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-md);
  margin-bottom: var(--spacing-3);
  color: var(--neutral-800);
}

.schedule-intro {
  margin-bottom: var(--spacing-6);
  color: var(--neutral-700);
  line-height: 1.6;
}

/* Forgetting Curve Visualization */
.forgetting-curve-container {
  margin-bottom: var(--spacing-8);
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  box-shadow: var(--shadow-sm);
}

.curve-visualization {
  margin-top: var(--spacing-4);
}

.curve-graph {
  width: 100%;
  height: 200px;
  overflow: visible;
}

.axis-label {
  font-size: 10px;
  fill: var(--neutral-500);
}

.time-label, .retention-label {
  font-size: 9px;
  fill: var(--neutral-600);
}

.review-point {
  stroke-width: 1;
  stroke: white;
  cursor: pointer;
  transition: r 0.2s ease;
}

.review-point:hover {
  r: 7;
}

.review-point.past {
  fill: var(--neutral-400);
}

.review-point.current {
  fill: var(--primary-color);
  stroke-width: 2;
  filter: drop-shadow(0 0 3px rgba(99, 102, 241, 0.5));
  z-index: 5;
}

.review-point-pulse {
  fill: transparent;
  stroke: var(--primary-color);
  stroke-width: 1;
  stroke-opacity: 0.7;
  animation: pulse-ring 2s infinite;
  z-index: 4;
}

@keyframes pulse-ring {
  0% { r: 8; stroke-opacity: 0.7; }
  50% { r: 12; stroke-opacity: 0.3; }
  100% { r: 8; stroke-opacity: 0.7; }
}

.review-point.future {
  fill: var(--primary-light);
}

.tooltip-bg {
  fill: var(--neutral-800);
  opacity: 0.9;
}

.tooltip-text {
  font-size: 10px;
  fill: white;
  font-weight: var(--font-weight-medium);
}

.tooltip-subtext {
  font-size: 8px;
  fill: rgba(255, 255, 255, 0.8);
}

.curve-legend {
  display: flex;
  justify-content: center;
  gap: var(--spacing-4);
  margin-top: var(--spacing-3);
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
  height: 3px;
  border-radius: 1px;
}

.legend-color.no-practice {
  background-color: #ef4444;
  border: 1px dashed #ef4444;
}

.legend-color.with-practice {
  background-color: #6366f1;
}

/* Review Schedule Cards */
.review-schedule-container {
  margin-bottom: var(--spacing-8);
}

.schedule-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-4);
  margin-top: var(--spacing-4);
}

.schedule-card {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--neutral-200);
  transition: all 0.3s ease;
  position: relative;
}



.schedule-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.schedule-card.past-review {
  opacity: 0.7;
}

.schedule-card.current-review {
  border-color: var(--primary-color);
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.2);
  animation: highlight-pulse 2s infinite;
}

@keyframes highlight-pulse {
  0% { box-shadow: 0 4px 14px rgba(99, 102, 241, 0.2); }
  50% { box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4); }
  100% { box-shadow: 0 4px 14px rgba(99, 102, 241, 0.2); }
}

.schedule-card.next-review {
  border-color: var(--primary-light);
}

.schedule-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-3);
}

.schedule-tag {
  font-size: var(--font-size-xs);
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-medium);
}

.schedule-tag.tag-past {
  background-color: var(--neutral-200);
  color: var(--neutral-600);
}

.schedule-tag.tag-current {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.schedule-tag.tag-due-now {
  background-color: rgba(220, 38, 38, 0.2);
  color: #dc2626;
  font-weight: var(--font-weight-bold);
  animation: tag-pulse 1.5s infinite;
}

@keyframes tag-pulse {
  0% { background-color: rgba(220, 38, 38, 0.2); }
  50% { background-color: rgba(220, 38, 38, 0.4); }
  100% { background-color: rgba(220, 38, 38, 0.2); }
}

.schedule-tag.tag-immediate {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.schedule-tag.tag-today {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.schedule-tag.tag-tomorrow {
  background-color: rgba(6, 182, 212, 0.1);
  color: #06b6d4;
}

.schedule-tag.tag-future {
  background-color: rgba(99, 102, 241, 0.1);
  color: var(--primary-color);
}

.schedule-time {
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  color: var(--neutral-800);
}

.schedule-interval {
  font-size: var(--font-size-xs);
  color: var(--neutral-600);
  margin-bottom: var(--spacing-2);
}

.schedule-note {
  font-size: var(--font-size-xs);
  color: var(--neutral-700);
  line-height: 1.5;
}

/* Science Cards */
.science-container {
  margin-bottom: var(--spacing-6);
}

.science-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-4);
  margin-top: var(--spacing-4);
}

.science-card {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--neutral-200);
}

.science-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background-color: rgba(99, 102, 241, 0.1);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-3);
}

.science-card h6 {
  margin-bottom: var(--spacing-2);
}

.science-card p {
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
  line-height: 1.5;
  margin-bottom: 0;
}

/* Action Buttons */
.actions-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-4);
  margin-top: var(--spacing-6);
}

.btn-icon {
  margin-right: var(--spacing-2);
}

.btn-primary {
  display: flex;
  align-items: center;
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