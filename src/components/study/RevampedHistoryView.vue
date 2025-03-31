<template>
  <div class="history-view">
    <div class="history-view-header">
      <h5>Study History</h5>
      <div class="view-filter" v-if="pastAttempts && pastAttempts.length > 0">
        <button 
          class="filter-btn" 
          :class="{ 'active': filter === 'all' }" 
          @click="filter = 'all'"
        >
          All
        </button>
        <button 
          class="filter-btn" 
          :class="{ 'active': filter === 'due' }" 
          @click="filter = 'due'"
        >
          Due Today
        </button>
        <button 
          class="filter-btn" 
          :class="{ 'active': filter === 'upcoming' }" 
          @click="filter = 'upcoming'"
        >
          Upcoming
        </button>
      </div>
    </div>
    
    <div v-if="pastAttempts && pastAttempts.length > 0" class="history-cards">
      <div 
        v-for="(attempt, attemptIndex) in pastAttempts" 
        :key="'attempt-' + attemptIndex" 
        class="history-card"
      >
        <div class="history-card-header">
          <div class="card-meta">
            <div class="score-badge" :class="getScoreClass(attempt.matchPercentage)">
              {{ attempt.matchPercentage }}%
            </div>
            <div class="attempt-date">
              {{ formatDateWithTime(attempt.timestamp) }}
              <span v-if="attemptIndex === 0" class="latest-tag">Latest</span>
            </div>
          </div>
          <button class="btn-view-details" @click="showAttemptDetails(attempt)">
            Details
          </button>
        </div>
        
        <div class="review-schedule-section">
          <div class="schedule-header">
            <h6>Review Schedule:</h6>
            <span v-if="getUpcomingReviewCount(attempt) > 0" class="reviews-count">
              {{ getUpcomingReviewCount(attempt) }} upcoming
            </span>
          </div>
          
          <div class="timeline-schedule">
            <div 
              v-for="(review, reviewIndex) in getReviewScheduleForAttempt(attempt)"
              :key="'review-' + attemptIndex + '-' + reviewIndex"
              class="review-item"
              :class="getReviewStatusClass(review)"
            >
              <div class="review-time">{{ formatReviewDate(review) }}</div>
              <div class="review-status-badge" :class="getReviewStatusClass(review)">
                {{ getReviewStatusText(review) }}
              </div>
            </div>
            
            <div v-if="!getReviewScheduleForAttempt(attempt).length" class="no-reviews">
              No reviews scheduled
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="no-history">
      <div class="no-history-card">
        <div class="no-history-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <p>No previous study history for this material.</p>
        <p class="no-history-subtitle">Complete this session to start tracking your progress.</p>
      </div>
    </div>
    
    <!-- Attempt Details Modal -->
    <div v-if="showModal" class="details-modal-backdrop" @click="closeModal">
      <div class="details-modal" @click.stop>
        <div class="modal-header">
          <h5>Study Session Details</h5>
          <button class="modal-close" @click="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="modal-content">
          <div class="modal-score-section">
            <div class="score-display" :class="getScoreClass(selectedAttempt?.matchPercentage || 0)">
              <div class="score-value">{{ selectedAttempt?.matchPercentage || 0 }}%</div>
              <div class="score-label">Recall Score</div>
            </div>
            
            <div class="session-metadata">
              <div class="metadata-item">
                <div class="metadata-label">Date</div>
                <div class="metadata-value">{{ formatDateWithTime(selectedAttempt?.timestamp) }}</div>
              </div>
              <div class="metadata-item">
                <div class="metadata-label">Duration</div>
                <div class="metadata-value">{{ formatDuration(selectedAttempt?.studyDuration || 0) }}</div>
              </div>
              <div class="metadata-item" v-if="selectedAttempt?.wordsCount">
                <div class="metadata-label">Words</div>
                <div class="metadata-value">{{ selectedAttempt?.wordsCount }}</div>
              </div>
            </div>
          </div>
          
          <div class="modal-response-section">
            <h6>Your Response</h6>
            <div class="response-content">
              {{ selectedAttempt?.content || 'No response recorded' }}
            </div>
          </div>
          
          <div class="modal-schedule-section">
            <h6>Review Schedule</h6>
            <div class="schedule-timeline">
              <div 
                v-for="(review, index) in getReviewScheduleForAttempt(selectedAttempt)"
                :key="'modal-review-' + index"
                class="timeline-event"
                :class="getReviewStatusClass(review)"
              >
                <div class="event-dot" :class="getReviewStatusClass(review)"></div>
                <div class="event-content">
                  <div class="event-time">{{ formatDateWithTime(review) }}</div>
                  <div class="event-status">{{ getReviewStatusText(review) }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-actions">
            <button class="btn-secondary" @click="closeModal">Close</button>
            <button class="btn-primary" @click="studyAgain">
              Study Again
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RevampedHistoryView',
  props: {
    pastAttempts: {
      type: Array,
      required: true
    },
    reviewSchedule: {
      type: Array,
      default: () => []
    }
  },
  
  data() {
    return {
      filter: 'all', // 'all', 'due', 'upcoming'
      showModal: false,
      selectedAttempt: null
    };
  },
  
  methods: {
    // Score related methods
    getScoreClass(score) {
      if (score >= 80) return 'excellent';
      if (