<template>
  <div class="study-session-page">
    <div class="study-header">
      <h1>Study Session</h1>
      <p class="study-description" v-if="material">{{ material.title }}</p>
    </div>
    
    <!-- Main Content Area -->
    <div class="study-content" v-if="material">
      <div v-if="error" class="alert alert-danger">
        <div class="alert-content">
          <div class="alert-text">{{ error }}</div>
        </div>
      </div>
      
      <!-- Study Progress -->
      <div class="progress-section" v-if="!loading && !showResults">
        <div class="session-progress">
          <div class="progress-label">Study Session Progress</div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: studyProgress + '%' }"></div>
          </div>
          <div class="progress-info">
            <span>{{ studyStage }}/3</span>
            <span v-if="timeElapsed">{{ formatTimeElapsed(timeElapsed) }}</span>
          </div>
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner-large"></div>
        <p>Loading study material...</p>
      </div>
      
      <!-- Study Stages -->
      <div v-else-if="!showResults" class="study-stages">
        <!-- Stage 1: Review Material -->
        <div v-if="studyStage === 1" class="study-stage">
          <div class="stage-header">
            <div class="stage-indicator">
              <div class="stage-number active">1</div>
              <div class="stage-label">Review</div>
            </div>
            <div class="stage-indicator">
              <div class="stage-number">2</div>
              <div class="stage-label">Recall</div>
            </div>
            <div class="stage-indicator">
              <div class="stage-number">3</div>
              <div class="stage-label">Results</div>
            </div>
          </div>
          
          <div class="material-review-card">
            <div class="material-content">
              <h3 class="material-title">{{ material.title }}</h3>
              <div class="material-text">{{ material.content }}</div>
            </div>
            <div class="review-footer">
              <p class="review-instruction">
                Read through the material carefully. When you're ready, click the button below to test your recall.
              </p>
              <button @click="goToRecallStage" class="btn btn-primary btn-lg">
                I'm Ready to Recall
              </button>
            </div>
          </div>
        </div>
        
        <!-- Stage 2: Recall -->
        <div v-else-if="studyStage === 2" class="study-stage">
          <div class="stage-header">
            <div class="stage-indicator">
              <div class="stage-number completed">1</div>
              <div class="stage-label">Review</div>
            </div>
            <div class="stage-indicator">
              <div class="stage-number active">2</div>
              <div class="stage-label">Recall</div>
            </div>
            <div class="stage-indicator">
              <div class="stage-number">3</div>
              <div class="stage-label">Results</div>
            </div>
          </div>
          
          <div class="recall-card">
            <div class="recall-header">
              <h3 class="recall-title">{{ material.title }}</h3>
              <p class="recall-instruction">
                Now, without looking back at the original material, write down everything you can remember.
                Focus on the key concepts and try to be as thorough as possible.
              </p>
            </div>
            
            <div class="recall-content">
              <textarea
                v-model="recalledContent"
                class="recall-textarea"
                placeholder="Write what you remember here..."
                rows="12"
              ></textarea>
            </div>
            
            <div class="recall-footer">
              <button @click="goToReviewStage" class="btn btn-outline">
                Go Back to Review
              </button>
              <button @click="submitRecall" class="btn btn-primary" :disabled="isSubmitting || !recalledContent.trim()">
                <span v-if="isSubmitting" class="loading-spinner"></span>
                <span v-else>Submit Recall</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Study Results -->
      <div v-else class="study-results">
        <div class="stage-header">
          <div class="stage-indicator">
            <div class="stage-number completed">1</div>
            <div class="stage-label">Review</div>
          </div>
          <div class="stage-indicator">
            <div class="stage-number completed">2</div>
            <div class="stage-label">Recall</div>
          </div>
          <div class="stage-indicator">
            <div class="stage-number active">3</div>
            <div class="stage-label">Results</div>
          </div>
        </div>
        
        <div class="results-card">
          <div class="results-header">
            <h3 class="results-title">Study Results</h3>
          </div>
          
          <div class="score-section">
            <div class="score-card" :class="getScoreClass(matchPercentage)">
              <div class="score-value">{{ matchPercentage }}%</div>
              <div class="score-label">Recall Accuracy</div>
            </div>
            
            <div class="score-message">
              <p v-if="matchPercentage >= 90">Excellent! Your recall is exceptional.</p>
              <p v-else-if="matchPercentage >= 80">Great job! Your recall is very good.</p>
              <p v-else-if="matchPercentage >= 70">Good work! Your recall is solid.</p>
              <p v-else-if="matchPercentage >= 50">Decent effort! Your recall needs some work.</p>
              <p v-else>Keep practicing! Your recall needs significant improvement.</p>
            </div>
          </div>
          
          <div class="review-schedule-section" v-if="reviewSchedule && reviewSchedule.length > 0">
            <h4>Optimized Review Schedule</h4>
            <p class="schedule-intro">
              Based on your performance, we've created a personalized review schedule to help you
              retain this material long-term.
            </p>
            
            <div class="schedule-timeline">
              <div v-for="(date, index) in reviewSchedule" :key="index" class="timeline-event">
                <div class="timeline-dot"></div>
                <div class="timeline-date">{{ formatDate(date) }}</div>
                <div class="timeline-label">
                  {{ getTimeframeLabel(date) }}
                </div>
              </div>
            </div>
          </div>
          
          <div class="comparison-section">
            <h4>Comparison</h4>
            
            <div class="comparison-container">
              <div class="original-content">
                <h5>Original Content</h5>
                <div class="content-box">{{ material.content }}</div>
              </div>
              
              <div class="recalled-content">
                <h5>Your Recall</h5>
                <div class="content-box">{{ recalledContent }}</div>
              </div>
            </div>
          </div>
          
          <div class="results-footer">
            <button @click="goToMaterials" class="btn btn-outline btn-lg">
              Back to Materials
            </button>
            <button @click="startNewSession" class="btn btn-primary btn-lg">
              Study Again
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import StudyService from '@/services/study.service';

export default {
  name: 'StudySessionView',
  
  setup() {
    const router = useRouter();
    const route = useRoute();
    
    // State
    const material = ref(null);
    const error = ref('');
    const loading = ref(true);
    const studyStage = ref(1);
    const recalledContent = ref('');
    const showResults = ref(false);
    const matchPercentage = ref(0);
    const reviewSchedule = ref([]);
    const timeElapsed = ref(0);
    const timerInterval = ref(null);
    const attemptId = ref(null);
    const isSubmitting = ref(false);
    
    // Computed Properties
    const studyProgress = computed(() => {
      if (showResults.value) return 100;
      return studyStage.value * 33.33;
    });
    
    // Load material based on route parameter
    onMounted(async () => {
      const materialId = route.params.id;
      
      if (!materialId) {
        error.value = 'No material selected for study.';
        loading.value = false;
        return;
      }
      
      try {
        loading.value = true;
        // Get all materials and find the one matching the ID
        const materials = await StudyService.getStudyMaterials();
        const foundMaterial = materials.find(m => m.id === materialId);
        
        if (!foundMaterial) {
          error.value = 'Study material not found.';
          loading.value = false;
          return;
        }
        
        material.value = foundMaterial;
        
        // Start timer
        startTimer();
        
      } catch (err) {
        console.error('Error loading study material:', err);
        error.value = err.message || 'Failed to load study material';
      } finally {
        loading.value = false;
      }
    });
    
    onBeforeUnmount(() => {
      // Clear timer when component is destroyed
      clearInterval(timerInterval.value);
    });
    
    // Timer Functions
    const startTimer = () => {
      const startTime = Date.now();
      
      timerInterval.value = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        timeElapsed.value = Math.floor(elapsedTime / 1000);
      }, 1000);
    };
    
    const formatTimeElapsed = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };
    
    // Stage Navigation Functions
    const goToReviewStage = () => {
      studyStage.value = 1;
    };
    
    const goToRecallStage = () => {
      studyStage.value = 2;
    };
    
    // Calculate match percentage between original and recalled content
    const calculateMatchPercentage = (original, recalled) => {
      // This is a simplified implementation
      // In a real app, you'd use a more sophisticated algorithm
      
      if (!original || !recalled) return 0;
      
      // Normalize strings
      const normalizeString = (str) => {
        return str.toLowerCase()
          .replace(/[^\w\s]/g, '') // Remove punctuation
          .replace(/\s+/g, ' ')    // Replace multiple spaces with single space
          .trim();
      };
      
      const normalizedOriginal = normalizeString(original);
      const normalizedRecalled = normalizeString(recalled);
      
      // Calculate word match
      const originalWords = normalizedOriginal.split(' ');
      const recalledWords = normalizedRecalled.split(' ');
      
      const uniqueOriginalWords = new Set(originalWords);
      
      let matchedWords = 0;
      for (const word of recalledWords) {
        if (uniqueOriginalWords.has(word)) {
          matchedWords++;
        }
      }
      
      // Calculate percentage
      const coverage = matchedWords / uniqueOriginalWords.size;
      // Adjust score based on length difference
      const lengthRatio = Math.min(recalledWords.length, originalWords.length) / 
                        Math.max(recalledWords.length, originalWords.length);
      
      // Combined score with more weight on coverage
      const score = (coverage * 0.7) + (lengthRatio * 0.3);
      
      // Convert to percentage and round to nearest integer
      return Math.round(score * 100);
    };
    
    // Submit recall and show results
    const submitRecall = async () => {
      if (!recalledContent.value.trim()) return;
      
      try {
        isSubmitting.value = true;
        
        // Calculate match percentage
        const calculatedPercentage = calculateMatchPercentage(
          material.value.content,
          recalledContent.value
        );
        
        matchPercentage.value = calculatedPercentage;
        
        // Save the study attempt
        const savedAttemptId = await StudyService.saveStudyAttempt(
          material.value.id,
          recalledContent.value,
          calculatedPercentage
        );
        
        attemptId.value = savedAttemptId;
        
        // Generate spaced repetition schedule
        const schedule = await StudyService.generateSpacedRepetitionSchedule(
          savedAttemptId,
          calculatedPercentage
        );
        
        reviewSchedule.value = schedule;
        
        // Show results
        showResults.value = true;
        
        // Stop timer
        clearInterval(timerInterval.value);
        
      } catch (err) {
        console.error('Error submitting recall:', err);
        error.value = err.message || 'Failed to save study attempt';
      } finally {
        isSubmitting.value = false;
      }
    };
    
    // Format date for display
    const formatDate = (date) => {
      if (!date) return 'N/A';
      
      const dateObj = new Date(date);
      
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }).format(dateObj);
    };
    
    // Get timeframe label for review schedule
    const getTimeframeLabel = (date) => {
      if (!date) return '';
      
      const now = new Date();
      const reviewDate = new Date(date);
      const diffHours = Math.floor((reviewDate - now) / (1000 * 60 * 60));
      
      if (diffHours < 24) {
        return 'Today';
      } else if (diffHours < 48) {
        return 'Tomorrow';
      } else if (diffHours < 168) { // 7 days
        return 'This week';
      } else if (diffHours < 720) { // 30 days
        return 'This month';
      } else {
        return 'Later';
      }
    };
    
    // Get CSS class based on score
    const getScoreClass = (score) => {
      if (score >= 90) return 'excellent';
      if (score >= 80) return 'good';
      if (score >= 70) return 'fair';
      if (score >= 50) return 'poor';
      return 'very-poor';
    };
    
    // Navigation after study
    const goToMaterials = () => {
      router.push('/dashboard');
    };
    
    const startNewSession = () => {
      // Reset state and start a new session
      studyStage.value = 1;
      recalledContent.value = '';
      showResults.value = false;
      matchPercentage.value = 0;
      reviewSchedule.value = [];
      timeElapsed.value = 0;
      
      // Start timer again
      startTimer();
    };
    
    return {
      material,
      error,
      loading,
      studyStage,
      recalledContent,
      showResults,
      matchPercentage,
      reviewSchedule,
      timeElapsed,
      studyProgress,
      isSubmitting,
      goToReviewStage,
      goToRecallStage,
      submitRecall,
      formatDate,
      getTimeframeLabel,
      getScoreClass,
      formatTimeElapsed,
      goToMaterials,
      startNewSession
    };
  }
};
</script>

<style scoped>
.study-session-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}

.study-header {
  margin-bottom: 2rem;
}

.study-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--neutral-900);
  margin-bottom: 0.5rem;
}

.study-description {
  color: var(--neutral-600);
  font-size: 1.1rem;
}

.study-content {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 2.5rem;
  min-height: 75vh;
  display: flex;
  flex-direction: column;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: var(--neutral-600);
  min-height: 300px;
}

.loading-spinner-large {
  width: 3rem;
  height: 3rem;
  border: 3px solid rgba(99, 102, 241, 0.2);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Progress Section */
.progress-section {
  margin-bottom: 2rem;
}

.session-progress {
  background-color: var(--neutral-50);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  border: 1px solid var(--neutral-200);
}

.progress-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--neutral-700);
  margin-bottom: 0.75rem;
}

.progress-bar {
  height: 0.5rem;
  background-color: var(--neutral-200);
  border-radius: 9999px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.progress-fill {
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--neutral-500);
}

/* Stage Header */
.stage-header {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  position: relative;
}

.stage-header::after {
  content: '';
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2px;
  background-color: var(--neutral-300);
  z-index: 0;
}

.stage-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
  z-index: 1;
}

.stage-number {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: white;
  border: 2px solid var(--neutral-300);
  color: var(--neutral-600);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.stage-number.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.stage-number.completed {
  background-color: var(--success-color);
  border-color: var(--success-color);
  color: white;
}

.stage-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--neutral-600);
}

/* Material Review Card */
.material-review-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--neutral-200);
  padding: 2rem;
  margin-bottom: 2rem;
}

.material-content {
  margin-bottom: 2rem;
}

.material-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--neutral-900);
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--neutral-200);
  padding-bottom: 1rem;
}

.material-text {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--neutral-800);
  white-space: pre-wrap;
  max-height: 400px;
  overflow-y: auto;
  padding: 1rem;
  background-color: var(--neutral-50);
  border-radius: 8px;
  border: 1px solid var(--neutral-200);
}

.review-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--neutral-200);
}

.review-instruction {
  font-size: 1rem;
  color: var(--neutral-700);
  margin-bottom: 1.5rem;
  max-width: 600px;
}

/* Recall Card */
.recall-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--neutral-200);
  padding: 2rem;
  margin-bottom: 2rem;
}

.recall-header {
  margin-bottom: 1.5rem;
}

.recall-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--neutral-900);
  margin-bottom: 1rem;
}

.recall-instruction {
  font-size: 1rem;
  color: var(--neutral-700);
  line-height: 1.6;
}

.recall-content {
  margin-bottom: 2rem;
}

.recall-textarea {
  width: 100%;
  min-height: 300px;
  padding: 1rem;
  border: 1px solid var(--neutral-300);
  border-radius: 8px;
  font-size: 1rem;
  line-height: 1.6;
  resize: vertical;
  transition: all 0.2s ease;
}

.recall-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.recall-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 1px solid var(--neutral-200);
}

/* Results Card */
.results-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--neutral-200);
  padding: 2rem;
  margin-bottom: 2rem;
}

.results-header {
  margin-bottom: 2rem;
  text-align: center;
}

.results-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--neutral-900);
}

.score-section {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 2rem;
}

.score-card {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  min-width: 180px;
  transition: all 0.3s ease;
}

.score-card.excellent {
  background-color: #10B981;
  color: white;
}

.score-card.good {
  background-color: #3B82F6;
  color: white;
}

.score-card.fair {
  background-color: #F59E0B;
  color: white;
}

.score-card.poor {
  background-color: #F97316;
  color: white;
}

.score-card.very-poor {
  background-color: #EF4444;
  color: white;
}

.score-value {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.score-label {
  font-size: 0.875rem;
  font-weight: 500;
  opacity: 0.9;
}

.score-message {
  flex: 1;
  min-width: 250px;
  max-width: 400px;
  font-size: 1.25rem;
  color: var(--neutral-800);
  text-align: center;
  padding: 1rem 0;
  border-radius: 8px;
  background-color: var(--neutral-50);
  border: 1px solid var(--neutral-200);
}

.review-schedule-section {
  margin: 2rem 0 3rem;
  padding: 1.5rem;
  background-color: var(--neutral-50);
  border-radius: 12px;
  border: 1px solid var(--neutral-200);
}

.review-schedule-section h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--neutral-900);
  margin-bottom: 1rem;
}

.schedule-intro {
  font-size: 0.875rem;
  color: var(--neutral-600);
  margin-bottom: 1.5rem;
}

.schedule-timeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.timeline-event {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--primary-color);
}

.timeline-date {
  flex: 1;
  font-weight: 500;
  color: var(--neutral-800);
}

.timeline-label {
  padding: 0.25rem 0.5rem;
  background-color: var(--primary-light);
  color: var(--primary-color);
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.comparison-section {
  margin-bottom: 2rem;
}

.comparison-section h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--neutral-900);
  margin-bottom: 1.5rem;
}

.comparison-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.original-content h5, .recalled-content h5 {
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--neutral-800);
}

.content-box {
  padding: 1rem;
  background-color: var(--neutral-50);
  border: 1px solid var(--neutral-200);
  border-radius: 8px;
  font-size: 0.875rem;
  line-height: 1.6;
  height: 300px;
  overflow-y: auto;
  white-space: pre-wrap;
}

.results-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--neutral-200);
}

/* Button Styles */
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-lg {
  padding: 0.875rem 1.75rem;
  font-size: 1.125rem;
}

.btn-outline {
  background-color: white;
  border: 2px solid var(--neutral-300);
  color: var(--neutral-700);
}

.btn-outline:hover {
  border-color: var(--neutral-400);
  background-color: var(--neutral-100);
}

.btn-primary {
  background-color: var(--primary-color);
  border: 2px solid var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
  border-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(99, 102, 241, 0.25);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
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

/* Alert Styling */
.alert {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid transparent;
}

.alert-danger {
  background-color: rgba(239, 68, 68, 0.1);
  border-left-color: #ef4444;
}

.alert-text {
  color: #b91c1c;
  font-size: 0.875rem;
}

/* Responsive styles */
@media (max-width: 768px) {
  .study-session-page {
    padding: 1rem;
  }
  
  .study-content {
    padding: 1.5rem;
  }
  
  .recall-footer, .results-footer {
    flex-direction: column;
    gap: 1rem;
  }
  
  .recall-footer button, .results-footer button {
    width: 100%;
  }
  
  .score-section {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .score-card {
    width: 100%;
  }
  
  .timeline-event {
    flex-wrap: wrap;
  }
}
</style>