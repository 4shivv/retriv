<template>
  <div class="attempts-summary-section">
    <div class="section-header">
      <h5>{{ title }}</h5>
      <div v-if="attempts.length > displayLimit" class="view-all-link" @click="toggleViewAll">
        {{ showAll ? 'Show Less' : 'View All' }}
      </div>
    </div>
    
    <div v-if="attempts.length === 0" class="no-attempts">
      <div class="no-data-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 8v4"></path>
          <path d="M12 16h.01"></path>
        </svg>
      </div>
      <p>No attempts recorded yet</p>
      <p class="no-data-subtitle">Complete your first session to see results here</p>
    </div>
    
    <div v-else class="attempts-grid">
      <div 
        v-for="(attempt, index) in displayedAttempts" 
        :key="'attempt-' + index" 
        class="attempt-card"
        :class="{ 
          'latest-attempt': index === 0,
          'improved-attempt': index > 0 && attempt.matchPercentage > attempts[index-1].matchPercentage,
          'declined-attempt': index > 0 && attempt.matchPercentage < attempts[index-1].matchPercentage
        }"
      >
        <div class="attempt-header">
          <div class="attempt-score" :class="getScoreClass(attempt.matchPercentage)">
            {{ attempt.matchPercentage }}%
          </div>
          <div class="attempt-time">
            {{ formatDateWithTime(attempt.timestamp) }}
          </div>
        </div>
        
        <div class="attempt-metrics">
          <div class="metric-item">
            <div class="metric-label">Duration</div>
            <div class="metric-value">{{ formatDuration(attempt.studyDuration || 0) }}</div>
          </div>
          <div class="metric-item" v-if="attempt.wordsCount">
            <div class="metric-label">Words</div>
            <div class="metric-value">{{ attempt.wordsCount }}</div>
          </div>
          <div class="metric-item" v-if="index < attempts.length - 1">
            <div class="metric-label">Change</div>
            <div class="metric-value" :class="getChangeClass(attempt.matchPercentage, attempts[index+1].matchPercentage)">
              {{ calculateChange(attempt.matchPercentage, attempts[index+1].matchPercentage) }}
            </div>
          </div>
        </div>
        
        <div class="attempt-content" v-if="attempt.content">
          <div class="content-preview">
            {{ truncateContent(attempt.content) }}
          </div>
          <button class="btn-view-full" @click="showContentDetails(attempt)">
            View Full Response
          </button>
        </div>
        
        <div class="attempt-tags">
          <span v-if="index === 0" class="tag latest-tag">Latest</span>
          <span v-if="index > 0 && attempt.matchPercentage >= 90" class="tag excellent-tag">Excellent</span>
          <span v-if="index > 0 && attempt.matchPercentage > attempts[index-1].matchPercentage" class="tag improved-tag">Improved</span>
        </div>
      </div>
    </div>
    
    <!-- Load More Button -->
    <div v-if="attempts.length > displayLimit && !showAll" class="load-more-container">
      <button class="btn-load-more" @click="toggleViewAll">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="7 13 12 18 17 13"></polyline>
          <polyline points="7 6 12 11 17 6"></polyline>
        </svg>
        Load More Attempts
      </button>
    </div>
    
    <!-- Content Details Modal -->
    <div v-if="showModal" class="content-modal-backdrop" @click="closeModal">
      <div class="content-modal" @click.stop>
        <div class="modal-header">
          <h5>Attempt Details</h5>
          <button class="modal-close" @click="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-content">
          <div class="modal-info">
            <div class="modal-score" :class="getScoreClass(selectedAttempt?.matchPercentage || 0)">
              {{ selectedAttempt?.matchPercentage || 0 }}%
            </div>
            <div class="modal-date">{{ formatDateWithTime(selectedAttempt?.timestamp) }}</div>
          </div>
          <div class="attempt-details">
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Study Duration</div>
                <div class="detail-value">{{ formatDuration(selectedAttempt?.studyDuration || 0) }}</div>
              </div>
              <div class="detail-item" v-if="selectedAttempt?.wordsCount">
                <div class="detail-label">Words Count</div>
                <div class="detail-value">{{ selectedAttempt?.wordsCount }}</div>
              </div>
              <div class="detail-item" v-if="selectedAttempt?.charactersCount">
                <div class="detail-label">Characters</div>
                <div class="detail-value">{{ selectedAttempt?.charactersCount }}</div>
              </div>
              <div class="detail-item" v-if="selectedAttempt?.calculatedInterval">
                <div class="detail-label">Review Interval</div>
                <div class="detail-value">{{ formatInterval(selectedAttempt?.calculatedInterval) }}</div>
              </div>
            </div>
          </div>
          <div class="content-section" v-if="selectedAttempt?.content">
            <div class="content-label">Your Response:</div>
            <div class="content-text">{{ selectedAttempt?.content }}</div>
          </div>
          <div class="modal-actions">
            <button class="btn-secondary" @click="closeModal">Close</button>
            <button class="btn-primary" @click="viewComparison" v-if="hasComparisonData">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
              Compare Performance
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PastAttemptsSummary',
  
  props: {
    attempts: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: 'Recent Attempts'
    },
    displayLimit: {
      type: Number,
      default: 3
    }
  },
  
  data() {
    return {
      showAll: false,
      showModal: false,
      selectedAttempt: null
    };
  },
  
  computed: {
    displayedAttempts() {
      if (!this.attempts || this.attempts.length === 0) return [];
      
      return this.showAll ? this.attempts : this.attempts.slice(0, this.displayLimit);
    },
    
    hasComparisonData() {
      return this.attempts && this.attempts.length > 1 && this.selectedAttempt;
    }
  },
  
  methods: {
    toggleViewAll() {
      this.showAll = !this.showAll;
    },
    
    getScoreClass(score) {
      if (score >= 80) return 'excellent';
      if (score >= 70) return 'good';
      if (score >= 50) return 'average';
      return 'poor';
    },
    
    getChangeClass(currentScore, previousScore) {
      const difference = currentScore - previousScore;
      if (difference >= 10) return 'increase-large';
      if (difference > 0) return 'increase-small';
      if (difference <= -10) return 'decrease-large';
      if (difference < 0) return 'decrease-small';
      return 'no-change';
    },
    
    calculateChange(currentScore, previousScore) {
      const difference = currentScore - previousScore;
      return difference > 0 ? `+${difference.toFixed(1)}%` : `${difference.toFixed(1)}%`;
    },
    
    formatDateWithTime(dateString) {
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
    },
    
    formatDuration(duration) {
      if (!duration) return 'N/A';
      
      // Duration is in minutes
      if (duration < 1) {
        const seconds = Math.round(duration * 60);
        return `${seconds} sec`;
      }
      
      if (duration < 60) {
        return `${Math.round(duration)} min`;
      }
      
      const hours = Math.floor(duration / 60);
      const mins = Math.round(duration % 60);
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    },
    
    formatInterval(interval) {
      if (!interval) return 'N/A';
      
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
    },
    
    truncateContent(content) {
      if (!content) return '';
      
      if (content.length > 100) {
        return content.substring(0, 100) + '...';
      }
      
      return content;
    },
    
    showContentDetails(attempt) {
      this.selectedAttempt = attempt;
      this.showModal = true;
      document.body.style.overflow = 'hidden';
    },
    
    closeModal() {
      this.showModal = false;
      document.body.style.overflow = '';
    },
    
    viewComparison() {
      this.$emit('view-comparison', this.selectedAttempt);
      this.closeModal();
    }
  }
};
</script>

<style scoped>
.attempts-summary-section {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-md);
  margin-bottom: var(--spacing-6);
}

.section-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
}

.section-header h5 {
  margin: 0;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-lg);
  color: var(--neutral-800);
}

.view-all-link {
  color: var(--primary-color);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: color 0.2s ease;
}

.view-all-link:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

/* No Attempts State */
.no-attempts {
  text-align: center;
  padding: var(--spacing-6);
  background-color: var(--neutral-50);
  border-radius: var(--radius-md);
}

.no-data-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: var(--neutral-100);
  border-radius: var(--radius-full);
  margin: 0 auto var(--spacing-3);
  color: var(--neutral-500);
}

.no-attempts p {
  margin-bottom: var(--spacing-2);
  color: var(--neutral-700);
}

.no-data-subtitle {
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
}

/* Attempts Grid */
.attempts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-4);
}

.attempt-card {
  background: white;
  border-radius: var(--radius-lg);
  border: 1px solid var(--neutral-200);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
}

.attempt-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.latest-attempt {
  border-color: var(--primary-color);
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.1);
}

.improved-attempt {
  border-color: rgba(16, 185, 129, 0.5);
}

.declined-attempt {
  border-color: rgba(239, 68, 68, 0.5);
}

.attempt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-3);
  background-color: var(--neutral-50);
  border-bottom: 1px solid var(--neutral-200);
}

.attempt-score {
  font-weight: var(--font-weight-semibold);
  padding: 4px 10px;
  border-radius: var(--radius-full);
  color: white;
  font-size: var(--font-size-sm);
}

.attempt-score.excellent {
  background-color: #10b981;
}

.attempt-score.good {
  background-color: #06b6d4;
}

.attempt-score.average {
  background-color: #f59e0b;
}

.attempt-score.poor {
  background-color: #ef4444;
}

.attempt-time {
  font-size: var(--font-size-xs);
  color: var(--neutral-600);
}

.attempt-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: var(--spacing-3);
  padding: var(--spacing-3);
  border-bottom: 1px solid var(--neutral-100);
}

.metric-item {
  text-align: center;
}

.metric-label {
  font-size: var(--font-size-xs);
  color: var(--neutral-600);
  margin-bottom: 4px;
}

.metric-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--neutral-800);
}

.metric-value.increase-large {
  color: #10b981;
  font-weight: var(--font-weight-bold);
}

.metric-value.increase-small {
  color: #14b8a6;
}

.metric-value.decrease-large {
  color: #ef4444;
  font-weight: var(--font-weight-bold);
}

.metric-value.decrease-small {
  color: #f97316;
}

.attempt-content {
  padding: var(--spacing-3);
}

.content-preview {
  font-size: var(--font-size-sm);
  color: var(--neutral-700);
  margin-bottom: var(--spacing-3);
  line-height: 1.5;
  max-height: 80px;
  overflow: hidden;
  position: relative;
}

.content-preview::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
}

.btn-view-full {
  background-color: transparent;
  border: 1px solid var(--neutral-300);
  color: var(--neutral-700);
  padding: 6px 12px;
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-view-full:hover {
  background-color: var(--neutral-100);
  color: var(--neutral-900);
  border-color: var(--neutral-400);
}

.attempt-tags {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: var(--spacing-2);
}

.tag {
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: white;
}

.latest-tag {
  background-color: var(--primary-color);
  animation: pulse-tag 2s infinite;
}

.excellent-tag {
  background-color: #10b981;
}

.improved-tag {
  background-color: #06b6d4;
}

@keyframes pulse-tag {
  0% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
  }
  70% {
    box-shadow: 0 0 0 5px rgba(99, 102, 241, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
  }
}

/* Load More Button */
.load-more-container {
  text-align: center;
  margin-top: var(--spacing-4);
}

.btn-load-more {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: 8px 16px;
  border-radius: var(--radius-md);
  background-color: var(--neutral-100);
  color: var(--neutral-700);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border: 1px solid var(--neutral-300);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-load-more:hover {
  background-color: var(--neutral-200);
  color: var(--neutral-900);
}

/* Modal Styles */
.content-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-4);
}

.content-modal {
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: modal-enter 0.3s ease;
}

@keyframes modal-enter {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--neutral-200);
}

.modal-header h5 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-900);
}

.modal-close {
  background-color: transparent;
  border: none;
  color: var(--neutral-500);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: var(--radius-full);
  transition: all 0.2s ease;
}

.modal-close:hover {
  background-color: var(--neutral-100);
  color: var(--neutral-900);
}

.modal-content {
  padding: var(--spacing-4);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  flex: 1;
}

.modal-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacing-3);
  border-bottom: 1px solid var(--neutral-200);
}

.modal-score {
  font-weight: var(--font-weight-semibold);
  padding: 4px 12px;
  border-radius: var(--radius-full);
  color: white;
  font-size: var(--font-size-sm);
}

.modal-date {
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
}

.attempt-details {
  background-color: var(--neutral-50);
  border-radius: var(--radius-md);
  padding: var(--spacing-3);
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--spacing-3);
}

.detail-item {
  text-align: center;
}

.detail-label {
  font-size: var(--font-size-xs);
  color: var(--neutral-600);
  margin-bottom: 4px;
}

.detail-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--neutral-800);
}

.content-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.content-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--neutral-700);
}

.content-text {
  background-color: var(--neutral-50);
  border-radius: var(--radius-md);
  padding: var(--spacing-3);
  font-size: var(--font-size-sm);
  line-height: 1.6;
  color: var(--neutral-800);
  white-space: pre-wrap;
  overflow-y: auto;
  max-height: 300px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-3);
  margin-top: var(--spacing-2);
}

.btn-secondary {
  padding: 8px 16px;
  background-color: white;
  color: var(--neutral-700);
  border: 1px solid var(--neutral-300);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: var(--neutral-100);
  color: var(--neutral-900);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: 8px 16px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
}

/* Responsive Styles */
@media (max-width: 768px) {
  .attempts-grid {
    grid-template-columns: 1fr;
  }
  
  .details-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .content-modal {
    max-height: 90vh;
  }
}

@media (max-width: 480px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-2);
  }
  
  .view-all-link {
    align-self: flex-end;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .content-modal-backdrop {
    padding: var(--spacing-2);
  }
  
  .modal-info {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-2);
  }
  
  .modal-actions {
    flex-direction: column-reverse;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
  }
}
</style>
