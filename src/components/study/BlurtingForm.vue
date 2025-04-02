<template>
  <div class="blurting-form card">
    <div class="card-header">
      <h3>{{ title }}</h3>
      <div v-if="currentPhase === 'blurting'" class="timer-badge" :class="timeLeft.includes('0:') ? 'urgent' : ''">
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
      
      <!-- Review Phase -->
      <div v-if="!submitted && currentPhase === 'review'" class="review-phase">
        <div class="instructions">
          <p>
            Take time to review the material below. When you're ready, click the button to move to the recall phase where you'll write down what you remember without looking back at this content.
          </p>
        </div>
        
        <div class="source-material">
          <h4>Source Material</h4>
          <div class="source-content">
            {{ content }}
          </div>
        </div>
        
        <div class="form-actions">
          <div class="action-buttons-container">
            <button 
              @click="openAiChat" 
              class="btn btn-outline ai-chat-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Ask Study Assistant
            </button>
            <button 
              @click="startBlurting" 
              class="btn btn-primary" 
            >
              <span>Start Recalling</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Blurting Phase -->
      <div v-if="!submitted && currentPhase === 'blurting'" class="blurting-phase">
        <div class="instructions">
          <p>
            Now, try to recall the content you just studied. Type as much as you can remember without looking at the original material. This "blurting" technique helps strengthen your memory.
          </p>
          <div v-if="pastAttempts && pastAttempts.length > 0" class="past-attempts-summary">
            <h4>Your Past Performance</h4>
            <div class="past-attempts-stats">
              <div class="stat-card attempts-card">
                <div class="stat-value">{{ pastAttempts.length }}</div>
                <div class="stat-label">Total Attempts</div>
              </div>
              <div class="stat-card score-card" v-if="pastAttempts.length > 0">
                <div class="stat-value">{{ pastAttempts[0].matchPercentage }}%</div>
                <div class="stat-label">Latest Score</div>
              </div>
              <div class="stat-card streak-card" v-if="pastAttempts.length > 1">
                <div class="stat-value">{{ isImproving ? '↑' : (isDecreasing ? '↓' : '→') }}</div>
                <div class="stat-label">{{ performanceTrendText }}</div>
              </div>
            </div>
            <div v-if="performanceInsight" class="performance-insight">
              <div class="insight-icon" :class="getInsightIconClass">
                <svg v-if="isImproving" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <svg v-else-if="isDecreasing" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>
              <div class="insight-content">{{ performanceInsight }}</div>
            </div>
          </div>
        </div>
        
        <form @submit.prevent="handleSubmitRecall">
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
      </div>
      
      <!-- Results Section -->
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
        
        <unified-blurting-view
          :heatmap-data="heatmapData.original"
          :recalled-text="recalledText"
          :match-percentage="matchPercentage"
          :past-attempts="pastAttempts"
          :is-improving="isImproving"
          :is-decreasing="isDecreasing"
          :performance-trend-text="performanceTrendText"
          :attempt-number="attemptNumber"
          title="Your Blurting Results"
        />
        
        <div class="next-steps">
          <h5>Your Personalized Learning Journey</h5>
          <p class="schedule-intro">
            We've created a review schedule based on your performance pattern. This personalized plan helps maximize your long-term retention with minimal time investment.
          </p>
          
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
            <button @click="handleReset" class="btn btn-outline">
              Study Something Else
            </button>
            <button @click="handleStudyAgain" class="btn btn-primary">
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
import UnifiedBlurtingView from './UnifiedBlurtingView.vue';
import { auth } from '@/services/firebase';

export default {
  name: 'BlurtingForm',
  components: {
    UnifiedBlurtingView
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
  emits: ['reset', 'study-again', 'open-chat'],
  
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
    const currentPhase = ref('review'); // Start with review phase

    const originalText = ref(props.content);
    const pastAttempts = ref([]);
    const attemptNumber = ref(1);
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
      
      if (submitted.value) {
        // When we've submitted a new attempt, compare with the previous best
        const previousScore = pastAttempts.value[0].matchPercentage;
        const currentScore = matchPercentage.value;
        
        return currentScore > previousScore + 5; // At least 5% improvement
      } else {
        // When viewing history, compare the last two attempts
        if (pastAttempts.value.length < 2) return false;
        
        const latestScore = pastAttempts.value[0].matchPercentage;
        const previousScore = pastAttempts.value[1].matchPercentage;
        
        return latestScore > previousScore + 5; // At least 5% improvement
      }
    });

    const isDecreasing = computed(() => {
      if (pastAttempts.value.length < 2) return false;
      
      if (submitted.value) {
        // When we've submitted a new attempt, compare with the previous best
        const previousScore = pastAttempts.value[0].matchPercentage;
        const currentScore = matchPercentage.value;
        
        return previousScore > currentScore + 5; // At least 5% decrease
      } else {
        // When viewing history, compare the last two attempts
        if (pastAttempts.value.length < 2) return false;
        
        const latestScore = pastAttempts.value[0].matchPercentage;
        const previousScore = pastAttempts.value[1].matchPercentage;
        
        return previousScore > latestScore + 5; // At least 5% decrease
      }
    });
    
    const getInsightIconClass = computed(() => {
      if (isImproving.value) return 'insight-positive';
      if (isDecreasing.value) return 'insight-negative';
      return 'insight-neutral';
    });
    
    const performanceTrendText = computed(() => {
      if (isImproving.value) return 'Improving';
      if (isDecreasing.value) return 'Decreasing';
      return 'Stable';
    });
    
    const performanceInsight = computed(() => {
      if (!pastAttempts.value || pastAttempts.value.length < 1) return '';
      
      // Get the latest score (either current attempt or most recent in history)
      const latestScore = submitted.value ? matchPercentage.value : pastAttempts.value[0].matchPercentage;
      
      // For first attempts, provide feedback based solely on the score
      if (pastAttempts.value.length < 2) {
        if (latestScore >= 90) return 'Excellent first attempt! You have strong recall.';
        if (latestScore >= 75) return 'Good first attempt. Keep practicing to improve retention.';
        if (latestScore >= 60) return 'Decent start. More practice will help reinforce this material.';
        if (latestScore >= 40) return 'Review this material again soon to strengthen your memory.';
        return 'This material needs more attention. Try shorter study sessions more frequently.';
      }
      
      // For subsequent attempts, consider trend and latest score
      if (isImproving.value && latestScore > 85) {
        return 'Outstanding improvement! Your retention is now excellent.';
      } else if (isImproving.value && latestScore > 70) {
        return 'Great progress! Your spaced repetition practice is working well.';
      } else if (isImproving.value) {
        return 'Making good progress! Keep up the consistent practice.';
      } else if (isDecreasing.value && latestScore < 60) {
        return 'Consider more frequent reviews to reinforce this material.';
      } else if (isDecreasing.value) {
        return 'Retention decreasing slightly. This is normal - just keep reviewing.';
      } else if (latestScore > 85) {
        return 'Consistently excellent performance. Material well-retained!';
      } else if (latestScore > 75) {
        return 'Stable good performance. Continue with your review schedule.';
      } else if (latestScore < 50) {
        return 'This material may need more focused attention and different study techniques.';
      }
      
      return 'Continue with your scheduled reviews to maintain retention.';
    });
    
    const startBlurting = () => {
      // Change to blurting phase
      currentPhase.value = 'blurting';
      // Start the countdown timer for blurting phase
      startCountdown();
    };
    
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
        
        // Make sure the attempts array is properly sorted by timestamp (newest first)
        const sortedAttempts = [...attempts].sort((a, b) => {
          const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
          const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
          return dateB - dateA;
        });
        
        pastAttempts.value = sortedAttempts;
        
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
        // Generate review schedule with additional metadata for better tracking
        reviewSchedule.value = await StudyService.generateSpacedRepetitionSchedule(
          attemptId,
          matchPercentage.value,
          pastAttempts.value.length // Pass the attempt count for better scheduling
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
      
      // Return to review phase
      currentPhase.value = 'review';
      
      // Notify parent component
      emit('study-again');
    };
    
    const openAiChat = () => {
      // Emit an event to open the AI chat modal
      emit('open-chat', {
        materialId: props.materialId,
        content: props.content,
        title: props.title,
        // Add context about which step the user is in
        phase: currentPhase.value
      });
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
    
    // Generate a retention curve path based on Ebbinghaus forgetting curve principles
    const getRetentionCurvePath = (withPractice = false) => {
      // Start from the current performance
      const startY = withPractice ? 50 : 50; // Start at the same point
      const xAxisOffset = 80; // New x-axis starting point
      
      if (withPractice) {
        // Enhanced retention curve with spaced repetition
        let pathData = `M${xAxisOffset},${startY}`;
        
        // Plot the curve with recovery at review points
        // This creates a sawtooth pattern that rises at each review
        let xPos = xAxisOffset;
        let yPos = startY;
        
        // Sort review schedule by time
        const sortedSchedule = [...reviewSchedule.value].sort((a, b) => new Date(a) - new Date(b));
        
        // Initial decline (first segment before any reviews)
        if (sortedSchedule.length > 0) {
          const firstReviewX = xAxisOffset + calculateGraphPosition(sortedSchedule[0]);
          
          // Calculate natural memory decay to first review point
          const decayY = Math.min(140, startY + 30);
          pathData += ` C${xPos + 20},${startY + 10} ${firstReviewX - 20},${decayY - 5} ${firstReviewX},${decayY}`;
          
          // Update position
          xPos = firstReviewX;
          yPos = decayY;
          
          // Add each review point with a boost in retention
          sortedSchedule.forEach((date, i) => {
            const reviewX = xAxisOffset + calculateGraphPosition(date);
            
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
          pathData += ` C${xAxisOffset + 70},${startY + 20} ${xAxisOffset + 220},${startY + 40} ${400},${startY + 60}`;
        }
        
        return pathData;
      } else {
        // Standard forgetting curve without practice (exponential decay)
        let pathData = `M${xAxisOffset},${startY}`;
        
        // Create exponential forgetting curve based on Ebbinghaus
        pathData += ` C${xAxisOffset + 50},${startY + 30} ${xAxisOffset + 100},${startY + 60} ${xAxisOffset + 150},${startY + 80}`;
        pathData += ` C${xAxisOffset + 200},${startY + 90} ${xAxisOffset + 250},${startY + 95} ${400},${startY + 100}`;
        
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
      
      // Initialize speech recognition
      initSpeechRecognition();
      
      // Note: countdown timer will be started when moving to blurting phase
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
      currentPhase,
      startBlurting,
      openAiChat,

      originalText,
      pastAttempts,
      attemptNumber,
      isImproving,
      isDecreasing,
      performanceTrendText,
      performanceInsight,
      getInsightIconClass,
      error,
      nextReviewDate,
      isRecording,
      browserSupportsSpeech,
      textareaRef,
      toggleSpeechRecognition,
      handleSubmitRecall,
      handleReset,
      handleStudyAgain,
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
      isPastDate,
      isCurrentDate
    };
  }
}
</script>

<style scoped>
/* Source Material Styling */
.source-material {
  margin: var(--spacing-6) 0;
  padding: var(--spacing-4);
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--neutral-200);
}

.source-material h4 {
  margin-bottom: var(--spacing-3);
  color: var(--neutral-900);
  font-weight: var(--font-weight-medium);
}

.source-content {
  padding: var(--spacing-4);
  background-color: var(--neutral-50);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--primary-color);
  white-space: pre-wrap;
  font-size: var(--font-size-md);
  line-height: 1.6;
  max-height: 400px;
  overflow-y: auto;
}

.review-phase .form-actions {
  margin-top: var(--spacing-6);
  display: flex;
  justify-content: center;
}

.review-phase .btn-primary {
  padding: 0.75rem 2rem;
  font-size: var(--font-size-md);
  background-color: #6c5ce7;
  transition: all 0.3s ease;
}

.review-phase .btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(108, 92, 231, 0.2);
}

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

/* Past Attempts Summary */
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

.past-attempts-stats {
  display: flex;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-3);
}

.stat-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-3);
  min-width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--neutral-200);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stat-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-1);
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--neutral-600);
  text-align: center;
}

.attempts-card .stat-value {
  color: var(--primary-color);
}

.score-card .stat-value {
  color: #8b5cf6;
}

.streak-card .stat-value {
  font-size: 24px;
}

.performance-insight {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  margin-top: var(--spacing-3);
  padding: var(--spacing-3);
  background-color: var(--neutral-50);
  border-radius: var(--radius-md);
}

.insight-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.insight-icon.insight-positive {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.insight-icon.insight-negative {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.insight-icon.insight-neutral {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.insight-content {
  font-size: var(--font-size-sm);
  color: var(--neutral-700);
  line-height: 1.5;
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

.legend-color.matched {
  background-color: rgba(16, 185, 129, 0.15);
  border-bottom: 2px solid #10b981;
}

.legend-color.unmatched {
  background-color: rgba(239, 68, 68, 0.1);
  border-bottom: 2px solid #ef4444;
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

.action-buttons-container {
  display: flex;
  gap: var(--spacing-3);
  align-items: center;
  justify-content: flex-end;
  width: 100%;
}

.ai-chat-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: 0.6rem 1rem;
  background-color: rgba(99, 102, 241, 0.05);
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
}

.ai-chat-btn:hover {
  background-color: rgba(99, 102, 241, 0.1);
}

.mr-2 {
  margin-right: var(--spacing-2);
}

.btn-primary {
  display: flex;
  align-items: center;
  background-color: #6c5ce7;
  color: white;
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

/* Responsive adjustments */
@media (max-width: 768px) {

  
  .schedule-grid {
    grid-template-columns: 1fr;
  }
  
  .past-attempts-stats {
    flex-wrap: wrap;
  }
  
  .stat-card {
    flex: 1;
    min-width: 0;
  }
}
</style>
