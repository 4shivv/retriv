<template>
  <div class="container">
    <div class="page-header">
      <h1>Create With AI</h1>
    </div>
    
    <AiGenerateForm 
      @material-saved="handleMaterialSaved" 
      @materials-saved="handleMultipleMaterialsSaved"
      @cancel="navigateToDashboard" 
    />
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import AiGenerateForm from '@/components/study/AiGenerateForm.vue';

export default {
  name: 'CreateWithAIView',
  components: {
    AiGenerateForm
  },
  
  setup() {
    const router = useRouter();
    
    const handleMaterialSaved = (material) => {
      // Navigate to the study view for the new material
      router.push(`/study/${material.id}`);
    };
    
    const handleMultipleMaterialsSaved = (materials) => {
      // If multiple materials were saved, go to the dashboard
      router.push('/dashboard?category=' + encodeURIComponent(materials[0].category));
    };
    
    const navigateToDashboard = () => {
      router.push('/dashboard');
    };
    
    return {
      handleMaterialSaved,
      handleMultipleMaterialsSaved,
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