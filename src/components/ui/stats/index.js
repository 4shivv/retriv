// Export all stat card components
import StatCard from './StatCard.vue';
import GoalStatCard from './GoalStatCard.vue';
import StreakStatCard from './StreakStatCard.vue';
import RetentionStatCard from './RetentionStatCard.vue';
import MaterialsStatCard from './MaterialsStatCard.vue';

export {
  StatCard,
  GoalStatCard,
  StreakStatCard,
  RetentionStatCard,
  MaterialsStatCard
};

// Default export for registering all components
export default {
  install(app) {
    app.component('StatCard', StatCard);
    app.component('GoalStatCard', GoalStatCard);
    app.component('StreakStatCard', StreakStatCard);
    app.component('RetentionStatCard', RetentionStatCard);
    app.component('MaterialsStatCard', MaterialsStatCard);
  }
};