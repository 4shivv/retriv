<template>
  <div class="stat-card" :class="[`stat-card--${type}`, { 'stat-card--hoverable': hoverable }]">
    <div class="stat-card__header">
      <div class="stat-card__icon-container">
        <slot name="icon"></slot>
      </div>
      <div class="stat-card__title">{{ title }}</div>
      <div v-if="$slots.action" class="stat-card__action">
        <slot name="action"></slot>
      </div>
    </div>
    <div class="stat-card__content">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="stat-card__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatCard',
  props: {
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'success', 'warning', 'danger', 'info'].includes(value)
    },
    hoverable: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped>
.stat-card {
  background-color: white;
  border-radius: var(--radius-xl, 1rem);
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid var(--neutral-100, #f5f5f5);
  height: 100%;
}

.stat-card--hoverable:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.stat-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: -1;
  background-color: var(--primary-500, #6366f1);
  opacity: 0.8;
}

.stat-card--primary::after {
  background-color: var(--primary-500, #6366f1);
}

.stat-card--secondary::after {
  background-color: var(--secondary-500, #ec4899);
}

.stat-card--success::after {
  background-color: var(--success-500, #10b981);
}

.stat-card--warning::after {
  background-color: var(--warning-500, #f59e0b);
}

.stat-card--danger::after {
  background-color: var(--danger-500, #ef4444);
}

.stat-card--info::after {
  background-color: var(--info-500, #06b6d4);
}

/* Header */
.stat-card__header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stat-card__icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-md, 0.5rem);
  color: white;
  flex-shrink: 0;
}

.stat-card--primary .stat-card__icon-container {
  background: linear-gradient(135deg, var(--primary-500, #6366f1), var(--primary-600, #4f46e5));
  box-shadow: 0 0 12px rgba(99, 102, 241, 0.3);
}

.stat-card--secondary .stat-card__icon-container {
  background: linear-gradient(135deg, var(--secondary-500, #ec4899), var(--secondary-600, #db2777));
  box-shadow: 0 0 12px rgba(236, 72, 153, 0.3);
}

.stat-card--success .stat-card__icon-container {
  background: linear-gradient(135deg, var(--success-500, #10b981), var(--success-600, #059669));
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.3);
}

.stat-card--warning .stat-card__icon-container {
  background: linear-gradient(135deg, var(--warning-500, #f59e0b), var(--warning-600, #d97706));
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.3);
}

.stat-card--danger .stat-card__icon-container {
  background: linear-gradient(135deg, var(--danger-500, #ef4444), var(--danger-600, #dc2626));
  box-shadow: 0 0 12px rgba(239, 68, 68, 0.3);
}

.stat-card--info .stat-card__icon-container {
  background: linear-gradient(135deg, var(--info-500, #06b6d4), var(--info-600, #0891b2));
  box-shadow: 0 0 12px rgba(6, 182, 212, 0.3);
}

.stat-card__title {
  font-weight: 500;
  color: var(--neutral-700, #374151);
  font-size: 0.875rem;
  margin-right: auto;
}

.stat-card__action {
  margin-left: auto;
}

/* Content */
.stat-card__content {
  flex: 1;
}

/* Footer */
.stat-card__footer {
  border-top: 1px solid var(--neutral-100, #f5f5f5);
  padding-top: 0.875rem;
  font-size: 0.75rem;
  color: var(--neutral-600, #4b5563);
}
</style>