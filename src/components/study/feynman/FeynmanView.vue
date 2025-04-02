<template>
  <div class="feynman-view">
    <div class="card">
      <div class="card-header">
        <h3>{{ title }}</h3>
        <button v-if="showCloseButton" @click="$emit('close')" class="close-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="card-body">
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner-large"></div>
          <p>Loading Feynman session...</p>
        </div>
        
        <div v-else-if="!session" class="no-session">
          <div class="no-session-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <h4>No Feynman sessions yet</h4>
          <p>Use the Feynman Technique to deepen your understanding by explaining concepts in your own words.</p>
          <button @click="$emit('start-feynman')" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
              <path d="M18.5 22q-1.05 0-1.775-.725T16 19.5q0-1.05.725-1.775T18.5 17q1.05 0 1.775.725T21 19.5q0 1.05-.725 1.775T18.5 22ZM18.5 7q-1.05 0-1.775-.725T16 4.5q0-1.05.725-1.775T18.5 2q1.05 0 1.775.725T21 4.5q0 1.05-.725 1.775T18.5 7ZM5.5 14.5q-1.05 0-1.775-.725T3 12q0-1.05.725-1.775T5.5 9.5q1.05 0 1.775.725T8 12q0 1.05-.725 1.775T5.5 14.5ZM18.5 12l-13 0M18.5 4.5l-13 7.5M18.5 19.5l-13-7.5"></path>
            </svg>
            Start Feynman Technique
          </button>
        </div>
        
        <div v-else class="session-container">
          <div class="session-header">
            <div class="session-meta">
              <div class="session-date">{{ formatDate(session.timestamp) }}</div>
              <div class="session-progress">
                <div class="progress-label">Understanding Improvement:</div>
                <div class="progress-value">
                  <span :class="progressClass">{{ session.finalScore - session.initialScore }}%</span>
                </div>
              </div>
            </div>
            
            <div class="score-comparison">
              <div class="score-item">
                <div class="score-label">Initial</div>
                <div class="score-value" :class="getScoreClass(session.initialScore)">
                  {{ session.initialScore }}%
                </div>
              </div>
              
              <div class="score-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
              
              <div class="score-item">
                <div class="score-label">Final</div>
                <div class="score-value" :class="getScoreClass(session.finalScore)">
                  {{ session.finalScore }}%
                </div>
              </div>
            </div>
          </div>
          
          <div class="session-content">
            <div class="content-tabs">
              <button 
                class="tab-button" 
                :class="{ active: activeTab === 'initial' }"
                @click="activeTab = 'initial'">
                Initial Explanation
              </button>
              <button 
                class="tab-button" 
                :class="{ active: activeTab === 'feedback' }"
                @click="activeTab = 'feedback'">
                AI Feedback
              </button>
              <button 
                class="tab-button" 
                :class="{ active: activeTab === 'refined' }"
                @click="activeTab = 'refined'">
                Refined Explanation
              </button>
            </div>
            
            <div class="tab-content">
              <div v-if="activeTab === 'initial'" class="initial-explanation">
                <p>{{ session.initialExplanation }}</p>
              </div>
              
              <div v-if="activeTab === 'feedback'" class="feedback-content">
                <div class="feedback-section">
                  <h5 class="feedback-heading">What You Understood</h5>
                  <div class="feedback-text strengths-text">
                    <p v-for="(strength, index) in session.feedback.strengths" :key="`strength-${index}`">
                      {{ strength }}
                    </p>
                  </div>
                </div>
                
                <div class="feedback-section">
                  <h5 class="feedback-heading">What You Failed to Explain</h5>
                  <div class="feedback-text gaps-text">
                    <p v-for="(gap, index) in session.feedback.gaps" :key="`gap-${index}`">
                      {{ gap }}
                    </p>
                  </div>
                </div>
                
                <div class="feedback-section">
                  <h5 class="feedback-heading">Suggestions for Improvement</h5>
                  <div class="feedback-text suggestions-text">
                    <p v-for="(suggestion, index) in session.feedback.suggestions" :key="`suggestion-${index}`">
                      {{ suggestion }}
                    </p>
                  </div>
                </div>
              </div>
              
              <div v-if="activeTab === 'refined'" class="refined-explanation">
                <p>{{ session.refinedExplanation }}</p>
              </div>
            </div>
          </div>
          
          <div class="session-actions">
            <button @click="$emit('start-feynman')" class="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                <path d="M20 11.08V8l-6-6H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h6"></path>
                <path d="M14 3v5h5M18 21v-6M15 18h6"></path>
              </svg>
              Improve with Feynman Technique
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import StudyService from '@/services/study.service';

export default {
  name: 'FeynmanView',
  props: {
    materialId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    showCloseButton: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'start-feynman'],
  
  setup(props) {
    const loading = ref(true);
    const session = ref(null);
    const activeTab = ref('initial');
    
    // Load the most recent Feynman session for this material
    const loadSession = async () => {
      try {
        loading.value = true;
        const sessions = await StudyService.getFeynmanSessions(props.materialId);
        if (sessions && sessions.length > 0) {
          // Sort sessions by timestamp (newest first)
          const sortedSessions = [...sessions].sort((a, b) => {
            const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
            const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
            return dateB - dateA;
          });
          
          session.value = sortedSessions[0];
        }
      } catch (error) {
        console.error('Error loading Feynman session:', error);
      } finally {
        loading.value = false;
      }
    };
    
    // Load session on component mount
    loadSession();
    
    // Format date helper
    const formatDate = (timestamp) => {
      if (!timestamp) return '';
      
      const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
    
    // Get appropriate CSS class for a score
    const getScoreClass = (score) => {
      if (score >= 80) return 'excellent';
      if (score >= 60) return 'good';
      if (score >= 40) return 'fair';
      return 'needs-work';
    };
    
    // Computed property for progress class
    const progressClass = computed(() => {
      if (!session.value) return '';
      
      const improvement = session.value.finalScore - session.value.initialScore;
      
      if (improvement >= 20) return 'progress-excellent';
      if (improvement >= 10) return 'progress-good';
      if (improvement > 0) return 'progress-fair';
      return 'progress-neutral';
    });
    
    return {
      loading,
      session,
      activeTab,
      formatDate,
      getScoreClass,
      progressClass
    };
  }
};
</script>

<style scoped>
.feynman-view {
  margin-bottom: var(--spacing-lg);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-button {
  background: none;
  border: none;
  color: var(--neutral-500);
  cursor: pointer;
  transition: color var(--transition-normal);
}

.close-button:hover {
  color: var(--neutral-800);
}

/* Loading state */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-8);
  color: var(--neutral-500);
}

.loading-spinner-large {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(99, 102, 241, 0.2);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-4);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* No session state */
.no-session {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-8);
  text-align: center;
}

.no-session-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(99, 102, 241, 0.1);
  border-radius: var(--radius-full);
  color: var(--primary-color);
  margin-bottom: var(--spacing-4);
}

.no-session h4 {
  margin-bottom: var(--spacing-3);
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-800);
}

.no-session p {
  margin-bottom: var(--spacing-6);
  color: var(--neutral-600);
  max-width: 500px;
}

.btn {
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
}

.btn-outline {
  background-color: transparent;
  border: 1px solid var(--neutral-300);
  color: var(--neutral-700);
}

.btn-outline:hover {
  border-color: var(--neutral-400);
  background-color: var(--neutral-100);
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Session container */
.session-container {
  padding: var(--spacing-4);
}

.session-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-6);
  padding-bottom: var(--spacing-4);
  border-bottom: 1px solid var(--neutral-200);
}

.session-meta {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.session-date {
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
}

.session-progress {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.progress-label {
  font-weight: var(--font-weight-medium);
  color: var(--neutral-700);
}

.progress-value span {
  font-weight: var(--font-weight-bold);
}

.progress-excellent {
  color: #10b981;
}

.progress-good {
  color: #3b82f6;
}

.progress-fair {
  color: #f59e0b;
}

.progress-neutral {
  color: var(--neutral-500);
}

.score-comparison {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.score-item {
  text-align: center;
}

.score-label {
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
  margin-bottom: var(--spacing-1);
}

.score-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
}

.score-value.excellent {
  color: #10b981;
}

.score-value.good {
  color: #3b82f6;
}

.score-value.fair {
  color: #f59e0b;
}

.score-value.needs-work {
  color: #ef4444;
}

.score-arrow {
  color: var(--neutral-400);
}

/* Session content */
.session-content {
  margin-bottom: var(--spacing-6);
}

.content-tabs {
  display: flex;
  border-bottom: 1px solid var(--neutral-200);
  margin-bottom: var(--spacing-4);
}

.tab-button {
  padding: var(--spacing-3) var(--spacing-4);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  color: var(--neutral-600);
  transition: all var(--transition-normal);
}

.tab-button:hover {
  color: var(--neutral-900);
}

.tab-button.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.tab-content {
  min-height: 200px;
  padding: var(--spacing-4);
}

.initial-explanation, .refined-explanation {
  line-height: 1.6;
  color: var(--neutral-800);
}

/* Feedback styling */
.feedback-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-5);
  margin-bottom: var(--spacing-4);
}

.feedback-section {
  margin-bottom: var(--spacing-5);
}

.feedback-heading {
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-800);
  margin-bottom: var(--spacing-3);
  font-size: 1.05rem;
}

.feedback-text {
  margin: 0;
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-3);
  box-shadow: var(--shadow-sm);
}

.feedback-text p {
  margin-bottom: var(--spacing-3);
  line-height: 1.6;
  word-wrap: break-word;
  font-size: 1rem;
}

.feedback-text p:last-child {
  margin-bottom: 0;
}

.strengths-text {
  background-color: rgba(16, 185, 129, 0.1);
  border-left: 3px solid #10b981;
}

.strengths-text p {
  color: #10b981;
}

.gaps-text {
  background-color: rgba(239, 68, 68, 0.1);
  border-left: 3px solid #ef4444;
}

.gaps-text p {
  color: #ef4444;
}

.suggestions-text {
  background-color: rgba(99, 102, 241, 0.1);
  border-left: 3px solid var(--primary-color);
}

.suggestions-text p {
  color: var(--neutral-700);
}

.session-actions {
  display: flex;
  justify-content: flex-end;
}

.mr-2 {
  margin-right: var(--spacing-2);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .session-header {
    flex-direction: column;
    gap: var(--spacing-4);
  }
  
  .score-comparison {
    width: 100%;
    justify-content: space-between;
  }
  
  .content-tabs {
    overflow-x: auto;
    white-space: nowrap;
    gap: var(--spacing-1);
  }
  
  .tab-button {
    padding: var(--spacing-3) var(--spacing-2);
  }
}
</style>