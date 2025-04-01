<template>
  <stat-card :title="title" :type="type" :hoverable="hoverable">
    <template #icon>
      <slot name="icon"></slot>
    </template>
    <template #action>
      <slot name="action"></slot>
    </template>
    
    <div class="goal-stat">
      <div class="goal-stat__value-container">
        <h3 class="goal-stat__value">{{ value }}</h3>
        <div class="goal-info">
          <span class="goal-label">Goal: {{ goal }}/{{ period }}</span>
          <slot name="edit-button"></slot>
        </div>
      </div>
      <div class="goal-stat__progress">
        <div class="progress-container">
          <div 
            class="progress-bar" 
            :style="{ width: `${Math.min(100, (value / goal) * 100)}%` }"
            :class="{ 'goal-complete': value >= goal }"
          ></div>
        </div>
        <div class="progress-label">
          {{ Math.min(100, Math.floor((value / goal) * 100)) }}% of {{ period }} goal
          <span v-if="value >= goal" class="goal-complete-badge">Goal Complete!</span>
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
  name: 'GoalStatCard',
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
      default: 'primary'
    },
    hoverable: {
      type: Boolean,
      default: true
    },
    value: {
      type: Number,
      required: true
    },
    goal: {
      type: Number,
      required: true
    },
    period: {
      type: String,
      default: 'month'
    }
  }
}
</script>

<style scoped>
.goal-stat {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.goal-stat__value-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.goal-stat__value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--neutral-900, #111827);
  margin: 0;
  line-height: 1;
}

.goal-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.goal-label {
  font-size: 0.75rem;
  color: var(--neutral-600, #4b5563);
  background-color: var(--neutral-100, #f5f5f5);
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
}

.goal-stat__progress {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-container {
  height: 6px;
  background-color: var(--neutral-200, #e5e7eb);
  border-radius: 9999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-500, #6366f1), var(--primary-600, #4f46e5));
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.progress-bar.goal-complete {
  background: linear-gradient(90deg, var(--success-500, #10b981), var(--success-600, #059669));
}

.progress-label {
  font-size: 0.75rem;
  color: var(--neutral-600, #4b5563);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.goal-complete-badge {
  color: var(--success-500, #10b981);
  font-weight: 500;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.7; }
  50% { opacity: 1; }
  100% { opacity: 0.7; }
}
</style>