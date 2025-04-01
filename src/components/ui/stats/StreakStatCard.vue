<template>
  <stat-card :title="title" :type="type" :hoverable="hoverable">
    <template #icon>
      <slot name="icon"></slot>
    </template>
    
    <div class="streak-stat">
      <div class="streak-stat__value-container">
        <h3 class="streak-stat__value">{{ value }}</h3>
        <div class="streak-badge">
          <span>{{ statusText }}</span>
        </div>
      </div>
      
      <div class="streak-calendar">
        <div 
          v-for="(day, index) in days" 
          :key="index" 
          class="calendar-day"
          :class="{ active: index < (value % 7) || value >= 7 }"
        >
          {{ day }}
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
  name: 'StreakStatCard',
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
      default: 'secondary'
    },
    hoverable: {
      type: Boolean,
      default: true
    },
    value: {
      type: Number,
      required: true
    },
    statusText: {
      type: String,
      default: ''
    },
    days: {
      type: Array,
      default: () => ['M', 'T', 'W', 'T', 'F', 'S', 'S']
    }
  }
}
</script>

<style scoped>
.streak-stat {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.streak-stat__value-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.streak-stat__value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--neutral-900, #111827);
  margin: 0;
  line-height: 1;
}

.streak-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  background-color: rgba(236, 72, 153, 0.1);
  color: var(--secondary-500, #ec4899);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.streak-calendar {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
}

.calendar-day {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: var(--neutral-200, #e5e7eb);
  color: var(--neutral-500, #6b7280);
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.calendar-day.active {
  background-color: var(--secondary-500, #ec4899);
  color: white;
  box-shadow: 0 0 8px rgba(236, 72, 153, 0.4);
}
</style>