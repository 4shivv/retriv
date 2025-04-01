<template>
  <stat-card :title="title" :type="type" :hoverable="hoverable">
    <template #icon>
      <slot name="icon"></slot>
    </template>
    
    <div class="materials-stat">
      <div class="materials-stat__value-container">
        <h3 class="materials-stat__value">{{ value }}</h3>
        <div v-if="newMaterials > 0" class="materials-stat__change positive">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
          <span>+{{ newMaterials }} new</span>
        </div>
      </div>
      
      <div class="materials-distribution">
        <div class="distribution-item" v-for="(category, index) in categories" :key="index">
          <div class="distribution-color" :style="{ backgroundColor: category.color }"></div>
          <div class="distribution-label">{{ category.name }}</div>
          <div class="distribution-value">{{ category.count }}</div>
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
  name: 'MaterialsStatCard',
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
      default: 'warning'
    },
    hoverable: {
      type: Boolean,
      default: true
    },
    value: {
      type: Number,
      required: true
    },
    newMaterials: {
      type: Number,
      default: 0
    },
    categories: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>
.materials-stat {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.materials-stat__value-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.materials-stat__value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--neutral-900, #111827);
  margin: 0;
  line-height: 1;
}

.materials-stat__change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
}

.materials-stat__change.positive {
  color: var(--success-500, #10b981);
  background-color: rgba(16, 185, 129, 0.1);
}

.materials-distribution {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.distribution-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
}

.distribution-color {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
}

.distribution-label {
  flex: 1;
  color: var(--neutral-700, #374151);
}

.distribution-value {
  font-weight: 500;
  color: var(--neutral-900, #111827);
}
</style>