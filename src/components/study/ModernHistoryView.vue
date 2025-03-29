<template>
  <div class="history-view">
    <div class="history-view-header">
      <h5>Study History</h5>
      <div class="history-view-stats" v-if="pastAttempts && pastAttempts.length > 0">
        <div class="stats-card attempts-card">
          <div class="stats-value">{{ pastAttempts.length }}</div>
          <div class="stats-label">Total Attempts</div>
        </div>
        <div class="stats-card streak-card" v-if="pastAttempts.length > 1">
          <div class="stats-value">{{ isImproving ? '↑' : (isDecreasing ? '↓' : '→') }}</div>
          <div class="stats-label">{{ performanceTrendText }}</div>
        </div>
        <div class="stats-card score-card" v-if="pastAttempts.length > 0">
          <div class="stats-value">{{ pastAttempts[0].matchPercentage }}%</div>
          <div class="stats-label">Latest Score</div>
        </div>
      </div>
    </div>
    
    <div v-if="pastAttempts && pastAttempts.length > 0" class="performance-history">
      <!-- Performance Insights Banner -->
      <div class="insights-banner" v-if="performanceInsight">
        <div class="insight-icon">
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
        <div class="insight-text">{{ performanceInsight }}</div>
      </div>
      
      <!-- Modern Performance Chart -->
      <div class="modern-chart-container">
        <div class="chart-header">
          <div class="chart-title">Recall Performance History</div>
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
        
        <!-- Chart Area -->
        <div class="modern-chart">
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
            <div class="threshold-line excellent-threshold" style="bottom: 80%">
              <span class="threshold-label">Excellent (80%)</span>
            </div>
            <div class="threshold-line average-threshold" style="bottom: 50%">
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
                  <div class="tooltip-header">
                    <div class="tooltip-score-badge" :class="getScoreClass(attempt.matchPercentage)">
                      {{ attempt.matchPercentage }}%
                    </div>
                    <div class="tooltip-date">{{ formatDateWithTime(attempt.timestamp) }}</div>
                  </div>
                  <div class="tooltip-details">
                    <div class="tooltip-detail-item" v-if="index > 0 && pastAttempts[index-1]">
                      <span class="detail-label">Change:</span>
                      <span class="detail-value" :class="getChangeClass(attempt.matchPercentage, pastAttempts[index-1].matchPercentage)">
                        {{ calculateChange(attempt.matchPercentage, pastAttempts[index-1].matchPercentage) }}
                      </span>
                    </div>
                    <div class="tooltip-detail-item" v-if="attempt.calculatedInterval">
                      <span class="detail-label">Interval:</span>
                      <span class="detail-value">{{ formatInterval(attempt.calculatedInterval) }}</span>
                    </div>
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
      <div class="modern-schedule-section">
        <div class="section-header">
          <h5>Memory Reinforcement Plan</h5>
          <div class="schedule-actions" v-if="reviewSchedule && reviewSchedule.length > 0">
            <button class="btn btn-sm" @click="addToCalendar">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
              Sync with Calendar
            </button>
          </div>
        </div>
        
        <div class="schedule-cards-container" v-if="reviewSchedule && reviewSchedule.length > 0">
          <div 
            v-for="(date, index) in reviewSchedule.slice(0, 5)" 
            :key="'schedule-' + index" 
            class="schedule-card-modern" 
            :class="getScheduleCardClass(date, index)"
          >
            <div class="schedule-card-tag" :class="getScheduleTagClass(date)">{{ getScheduleTagText(date) }}</div>
            <div class="schedule-card-content">
              <div class="schedule-card-time">{{ formatReviewDate(date) }}</div>
              <div class="schedule-card-interval">{{ getIntervalLabel(date) }}</div>
              <div class="schedule-card-note">{{ getScheduleNote(date) }}</div>
            </div>
            <div class="schedule-card-check" v-if="isPastDate(date)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="timeline-container" v-if="reviewSchedule && reviewSchedule.length > 0">
          <div class="timeline-line"></div>
          <div 
            v-for="(date, index) in reviewSchedule" 
            :key="'timeline-' + index" 
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
  </div>
</template>

<script>
export default {
  name: 'ModernHistoryView',
  props: {
    pastAttempts: {
      type: Array,
      required: true
    },
    reviewSchedule: {
      type: Array,
      default: () => []
    },
    isImproving: {
      type: Boolean,
      default: false
    },
    isDecreasing: {
      type: Boolean,
      default: false
    },
    performanceTrendText: {
      type: String,
      default: 'Stable'
    },
    performanceInsight: {
      type: String,
      default: ''
    }
  },
  
  data() {
    return {
      tooltipIndex: null
    };
  },
  
  methods: {
    // Chart methods
    getAreaChartPath() {
      if (!this.pastAttempts || this.pastAttempts.length < 2) return '';
      
      const width = this.pastAttempts.length - 1;
      let path = 'M0 ' + (100 - this.pastAttempts[0].matchPercentage);
      
      // Add points for the top line
      for (let i = 1; i < this.pastAttempts.length; i++) {
        const x = i;
        const y = 100 - this.pastAttempts[i].matchPercentage;
        path += ` L${x} ${y}`;
      }
      
      // Complete the path to create the area
      path += ` L${width} 100 L0 100 Z`;
      
      return path;
    },
    
    getChartLinePoints() {
      if (!this.pastAttempts || this.pastAttempts.length < 2) return '';
      
      return this.pastAttempts.map((attempt, index) => 
        `${index}, ${100 - attempt.matchPercentage}`
      ).join(' ');
    },
    
    // Styling and classification methods
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
    
    // Tooltip methods
    showTooltip(index) {
      this.tooltipIndex = index;
    },
    
    hideTooltip() {
      this.tooltipIndex = null;
    },
    
    // Date and review schedule methods
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
    
    formatShortDate(dateString) {
      if (!dateString) return '';
      
      const date = typeof dateString === 'object' && dateString.toDate ? 
        dateString.toDate() : new Date(dateString);
      
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      }).format(date);
    },
    
    formatReviewDate(dateString) {
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
    },
    
    formatInterval(interval) {
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
    },
    
    getIntervalLabel(dateString) {
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
    },
    
    isPastDate(timestamp) {
      if (!timestamp) return false;
      
      const date = new Date(timestamp);
      const now = new Date();
      
      // Check if the date is in the past
      return date < now;
    },
    
    isCurrentDate(timestamp) {
      if (!timestamp) return false;
      
      const date = new Date(timestamp);
      const now = new Date();
      
      // Check if the date is today
      return date.toDateString() === now.toDateString();
    },
    
    getEventLabel(date) {
      if (this.isPastDate(date)) {
        return 'Completed';
      }
      
      if (this.isCurrentDate(date)) {
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
    },
    
    // Schedule card methods
    getScheduleCardClass(date, index) {
      if (this.isPastDate(date)) return 'past-review';
      if (this.isCurrentDate(date)) return 'current-review';
      if (index === 0) return 'next-review';
      return '';
    },
    
    getScheduleTagClass(date) {
      if (this.isPastDate(date)) return 'tag-past';
      if (this.isCurrentDate(date)) {
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
    },
    
    getScheduleTagText(date) {
      if (this.isPastDate(date)) return 'Completed';
      if (this.isCurrentDate(date)) {
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
      return this.getReviewTypeShortLabel(date);
    },
    
    getReviewTypeShortLabel(date) {
      const reviewDate = new Date(date);
      const now = new Date();
      const diffTime = reviewDate - now;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      if (diffDays < 7) return 'Week 1';
      if (diffDays < 14) return 'Week 2';
      if (diffDays < 30) return 'Month 1';
      if (diffDays < 90) return 'Month 2-3';
      return 'Long-term';
    },
    
    getScheduleNote(date) {
      if (this.isPastDate(date)) return 'This review has been completed.';
      if (this.isCurrentDate(date)) return 'This review is due today. Complete it to boost retention.';
      
      const reviewDate = new Date(date);
      const now = new Date();
      const diffTime = reviewDate - now;
      const diffHours = diffTime / (1000 * 60 * 60);
      
      if (diffHours < 2) return 'Critical time for new memory formation.';
      if (diffHours < 8) return 'Reinforces memory before sleep consolidation.';
      if (diffHours < 24) return 'Strengthens neural connections while still fresh.';
      if (diffHours < 24 * 7) return 'Prevents forgetting during critical first week.';
      return 'Moves knowledge to long-term memory.';      
    },
    
    addToCalendar() {
      this.$emit('add-to-calendar');
    }
  }
};
</script>

<style scoped>
.history-view {
  margin-bottom: var(--spacing-4);
}

.history-view-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
}

.history-view-header h5 {
  margin-bottom: 0;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-xl);
  color: var(--neutral-900);
}

.history-view-stats {
  display: flex;
  gap: var(--spacing-4);
  margin-top: var(--spacing-2);
}

.stats-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-3) var(--spacing-4);
  min-width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--neutral-200);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stats-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-1);
}

.stats-label {
  font-size: var(--font-size-xs);
  color: var(--neutral-600);
  text-align: center;
}

.attempts-card .stats-value {
  color: var(--primary-color);
}

.streak-card .stats-value {
  font-size: 24px;
}

.streak-card.improving .stats-value {
  color: #10b981;
}

.streak-card.decreasing .stats-value {
  color: #ef4444;
}

.streak-card.stable .stats-value {
  color: #f59e0b;
}

.score-card .stats-value {
  color: #8b5cf6;
}

.insights-banner {
  background: linear-gradient(to right, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05));
  border-left: 3px solid var(--primary-color);
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-4);
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.insight-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background-color: rgba(99, 102, 241, 0.1);
  color: var(--primary-color);
}

.insight-text {
  font-size: var(--font-size-sm);
  color: var(--neutral-700);
  line-height: 1.5;
}

.performance-history {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  box-shadow: var(--shadow-md);
  margin-bottom: var(--spacing-6);
}

.modern-chart-container {
  margin-bottom: var(--spacing-6);
}

.chart-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
}

.chart-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-800);
}

.chart-legend {
  display: flex;
  gap: var(--spacing-3);
  flex-wrap: wrap;
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

.modern-chart {
  position: relative;
  height: 280px;
  display: flex;
  margin-bottom: var(--spacing-3);
  border-bottom: 1px solid var(--neutral-200);
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

.data-point.average {
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

/* Enhanced tooltip styling */
.enhanced-tooltip {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border-radius: var(--radius-md);
  padding: 0;
  box-shadow: var(--shadow-lg);
  min-width: 180px;
  border: 1px solid var(--neutral-200);
  overflow: hidden;
  z-index: 100;
}

.tooltip-header {
  padding: var(--spacing-2) var(--spacing-3);
  background-color: var(--neutral-50);
  border-bottom: 1px solid var(--neutral-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tooltip-score-badge {
  font-weight: var(--font-weight-semibold);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  color: white;
}

.tooltip-score-badge.excellent {
  background-color: #10b981;
}

.tooltip-score-badge.good {
  background-color: #06b6d4;
}

.tooltip-score-badge.average {
  background-color: #f59e0b;
}

.tooltip-score-badge.poor {
  background-color: #ef4444;
}

.tooltip-date {
  font-size: var(--font-size-xs);
  color: var(--neutral-600);
}

.tooltip-details {
  padding: var(--spacing-2) var(--spacing-3);
}

.tooltip-detail-item {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-xs);
  margin-bottom: 4px;
}

.tooltip-detail-item:last-child {
  margin-bottom: 0;
}

.detail-label {
  color: var(--neutral-600);
}

.detail-value {
  font-weight: var(--font-weight-medium);
  color: var(--neutral-800);
}

.detail-value.increase-large {
  color: #10b981;
}

.detail-value.increase-small {
  color: #14b8a6;
}

.detail-value.decrease-large {
  color: #ef4444;
}

.detail-value.decrease-small {
  color: #f97316;
}

.chart-x-axis {
  height: 30px;
  position: relative;
  display: flex;
  justify-content: space-between;
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

.section-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
}

.section-header h5 {
  margin-bottom: 0;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-lg);
  color: var(--neutral-800);
}

.schedule-actions {
  display: flex;
  gap: var(--spacing-2);
}

.btn-sm {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: 6px 12px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  background-color: white;
  color: var(--neutral-700);
  border: 1px solid var(--neutral-300);
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-sm:hover {
  background-color: var(--neutral-100);
  color: var(--neutral-900);
  box-shadow: var(--shadow-sm);
}

.btn-sm svg {
  width: 16px;
  height: 16px;
}

.modern-schedule-section {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  box-shadow: var(--shadow-md);
}

.schedule-cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-6);
}

.schedule-card-modern {
  position: relative;
  border-radius: var(--radius-lg);
  background-color: white;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  border: 1px solid var(--neutral-200);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.schedule-card-modern:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.schedule-card-tag {
  padding: var(--spacing-1) var(--spacing-2);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: white;
  text-align: center;
}

.schedule-card-tag.tag-past {
  background-color: var(--neutral-500);
}

.schedule-card-tag.tag-current {
  background-color: #10b981;
}

.schedule-card-tag.tag-due-now {
  background-color: #dc2626;
  animation: pulse-background 1.5s infinite;
}

@keyframes pulse-background {
  0% { background-color: #dc2626; }
  50% { background-color: #ef4444; }
  100% { background-color: #dc2626; }
}

.schedule-card-tag.tag-immediate {
  background-color: #ef4444;
}

.schedule-card-tag.tag-today {
  background-color: #f59e0b;
}

.schedule-card-tag.tag-tomorrow {
  background-color: #06b6d4;
}

.schedule-card-tag.tag-future {
  background-color: var(--primary-color);
}

.schedule-card-content {
  padding: var(--spacing-3);
}

.schedule-card-time {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-1);
  color: var(--neutral-800);
}

.schedule-card-interval {
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
  margin-bottom: var(--spacing-2);
}

.schedule-card-note {
  font-size: var(--font-size-xs);
  color: var(--neutral-700);
  line-height: 1.5;
}

.schedule-card-check {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  border-radius: var(--radius-full);
  background-color: #10b981;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
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

.no-history-card {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  text-align: center;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--neutral-200);
}

.no-history-icon {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-full);
  background-color: var(--neutral-100);
  color: var(--neutral-500);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-4);
}

.no-history-card p {
  margin-bottom: var(--spacing-2);
  color: var(--neutral-700);
  font-size: var(--font-size-md);
}

.no-history-subtitle {
  color: var(--neutral-600) !important;
  font-size: var(--font-size-sm) !important;
}

@media (max-width: 768px) {
  .history-view-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .history-view-stats {
    margin-top: var(--spacing-3);
    width: 100%;
    justify-content: space-between;
  }

  .stats-card {
    flex: 1;
    min-width: 0;
  }

  .chart-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .chart-legend {
    margin-top: var(--spacing-2);
    flex-wrap: wrap;
  }

  .schedule-cards-container {
    grid-template-columns: 1fr;
  }
}
</style>
