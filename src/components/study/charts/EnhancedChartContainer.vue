<template>
  <div class="enhanced-chart-container">
    <div class="chart-header">
      <div class="chart-title">{{ title }}</div>
      <div class="chart-controls">
        <div class="chart-type-selector">
          <button 
            class="chart-type-btn" 
            :class="{ 'active': chartType === 'line' }" 
            @click="setChartType('line')"
            title="Line Chart View"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </button>
          <button 
            class="chart-type-btn" 
            :class="{ 'active': chartType === 'bar' }" 
            @click="setChartType('bar')"
            title="Bar Chart View"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
              <line x1="3" y1="20" x2="21" y2="20"></line>
            </svg>
          </button>
        </div>
        <div class="time-range-selector">
          <button 
            v-for="(label, range) in timeRanges" 
            :key="range"
            class="time-range-btn" 
            :class="{ 'active': selectedTimeRange === range }" 
            @click="setTimeRange(range)"
          >
            {{ label }}
          </button>
        </div>
      </div>
    </div>
    
    <div class="chart-content">
      <!-- Chart Loading State -->
      <div v-if="loading" class="chart-loading-state">
        <div class="spinner"></div>
        <span>Loading chart data...</span>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="filteredData.length === 0" class="chart-empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="empty-icon">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
          <line x1="7" y1="2" x2="7" y2="22"></line>
          <line x1="17" y1="2" x2="17" y2="22"></line>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <line x1="2" y1="7" x2="7" y2="7"></line>
          <line x1="2" y1="17" x2="7" y2="17"></line>
          <line x1="17" y1="17" x2="22" y2="17"></line>
          <line x1="17" y1="7" x2="22" y2="7"></line>
        </svg>
        <p>No data available for this time period</p>
        <button class="btn-empty-action" @click="setTimeRange('all')">View All Data</button>
      </div>
      
      <!-- Line Chart View -->
      <div v-else-if="chartType === 'line'" class="line-chart-view">
        <div class="chart-y-axis">
          <div class="y-axis-ticks">
            <div v-for="tick in yAxisTicks" :key="`y-tick-${tick}`" class="y-axis-tick">
              <span>{{ tick }}%</span>
            </div>
          </div>
        </div>
        
        <div class="chart-main-area">
          <!-- Threshold Lines -->
          <div v-for="threshold in thresholds" :key="`threshold-${threshold.value}`" 
               class="threshold-line" 
               :class="threshold.class" 
               :style="{ bottom: `${threshold.value}%` }">
            <span class="threshold-label">{{ threshold.label }}</span>
          </div>
          
          <!-- Line Chart SVG -->
          <svg class="line-chart-svg" :viewBox="`0 0 ${viewBoxWidth} 100`" preserveAspectRatio="none">
            <!-- Area Gradient Fill -->
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="rgba(99, 102, 241, 0.6)" />
                <stop offset="100%" stop-color="rgba(99, 102, 241, 0.05)" />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#4f46e5" />
                <stop offset="100%" stop-color="#8b5cf6" />
              </linearGradient>
            </defs>
            
            <!-- Area Fill -->
            <path 
              :d="areaPath" 
              fill="url(#areaGradient)"
              stroke="none"
            />
            
            <!-- Line -->
            <path 
              :d="linePath" 
              fill="none" 
              stroke="url(#lineGradient)" 
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            
            <!-- Smoothed Animation Line for Latest Point -->
            <path 
              v-if="filteredData.length > 1" 
              :d="animationPath" 
              fill="none" 
              stroke="#4f46e5" 
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-dasharray="5,5"
              class="animation-path"
            />
          </svg>
          
          <!-- Data Points -->
          <div 
            v-for="(point, index) in filteredData" 
            :key="`point-${index}`" 
            class="data-point" 
            :class="getScoreClass(point.matchPercentage)"
            :style="{ 
              left: `${getXPosition(index)}%`, 
              bottom: `${point.matchPercentage}%` 
            }"
            @mouseenter="activePointIndex = index"
            @mouseleave="activePointIndex = null"
          >
            <!-- Pulse ring for latest point -->
            <svg v-if="index === 0" class="pulse-ring" width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="15" fill="none" stroke="rgba(99, 102, 241, 0.3)" stroke-width="2">
                <animate attributeName="r" from="15" to="20" dur="1.5s" begin="0s" repeatCount="indefinite"/>
                <animate attributeName="opacity" from="1" to="0" dur="1.5s" begin="0s" repeatCount="indefinite"/>
              </circle>
            </svg>
            
            <!-- Enhanced Tooltip -->
            <div v-if="activePointIndex === index" class="enhanced-tooltip" :class="{ 'tooltip-left': index >= filteredData.length / 2 }">
              <div class="tooltip-header">
                <div class="tooltip-score" :class="getScoreClass(point.matchPercentage)">
                  {{ point.matchPercentage }}%
                </div>
                <div class="tooltip-date">{{ formatDateWithTime(point.timestamp) }}</div>
              </div>
              <div class="tooltip-body">
                <div class="tooltip-row" v-if="index < filteredData.length - 1">
                  <span class="tooltip-label">Change:</span>
                  <span class="tooltip-value" :class="getChangeClass(point.matchPercentage, filteredData[index + 1].matchPercentage)">
                    {{ calculateChange(point.matchPercentage, filteredData[index + 1].matchPercentage) }}
                  </span>
                </div>
                <div class="tooltip-row" v-if="point.calculatedInterval">
                  <span class="tooltip-label">Interval:</span>
                  <span class="tooltip-value">{{ formatInterval(point.calculatedInterval) }}</span>
                </div>
                <div class="tooltip-row" v-if="point.studyDuration">
                  <span class="tooltip-label">Duration:</span>
                  <span class="tooltip-value">{{ formatDuration(point.studyDuration) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Bar Chart View -->
      <div v-else-if="chartType === 'bar'" class="bar-chart-view">
        <div class="chart-y-axis">
          <div class="y-axis-ticks">
            <div v-for="tick in yAxisTicks" :key="`y-tick-${tick}`" class="y-axis-tick">
              <span>{{ tick }}%</span>
            </div>
          </div>
        </div>
        
        <div class="chart-main-area">
          <!-- Threshold Lines -->
          <div v-for="threshold in thresholds" :key="`threshold-${threshold.value}`" 
               class="threshold-line" 
               :class="threshold.class" 
               :style="{ bottom: `${threshold.value}%` }">
            <span class="threshold-label">{{ threshold.label }}</span>
          </div>
          
          <!-- Bars -->
          <div class="bar-container">
            <div 
              v-for="(point, index) in filteredData" 
              :key="`bar-${index}`" 
              class="data-bar" 
              :class="getScoreClass(point.matchPercentage)"
              :style="{ 
                left: `${getBarXPosition(index)}%`, 
                height: `${point.matchPercentage}%`,
                width: `${getBarWidth()}%`
              }"
              @mouseenter="activePointIndex = index"
              @mouseleave="activePointIndex = null"
            >
              <div v-if="activePointIndex === index" class="bar-value">{{ point.matchPercentage }}%</div>
              
              <!-- Enhanced Tooltip for Bars -->
              <div v-if="activePointIndex === index" class="enhanced-tooltip" :class="{ 'tooltip-left': index >= filteredData.length / 2 }">
                <div class="tooltip-header">
                  <div class="tooltip-score" :class="getScoreClass(point.matchPercentage)">
                    {{ point.matchPercentage }}%
                  </div>
                  <div class="tooltip-date">{{ formatDateWithTime(point.timestamp) }}</div>
                </div>
                <div class="tooltip-body">
                  <div class="tooltip-row" v-if="index < filteredData.length - 1">
                    <span class="tooltip-label">Change:</span>
                    <span class="tooltip-value" :class="getChangeClass(point.matchPercentage, filteredData[index + 1].matchPercentage)">
                      {{ calculateChange(point.matchPercentage, filteredData[index + 1].matchPercentage) }}
                    </span>
                  </div>
                  <div class="tooltip-row" v-if="point.calculatedInterval">
                    <span class="tooltip-label">Interval:</span>
                    <span class="tooltip-value">{{ formatInterval(point.calculatedInterval) }}</span>
                  </div>
                  <div class="tooltip-row" v-if="point.studyDuration">
                    <span class="tooltip-label">Duration:</span>
                    <span class="tooltip-value">{{ formatDuration(point.studyDuration) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Chart Legend -->
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
      
      <!-- X-Axis Labels -->
      <div class="chart-x-axis">
        <div 
          v-for="(point, index) in filteredData" 
          :key="`x-label-${index}`" 
          class="x-axis-label"
          :style="{ 
            left: chartType === 'line' ? `${getXPosition(index)}%` : `${getBarXPosition(index)}%` 
          }"
        >
          {{ formatDate(point.timestamp) }}
        </div>
      </div>
    </div>
    
    <!-- Performance Insight -->
    <div v-if="insight && filteredData.length > 0" class="chart-insights">
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
      <div class="insight-content">{{ insight }}</div>
    </div>
    
    <!-- Summary Statistics -->
    <div v-if="filteredData.length > 0" class="summary-stats">
      <div class="stat-card">
        <div class="stat-value">{{ filteredData.length }}</div>
        <div class="stat-label">Attempts</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ averageScore }}%</div>
        <div class="stat-label">Average</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ bestScore }}%</div>
        <div class="stat-label">Best</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ calculateImprovement }}</div>
        <div class="stat-label">Improvement</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EnhancedChartContainer',
  
  props: {
    title: {
      type: String,
      default: 'Performance Chart'
    },
    data: {
      type: Array,
      required: true
    },
    insight: {
      type: String,
      default: ''
    },
    isImproving: {
      type: Boolean,
      default: false
    },
    isDecreasing: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      chartType: 'line',
      selectedTimeRange: 'all',
      activePointIndex: null,
      yAxisTicks: [0, 25, 50, 75, 100],
      thresholds: [
        { value: 80, label: 'Excellent (80%)', class: 'excellent-threshold' },
        { value: 50, label: 'Average (50%)', class: 'average-threshold' }
      ],
      timeRanges: {
        'week': 'Week',
        'month': 'Month',
        'quarter': 'Quarter',
        'all': 'All'
      }
    };
  },
  
  computed: {
    filteredData() {
      if (!this.data || this.data.length === 0) return [];
      
      // Sort data by timestamp in descending order (newest first)
      const sortedData = [...this.data].sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        return dateB - dateA;
      });
      
      if (this.selectedTimeRange === 'all') {
        return sortedData;
      }
      
      const now = new Date();
      let cutoffDate = new Date();
      
      switch (this.selectedTimeRange) {
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
      }
      
      return sortedData.filter(item => {
        const itemDate = new Date(item.timestamp);
        return itemDate >= cutoffDate;
      });
    },
    
    viewBoxWidth() {
      return Math.max(1, this.filteredData.length - 1);
    },
    
    linePath() {
      if (this.filteredData.length < 2) {
        // For a single point, draw a small horizontal line
        if (this.filteredData.length === 1) {
          const y = 100 - this.filteredData[0].matchPercentage;
          return `M0,${y} L1,${y}`;
        }
        return '';
      }
      
      let path = '';
      const dataLength = this.filteredData.length;
      
      // Start at the first point
      const firstY = 100 - this.filteredData[0].matchPercentage;
      path = `M0,${firstY}`;
      
      // Add each point with a smooth curve
      for (let i = 1; i < dataLength; i++) {
        const x = i;
        const y = 100 - this.filteredData[i].matchPercentage;
        
        // Use a curved line for the path
        const prevX = i - 1;
        const controlPointX1 = prevX + 0.5;
        const controlPointX2 = x - 0.5;
        const prevY = 100 - this.filteredData[i-1].matchPercentage;
        
        path += ` C${controlPointX1},${prevY} ${controlPointX2},${y} ${x},${y}`;
      }
      
      return path;
    },
    
    areaPath() {
      if (this.filteredData.length < 2) {
        // For a single point, draw a small rectangle
        if (this.filteredData.length === 1) {
          const y = 100 - this.filteredData[0].matchPercentage;
          return `M0,${y} L1,${y} L1,100 L0,100 Z`;
        }
        return '';
      }
      
      // Clone the line path and add the area closing
      const dataLength = this.filteredData.length;
      let path = this.linePath;
      
      // Add lines to close the area
      path += ` L${dataLength - 1},100 L0,100 Z`;
      
      return path;
    },
    
    animationPath() {
      if (this.filteredData.length < 2) return '';
      
      // Create a path for the animated dashed line that goes from the second to the first point
      const x1 = 1;
      const y1 = 100 - this.filteredData[1].matchPercentage;
      const x2 = 0;
      const y2 = 100 - this.filteredData[0].matchPercentage;
      
      return `M${x1},${y1} L${x2},${y2}`;
    },
    
    averageScore() {
      if (this.filteredData.length === 0) return 0;
      
      const sum = this.filteredData.reduce((acc, point) => acc + point.matchPercentage, 0);
      return Math.round(sum / this.filteredData.length);
    },
    
    bestScore() {
      if (this.filteredData.length === 0) return 0;
      
      return Math.max(...this.filteredData.map(point => point.matchPercentage));
    },
    
    calculateImprovement() {
      if (this.filteredData.length < 2) return 'N/A';
      
      // Compare first (newest) and last (oldest) scores in our filtered data
      const newestScore = this.filteredData[0].matchPercentage;
      const oldestScore = this.filteredData[this.filteredData.length - 1].matchPercentage;
      
      const improvement = newestScore - oldestScore;
      
      if (improvement > 0) {
        return `+${improvement.toFixed(1)}%`;
      } else if (improvement < 0) {
        return `${improvement.toFixed(1)}%`;
      } else {
        return '0%';
      }
    },
    
    getInsightIconClass() {
      if (this.isImproving) return 'insight-positive';
      if (this.isDecreasing) return 'insight-negative';
      return 'insight-neutral';
    }
  },
  
  methods: {
    setChartType(type) {
      this.chartType = type;
    },
    
    setTimeRange(range) {
      this.selectedTimeRange = range;
    },
    
    getXPosition(index) {
      if (this.filteredData.length <= 1) return 50;
      return (this.filteredData.length - 1 - index) * (100 / (this.filteredData.length - 1));
    },
    
    getBarXPosition(index) {
      if (this.filteredData.length <= 1) return 50 - (this.getBarWidth() / 2);
      
      const totalWidth = 90; // Use 90% of the available width
      const barSpacing = totalWidth / (this.filteredData.length);
      const startOffset = 5; // Start 5% from the left edge
      
      return startOffset + (this.filteredData.length - 1 - index) * barSpacing;
    },
    
    getBarWidth() {
      if (this.filteredData.length <= 1) return 20;
      if (this.filteredData.length <= 3) return 15;
      if (this.filteredData.length <= 5) return 12;
      if (this.filteredData.length <= 10) return 8;
      return 5;
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
    
    formatDate(dateString) {
      if (!dateString) return '';
      
      const date = typeof dateString === 'object' && dateString.toDate ? 
        dateString.toDate() : new Date(dateString);
      
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      }).format(date);
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
    }
  }
};
</script>

<style scoped>
.enhanced-chart-container {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-md);
  margin-bottom: var(--spacing-6);
}

.chart-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
  gap: var(--spacing-4);
}

.chart-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-900);
}

.chart-controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-4);
  align-items: center;
}

.chart-type-selector {
  display: flex;
  background-color: var(--neutral-100);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.chart-type-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2);
  width: 40px;
  height: 36px;
  border: none;
  background-color: transparent;
  color: var(--neutral-600);
  cursor: pointer;
  transition: all 0.2s ease;
}

.chart-type-btn:hover {
  background-color: var(--neutral-200);
  color: var(--neutral-800);
}

.chart-type-btn.active {
  background-color: var(--primary-color);
  color: white;
}

.time-range-selector {
  display: flex;
  background-color: var(--neutral-100);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.time-range-btn {
  padding: 8px 12px;
  border: none;
  background-color: transparent;
  color: var(--neutral-600);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.time-range-btn:hover {
  background-color: var(--neutral-200);
  color: var(--neutral-800);
}

.time-range-btn.active {
  background-color: var(--primary-color);
  color: white;
}

/* Chart Content */
.chart-content {
  position: relative;
  margin-bottom: var(--spacing-6);
  height: 320px;
}

.chart-loading-state, .chart-empty-state {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(243, 244, 246, 0.1);
  border-radius: var(--radius-md);
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(99, 102, 241, 0.3);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spinner 1s linear infinite;
  margin-bottom: var(--spacing-3);
}

@keyframes spinner {
  to { transform: rotate(360deg); }
}

.chart-empty-state {
  background-color: var(--neutral-50);
  text-align: center;
  padding: var(--spacing-6);
}

.empty-icon {
  color: var(--neutral-400);
  margin-bottom: var(--spacing-3);
}

.chart-empty-state p {
  color: var(--neutral-600);
  margin-bottom: var(--spacing-3);
}

.btn-empty-action {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-empty-action:hover {
  background-color: var(--primary-dark);
  transform: translateY(-1px);
}

/* Line and Bar Chart Common Styles */
.line-chart-view, .bar-chart-view {
  display: flex;
  height: 280px;
  position: relative;
}

.chart-y-axis {
  width: 40px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 var(--spacing-2) 0 0;
  border-right: 1px dashed var(--neutral-300);
}

.y-axis-ticks {
  height: 100%;
  width: 100%;
  position: relative;
}

.y-axis-tick {
  position: absolute;
  left: 0;
  width: 100%;
  text-align: right;
  padding-right: 8px;
  font-size: var(--font-size-xs);
  color: var(--neutral-500);
  transform: translateY(-50%);
}

.y-axis-tick:nth-child(1) { bottom: 0%; }
.y-axis-tick:nth-child(2) { bottom: 25%; }
.y-axis-tick:nth-child(3) { bottom: 50%; }
.y-axis-tick:nth-child(4) { bottom: 75%; }
.y-axis-tick:nth-child(5) { bottom: 100%; }

.chart-main-area {
  flex: 1;
  position: relative;
  height: 100%;
  overflow: hidden;
  border-bottom: 1px solid var(--neutral-200);
}

.threshold-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
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

/* Line Chart Specific Styles */
.line-chart-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.animation-path {
  animation: dash 1.5s infinite;
}

@keyframes dash {
  to {
    stroke-dashoffset: 20;
  }
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
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.data-point:hover {
  transform: scale(1.3);
  box-shadow: 0 0 0 5px rgba(99, 102, 241, 0.2);
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

/* Bar Chart Specific Styles */
.bar-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.data-bar {
  position: absolute;
  bottom: 0;
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  cursor: pointer;
  transition: transform 0.2s ease, filter 0.2s ease;
}

.data-bar:hover {
  transform: scaleY(1.02);
  filter: brightness(1.1);
}

.data-bar.excellent {
  background-color: #10b981;
}

.data-bar.good {
  background-color: #06b6d4;
}

.data-bar.average {
  background-color: #f59e0b;
}

.data-bar.poor {
  background-color: #ef4444;
}

.bar-value {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--neutral-800);
  color: white;
  padding: 3px 6px;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  white-space: nowrap;
}

/* Enhanced Tooltip */
.enhanced-tooltip {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  min-width: 180px;
  max-width: 220px;
  border: 1px solid var(--neutral-200);
  overflow: hidden;
  z-index: 100;
}

.tooltip-left {
  transform: translateX(-90%);
}

.tooltip-header {
  padding: var(--spacing-2) var(--spacing-3);
  background-color: var(--neutral-50);
  border-bottom: 1px solid var(--neutral-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tooltip-score {
  font-weight: var(--font-weight-semibold);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  color: white;
}

.tooltip-score.excellent {
  background-color: #10b981;
}

.tooltip-score.good {
  background-color: #06b6d4;
}

.tooltip-score.average {
  background-color: #f59e0b;
}

.tooltip-score.poor {
  background-color: #ef4444;
}

.tooltip-date {
  font-size: var(--font-size-xs);
  color: var(--neutral-600);
}

.tooltip-body {
  padding: var(--spacing-2) var(--spacing-3);
}

.tooltip-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: var(--font-size-xs);
}

.tooltip-row:last-child {
  margin-bottom: 0;
}

.tooltip-label {
  color: var(--neutral-600);
}

.tooltip-value {
  font-weight: var(--font-weight-medium);
  color: var(--neutral-800);
}

.tooltip-value.increase-large {
  color: #10b981;
  font-weight: var(--font-weight-bold);
}

.tooltip-value.increase-small {
  color: #14b8a6;
}

.tooltip-value.decrease-large {
  color: #ef4444;
  font-weight: var(--font-weight-bold);
}

.tooltip-value.decrease-small {
  color: #f97316;
}

/* Chart Legend */
.chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-4);
  margin-top: 40px;
  margin-bottom: var(--spacing-3);
  justify-content: center;
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

/* X Axis */
.chart-x-axis {
  height: 30px;
  position: relative;
}

.x-axis-label {
  position: absolute;
  transform: translateX(-50%);
  font-size: var(--font-size-xs);
  color: var(--neutral-500);
  text-align: center;
  white-space: nowrap;
}

/* Chart Insights */
.chart-insights {
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

.insight-icon.insight-positive {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.insight-icon.insight-negative {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.insight-content {
  font-size: var(--font-size-sm);
  color: var(--neutral-700);
  line-height: 1.5;
}

/* Summary Statistics */
.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--spacing-4);
}

.stat-card {
  background: linear-gradient(to right bottom, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05));
  border-radius: var(--radius-lg);
  padding: var(--spacing-3);
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid var(--neutral-100);
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.stat-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
  margin-bottom: var(--spacing-1);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
}

/* Responsive Styles */
@media (max-width: 768px) {
  .enhanced-chart-container {
    padding: var(--spacing-4);
  }
  
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .chart-controls {
    width: 100%;
    justify-content: space-between;
  }
  
  .summary-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .chart-legend {
    justify-content: flex-start;
    gap: var(--spacing-2);
  }
}

@media (max-width: 480px) {
  .chart-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-2);
  }
  
  .chart-type-selector, .time-range-selector {
    width: 100%;
  }
  
  .time-range-btn {
    flex: 1;
    text-align: center;
  }
  
  .chart-legend {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
