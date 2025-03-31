<template>
  <div class="unified-blurting-view">
    <div class="view-header">
      <h5>{{ title }}</h5>
      <div class="view-stats" v-if="matchPercentage !== null">
        <div class="match-percentage-display">
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
          <span class="percentage-label">Recall Score</span>
        </div>
        <div v-if="pastAttempts && pastAttempts.length > 0" class="trend-badge" :class="trendBadgeClass">
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
        <div class="attempt-number" v-if="attemptNumber">Attempt #{{ attemptNumber }}</div>
      </div>
    </div>

    <div class="unified-content">
      <!-- Combined split and heatmap view -->
      <div class="split-heatmap-container">
        <!-- Original text with heatmap overlay -->
        <div class="text-section">
          <div class="section-header">
            <h6>Original Text</h6>
          </div>
          <div class="text-content heatmap-content">
            <p>
              <template v-for="(item, index) in heatmapData" :key="index">
                <span 
                  class="heatmap-text" 
                  :class="getWordClass(item)"
                  :title="getWordTooltip(item)"
                >
                  {{ item.word }}
                </span>
              </template>
            </p>
          </div>
        </div>

        <!-- User's recall text -->
        <div class="text-section">
          <div class="section-header">
            <h6>Your Recall</h6>
          </div>
          <div class="text-content recall-content">
            {{ recalledText }}
          </div>
        </div>
      </div>

      <!-- Legend -->
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
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'UnifiedBlurtingView',
  props: {
    heatmapData: {
      type: Array,
      required: true
    },
    recalledText: {
      type: String,
      required: true
    },
    matchPercentage: {
      type: Number,
      default: null
    },

    pastAttempts: {
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
    attemptNumber: {
      type: Number,
      default: null
    },
    title: {
      type: String,
      default: 'Your Blurting Results'
    }
  },
  
  setup(props) {
    
    const matchPercentageClass = computed(() => {
      if (props.matchPercentage >= 80) return 'high';
      if (props.matchPercentage >= 60) return 'medium';
      if (props.matchPercentage >= 40) return 'low';
      return 'very-low';
    });
    
    const trendBadgeClass = computed(() => {
      if (props.isImproving) return 'improving';
      if (props.isDecreasing) return 'decreasing';
      return 'stable';
    });
    
    const getWordClass = (item) => {
      if (item.matched) {
        return ['heatmap-matched'];
      } else {
        return ['heatmap-unmatched'];
      }
    };
    
    const getWordTooltip = (item) => {
      return item.matched ? 'Correctly remembered' : 'Not remembered';
    };
    

    
    return {
      matchPercentageClass,
      trendBadgeClass,
      getWordClass,
      getWordTooltip
    };
  }
}
</script>

<style scoped>
.unified-blurting-view {
  margin-bottom: var(--spacing-6);
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.view-header {
  padding: var(--spacing-4) var(--spacing-6);
  border-bottom: 1px solid var(--neutral-200);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-4);
}

.view-header h5 {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-900);
}

.view-stats {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}

.match-percentage-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: var(--spacing-2);
}

.circular-chart {
  width: 50px;
  height: 50px;
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
  font-size: var(--font-size-xs);
  margin-top: var(--spacing-1);
  color: var(--neutral-600);
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

.unified-content {
  padding: var(--spacing-6);
}

.split-heatmap-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-6);
  margin-bottom: var(--spacing-4);
}

.text-section {
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-2);
}

.section-header h6 {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-800);
  margin: 0;
}



.text-content {
  flex: 1;
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  background-color: var(--neutral-50);
  overflow-y: auto;
  line-height: 1.8;
  min-height: 220px;
  max-height: 400px;
}

.heatmap-content {
  border-left: 3px solid var(--primary-color);
}

.recall-content {
  border-left: 3px solid var(--secondary-color);
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
  position: relative;
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
  position: relative;
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
  margin-bottom: var(--spacing-4);
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

.legend-color.matched {
  background-color: rgba(16, 185, 129, 0.15);
  border-bottom: 2px solid #10b981;
}

.legend-color.unmatched {
  background-color: rgba(239, 68, 68, 0.1);
  border-bottom: 2px solid #ef4444;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .view-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .view-stats {
    margin-top: var(--spacing-2);
    flex-wrap: wrap;
  }
  
  .split-heatmap-container {
    grid-template-columns: 1fr;
  }
  
  .text-content {
    max-height: 300px;
  }
}
</style>
