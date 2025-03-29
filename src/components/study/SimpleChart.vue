<template>
  <div class="simple-chart-container">
    <div class="chart-header">
      <div class="chart-title">{{ title }}</div>
      <div v-if="showLegend" class="chart-legend">
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
    
    <!-- Empty State -->
    <div v-if="attempts.length === 0" class="chart-empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
        <line x1="7" y1="2" x2="7" y2="22"></line>
        <line x1="17" y1="2" x2="17" y2="22"></line>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <line x1="2" y1="7" x2="7" y2="7"></line>
        <line x1="2" y1="17" x2="7" y2="17"></line>
        <line x1="17" y1="17" x2="22" y2="17"></line>
        <line x1="17" y1="7" x2="22" y2="7"></line>
      </svg>
      <p>No performance data available yet</p>
      <p class="empty-subtitle">Complete your first attempt to see results</p>
    </div>
    
    <!-- Chart Visualization -->
    <div v-else class="chart-visualization">
      <!-- Y-Axis -->
      <div class="chart-y-axis">
        <div class="y-axis-ticks">
          <div v-for="tick in yAxisTicks" :key="`y-tick-${tick}`" class="y-axis-tick">
            <span>{{ tick }}%</span>
          </div>
        </div>
      </div>
      
      <!-- Chart Area -->
      <div class="chart-area">
        <!-- Threshold Lines -->
        <div v-for="threshold in thresholds" :key="`threshold-${threshold.value}`" 
             class="threshold-line" 
             :class="threshold.class" 
             :style="{ bottom: `${threshold.value}%` }">
          <span class="threshold-label">{{ threshold.label }}</span>
        </div>
        
        <!-- Chart Type: Bar -->
        <div v-if="chartType === 'bar'" class="bar-chart">
          <div 
            v-for="(attempt, index) in attempts" 
            :key="'bar-' + index" 
            class="chart-bar"
            :class="getScoreClass(attempt.matchPercentage)"
            :style="{
              height: `${attempt.matchPercentage}%`,
              left: `${getBarPosition(index)}%`,
              width: `${getBarWidth()}%`
            }"
            @mouseenter="activeTooltip = index"
            @mouseleave="activeTooltip = null"
          >
            <div v-if="activeTooltip === index" class="bar-tooltip">
              <div class="tooltip-score" :class="getScoreClass(attempt.matchPercentage)">
                {{ attempt.matchPercentage }}%
              </div>
              <div class="tooltip-date">{{ formatDate(attempt.timestamp, true) }}</div>
            </div>
          </div>
        </div>
        
        <!-- Chart Type: Line -->
        <div v-else class="line-chart">
          <!-- SVG Line Chart -->
          <svg class="chart-svg" :viewBox="`0 0 ${attempts.length - 1} 100`" preserveAspectRatio="none">
            <!-- Area Fill -->
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="rgba(99, 102, 241, 0.5)" />
                <stop offset="100%" stop-color="rgba(99, 102, 241, 0.05)" />
              </linearGradient>
            </defs>
            
            <path 
              :d="getAreaPath()" 
              fill="url(#areaGradient)"
              stroke="none"
            />
            
            <!-- Line -->
            <polyline 
              :points="getLinePoints()" 
              fill="none" 
              stroke="var(--primary-color)"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          
          <!-- Data Points -->
          <div 
            v-for="(attempt, index) in attempts" 
            :key="'point-' + index" 
            class="data-point"
            :class="getScoreClass(attempt.matchPercentage)"
            :style="{
              bottom: `${attempt.matchPercentage}%`,
              left: `${(index / (attempts.length - 1)) * 100}%`
            }"
            @mouseenter="activeTooltip = index"
            @mouseleave="activeTooltip = null"
          >
            <div v-if="activeTooltip === index" class="point-tooltip">
              <div class="tooltip-score" :class="getScoreClass(attempt.matchPercentage)">
                {{ attempt.matchPercentage }}%
              </div>
              <div class="tooltip-date">{{ formatDate(attempt.timestamp, true) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- X-Axis Labels -->
    <div v-if="attempts.length > 0" class="chart-x-axis">
      <div 
        v-for="(attempt, index) in attempts" 
        :key="'label-' + index" 
        class="x-axis-label"
        :style="{
          left: `${(index / (attempts.length - 1)) * 100}%`
        }"
      >
        {{ formatDate(attempt.timestamp) }}
      </div>
    </div>
    
    <!-- Chart Controls -->
    <div v-if="attempts.length > 0" class="chart-controls">
      <button 
        class="chart-type-btn" 
        :class="{ 'active': chartType === 'line' }" 
        @click="chartType = 'line'"
        title="Line Chart View"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      </button>
      <button 
        class="chart-type-btn" 
        :class="{ 'active': chartType === 'bar' }" 
        @click="chartType = 'bar'"
        title="Bar Chart View"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
          <line x1="3" y1="20" x2="21" y2="20"></line>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SimpleChart',
  
  props: {
    attempts: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: 'Performance Chart'
    },
    showLegend: {
      type: Boolean,
      default: true
    }
  },
  
  data() {
    return {
      chartType: 'line',
      activeTooltip: null,
      yAxisTicks: [0, 25, 50, 75, 100],
      thresholds: [
        { value: 80, label: 'Excellent (80%)', class: 'excellent-threshold' },
        { value: 50, label: 'Average (50%)', class: 'average-threshold' }
      ]
    };
  },
  
  methods: {
    getScoreClass(score) {
      if (score >= 80) return 'excellent';
      if (score >= 70) return 'good';
      if (score >= 50) return 'average';
      return 'poor';
    },
    
    formatDate(dateString, showTime = false) {
      if (!dateString) return '';
      
      const date = typeof dateString === 'object' && dateString.toDate ? 
        dateString.toDate() : new Date(dateString);
      
      if (showTime) {
        return new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        }).format(date);
      }
      
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      }).format(date);
    },
    
    // Line Chart Methods
    getLinePoints() {
      if (this.attempts.length < 2) return '';
      
      return this.attempts.map((attempt, index) => 
        `${index}, ${100 - attempt.matchPercentage}`
      ).join(' ');
    },
    
    getAreaPath() {
      if (this.attempts.length < 2) return '';
      
      const points = this.attempts.map((attempt, index) => 
        `${index},${100 - attempt.matchPercentage}`
      );
      
      // Close the path to create a filled area
      const width = this.attempts.length - 1;
      const path = `M0,${100 - this.attempts[0].matchPercentage} ` +
                   points.slice(1).map(p => `L${p}`).join(' ') +
                   ` L${width},100 L0,100 Z`;
      
      return path;
    },
    
    // Bar Chart Methods
    getBarPosition(index) {
      if (this.attempts.length <= 1) return 45;
      
      const totalWidth = 90; // Use 90% of the available width
      const barSpacing = totalWidth / (this.attempts.length);
      const startOffset = 5; // Start 5% from the left edge
      
      return startOffset + (index * barSpacing);
    },
    
    getBarWidth() {
      if (this.attempts.length <= 1) return 10;
      if (this.attempts.length <= 3) return 15;
      if (this.attempts.length <= 5) return 12;
      if (this.attempts.length <= 10) return 8;
      return 5;
    }
  }
};
</script>

<style scoped>
.simple-chart-container {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-6);
  position: relative;
}

.chart-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
  gap: var(--spacing-3);
}

.chart-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
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

/* Empty State */
.chart-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-6);
  color: var(--neutral-500);
  text-align: center;
  background-color: var(--neutral-50);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-4);
}

.chart-empty-state svg {
  margin-bottom: var(--spacing-3);
  color: var(--neutral-400);
}

.chart-empty-state p {
  margin-bottom: var(--spacing-2);
  font-size: var(--font-size-sm);
}

.empty-subtitle {
  font-size: var(--font-size-xs) !important;
  color: var(--neutral-600);
}

/* Chart Visualization */
.chart-visualization {
  display: flex;
  height: 250px;
  margin-bottom: var(--spacing-4);
}

.chart-y-axis {
  width: 40px;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px dashed var(--neutral-200);
  padding-right: var(--spacing-2);
}

.y-axis-ticks {
  height: 100%;
  position: relative;
}

.y-axis-tick {
  position: absolute;
  right: 0;
  font-size: var(--font-size-xs);
  color: var(--neutral-500);
  transform: translateY(-50%);
}

.y-axis-tick:nth-child(1) {
  bottom: 0%;
}

.y-axis-tick:nth-child(2) {
  bottom: 25%;
}

.y-axis-tick:nth-child(3) {
  bottom: 50%;
}

.y-axis-tick:nth-child(4) {
  bottom: 75%;
}

.y-axis-tick:nth-child(5) {
  bottom: 100%;
}

.chart-area {
  flex: 1;
  position: relative;
  height: 100%;
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

/* Bar Chart */
.bar-chart {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.chart-bar {
  position: absolute;
  bottom: 0;
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  cursor: pointer;
  transition: transform 0.2s ease, filter 0.2s ease;
}

.chart-bar:hover {
  transform: scaleY(1.03);
  filter: brightness(1.1);
}

.chart-bar.excellent {
  background-color: #10b981;
}

.chart-bar.good {
  background-color: #06b6d4;
}

.chart-bar.average {
  background-color: #f59e0b;
}

.chart-bar.poor {
  background-color: #ef4444;
}

.bar-tooltip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  white-space: nowrap;
  min-width: 120px;
  z-index: 10;
  border: 1px solid var(--neutral-200);
}

/* Line Chart */
.line-chart {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.chart-svg {
  position: absolute;
  width: 100%;
  height: 100%;
}

.data-point {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  transform: translate(-50%, 50%);
  cursor: pointer;
  transition: transform 0.2s ease;
  box-shadow: 0 0 0 2px white;
  z-index: 2;
}

.data-point:hover {
  transform: translate(-50%, 50%) scale(1.3);
}

.data-point.excellent {
  background-color: #10b981;
}

.data-point.good {
  background-color: #06b6d4;
}

.data-point.average {
  background-color: #f59e0b;
}

.data-point.poor {
  background-color: #ef4444;
}

.point-tooltip {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  white-space: nowrap;
  min-width: 120px;
  z-index: 10;
  border: 1px solid var(--neutral-200);
}

/* Tooltip Common Styles */
.tooltip-score {
  padding: var(--spacing-1) var(--spacing-2);
  font-weight: var(--font-weight-medium);
  color: white;
  font-size: var(--font-size-xs);
  text-align: center;
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
  padding: var(--spacing-1) var(--spacing-2);
  font-size: var(--font-size-xs);
  color: var(--neutral-600);
  text-align: center;
}

/* X-Axis */
.chart-x-axis {
  height: 30px;
  position: relative;
  margin-left: 40px;
}

.x-axis-label {
  position: absolute;
  transform: translateX(-50%);
  font-size: var(--font-size-xs);
  color: var(--neutral-500);
  text-align: center;
  white-space: nowrap;
}

/* Chart Controls */
.chart-controls {
  position: absolute;
  top: var(--spacing-4);
  right: var(--spacing-4);
  display: flex;
  background-color: var(--neutral-100);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.chart-type-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background-color: transparent;
  color: var(--neutral-600);
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.chart-type-btn:hover {
  background-color: var(--neutral-200);
  color: var(--neutral-800);
}

.chart-type-btn.active {
  background-color: var(--primary-color);
  color: white;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .chart-legend {
    margin-top: var(--spacing-2);
  }
  
  .chart-controls {
    top: var(--spacing-4);
    right: var(--spacing-4);
  }
}

@media (max-width: 480px) {
  .chart-legend {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .legend-item {
    margin-bottom: 4px;
  }
}
</style>
