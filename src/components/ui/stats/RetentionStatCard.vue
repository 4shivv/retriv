<template>
  <stat-card :title="title" :type="type" :hoverable="hoverable">
    <template #icon>
      <slot name="icon"></slot>
    </template>
    
    <div class="retention-stat">
      <div class="retention-stat__value-container">
        <h3 class="retention-stat__value">{{ value }}%</h3>
        <div class="retention-trend" :class="trendClass">
          <svg v-if="trend === 'positive'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
          <svg v-else-if="trend === 'negative'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>{{ trendText }}</span>
        </div>
      </div>
      
      <div class="retention-chart">
        <div class="chart-bar-container">
          <div v-for="(value, index) in history" :key="index" 
               class="chart-bar" 
               :style="{ height: `${value}%`, left: `${index * 14}%` }"
               :class="getRetentionClass(value)">
          </div>
        </div>
      </div>
    </div>
    
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </stat-card>
</template>

<script>
import StatCard from './StatCard.vue';

export default {
  name: 'RetentionStatCard',
  components: {
    StatCard
  },
  props: {
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'success'
    },
    hoverable: {
      type: Boolean,
      default: true
    },
    value: {
      type: Number,
      required: true
    },
    trend: {
      type: String,
      default: 'neutral',
      validator: (value) => ['positive', 'negative', 'neutral'].includes(value)
    },
    trendText: {
      type: String,
      default: 'Stable'
    },
    history: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    trendClass() {
      return {
        'positive': this.trend === 'positive',
        'negative': this.trend === 'negative',
        'neutral': this.trend === 'neutral'
      };
    }
  },
  methods: {
    getRetentionClass(value) {
      if (value >= 90) return 'excellent';
      if (value >= 80) return 'good';
      if (value >= 70) return 'fair';
      return 'poor';
    }
  }
}
</script>

<style scoped>
.retention-stat {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.retention-stat__value-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.retention-stat__value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--neutral-900, #111827);
  margin: 0;
  line-height: 1;
}

.retention-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
}

.retention-trend.positive {
  color: var(--success-500, #10b981);
  background-color: rgba(16, 185, 129, 0.1);
}

.retention-trend.negative {
  color: var(--danger-500, #ef4444);
  background-color: rgba(239, 68, 68, 0.1);
}

.retention-trend.neutral {
  color: var(--warning-500, #f59e0b);
  background-color: rgba(245, 158, 11, 0.1);
}

.retention-chart {
  height: 60px;
  position: relative;
}

.chart-bar-container {
  height: 100%;
  position: relative;
}

.chart-bar {
  position: absolute;
  bottom: 0;
  width: 8px;
  border-radius: 4px 4px 0 0;
  transition: height 0.5s ease;
}

.chart-bar.excellent {
  background-color: rgba(16, 185, 129, 0.7);
}

.chart-bar.good {
  background-color: rgba(6, 182, 212, 0.7);
}

.chart-bar.fair {
  background-color: rgba(245, 158, 11, 0.7);
}

.chart-bar.poor {
  background-color: rgba(239, 68, 68, 0.7);
}
</style>