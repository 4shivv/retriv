<template>
  <div class="container">
    <div class="page-header">
      <h1>Create Study Card</h1>
    </div>
    
    <ManualStudyCard 
      @material-saved="handleMaterialSaved" 
      @cancel="navigateToDashboard" 
    />
  </div>
</template>

<script>

import { useRouter } from 'vue-router';
import ManualStudyCard from '@/components/study/ManualStudyCard.vue';

export default {
  name: 'CreateStudyCardView',
  components: {
    ManualStudyCard
  },
  
  setup() {
    const router = useRouter();
    
    const handleMaterialSaved = (material) => {
      // Navigate to the study view for the new material
      router.push(`/study/${material.id}`);
    };
    
    const navigateToDashboard = () => {
      router.push('/dashboard');
    };
    
    return {
      handleMaterialSaved,
      navigateToDashboard
    };
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-4);
}

.page-header {
  margin-bottom: var(--spacing-6);
}

.page-header h1 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--neutral-900);
}
</style>