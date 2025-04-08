<template>
  <div class="practice-test-take-container">
    <PracticeTestTaking 
      :test="currentTest"
      @complete="handleTestComplete"
      @exit="exitTest"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import PracticeTestTaking from './PracticeTestTaking.vue';

export default {
  name: 'PracticeTestTakeView',
  components: {
    PracticeTestTaking
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const currentTest = ref(null);
    
    // Load test on mount
    onMounted(() => {
      const testId = route.params.id;
      const testTitle = route.query.title || 'Practice Test';
      const source = route.query.source || 'unknown';
      let options = {};
      
      // Parse options if provided
      if (route.query.options) {
        try {
          options = JSON.parse(route.query.options);
        } catch (e) {
          console.error('Error parsing test options:', e);
        }
      }
      
      // In a real app, you would fetch the test from the database
      // For now, we'll create a mock test
      currentTest.value = {
        id: testId,
        title: testTitle,
        source: source,
        options: options,
        createdAt: new Date(),
        questions: generateMockQuestions(10),
        questionCount: 10
      };
    });
    
    // Handle test completion
    const handleTestComplete = (results) => {
      // In a real app, you would save the results to the database
      console.log('Test completed:', results);
      
      // Navigate to dashboard or results page
      router.push('/dashboard');
    };
    
    // Exit test
    const exitTest = () => {
      router.push('/dashboard');
    };
    
    // Helper to generate mock questions
    const generateMockQuestions = (count) => {
      const questions = [];
      
      for (let i = 0; i < count; i++) {
        questions.push({
          id: 'q-' + (i + 1),
          text: `Sample question ${i + 1}?`,
          options: [
            { id: 'a', text: 'Option A' },
            { id: 'b', text: 'Option B' },
            { id: 'c', text: 'Option C' },
            { id: 'd', text: 'Option D' }
          ],
          answer: 'a', // Correct answer
          explanation: 'This is an explanation for the correct answer.'
        });
      }
      
      return questions;
    };
    
    return {
      currentTest,
      handleTestComplete,
      exitTest
    };
  }
};
</script>

<style scoped>
.practice-test-take-container {
  min-height: calc(100vh - 60px);
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-6);
}
</style>