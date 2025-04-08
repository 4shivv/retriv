<template>
  <div class="practice-test-ai-container">
    <div class="header">
      <h1>Generate Practice Test with AI</h1>
      <p>Create a custom practice test using AI based on your specifications.</p>
    </div>
    
    <div class="content-container">
      <div class="ai-section">
        <div class="form-group">
          <label for="testTitle">Test Title</label>
          <input 
            type="text" 
            id="testTitle" 
            v-model="testTitle" 
            placeholder="Enter a title for your test"
            class="form-control"
          />
        </div>
        
        <div class="form-group">
          <label for="subject">Subject</label>
          <input 
            type="text" 
            id="subject" 
            v-model="subject" 
            placeholder="E.g., Biology, History, Mathematics"
            class="form-control"
          />
        </div>
        
        <div class="form-group">
          <label for="topic">Specific Topic (optional)</label>
          <input 
            type="text" 
            id="topic" 
            v-model="topic" 
            placeholder="E.g., Photosynthesis, World War II, Calculus"
            class="form-control"
          />
        </div>
        
        <div class="form-row">
          <div class="form-group form-group-half">
            <label for="difficulty">Difficulty Level</label>
            <select id="difficulty" v-model="difficulty" class="form-control">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          
          <div class="form-group form-group-half">
            <label for="questionCount">Number of Questions</label>
            <select id="questionCount" v-model="questionCount" class="form-control">
              <option value="5">5 questions</option>
              <option value="10">10 questions</option>
              <option value="15">15 questions</option>
              <option value="20">20 questions</option>
            </select>
          </div>
        </div>
        
        <div class="form-group">
          <label for="questionFormat">Question Format</label>
          <select id="questionFormat" v-model="questionFormat" class="form-control">
            <option value="multiple-choice">Multiple Choice</option>
            <option value="true-false">True/False</option>
            <option value="short-answer">Short Answer</option>
            <option value="mixed">Mixed Formats</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="exampleQuestion">Sample Question (optional)</label>
          <textarea 
            id="exampleQuestion" 
            v-model="exampleQuestion" 
            placeholder="Provide a sample question to guide the style and format of generated questions."
            class="form-control"
          ></textarea>
          <div class="helper-text">This helps the AI understand your preferred question style and tone.</div>
        </div>
        
        <div class="options-section">
          <h3>Test Options</h3>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="enableConfidence" />
              <span class="checkbox-text">Enable confidence ratings</span>
            </label>
            <div class="helper-text">Ask students to rate their confidence in answers to identify misconceptions.</div>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="enableMetacognitive" />
              <span class="checkbox-text">Enable metacognitive insights</span>
            </label>
            <div class="helper-text">Analyze answer patterns to provide personalized learning insights.</div>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="enableTimer" />
              <span class="checkbox-text">Enable timer</span>
            </label>
            <div class="helper-text">Set a time limit for each question.</div>
          </div>
          
          <div class="form-group" v-if="enableTimer">
            <label for="timerValue">Time per question (seconds)</label>
            <input 
              type="number" 
              id="timerValue" 
              v-model="timerValue" 
              min="10" 
              max="300"
              class="form-control"
            />
          </div>
        </div>
        
        <div class="action-buttons">
          <button class="btn btn-outline" @click="goBack">Cancel</button>
          <button 
            class="btn btn-primary" 
            :disabled="!testTitle.trim() || !subject.trim()" 
            @click="generateTest"
          >
            <span v-if="generating">
              <svg class="spinner" viewBox="0 0 50 50">
                <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
              </svg>
              Generating...
            </span>
            <span v-else>Generate Test</span>
          </button>
        </div>
      </div>
      
      <div class="info-section">
        <div class="info-card">
          <h3>How AI Generation Works</h3>
          <p>Our AI system creates custom practice tests tailored to your specifications:</p>
          
          <ol>
            <li>You provide the subject, topic, and difficulty level</li>
            <li>AI generates questions based on your specifications</li>
            <li>Each question includes the correct answer and explanation</li>
            <li>You can start practicing immediately</li>
          </ol>
          
          <div class="features-section">
            <h4>Key Features</h4>
            <ul>
              <li><strong>Subject Expertise:</strong> The AI is trained across various academic subjects</li>
              <li><strong>Custom Difficulty:</strong> Adjust to match your current knowledge level</li>
              <li><strong>Question Format:</strong> Choose multiple-choice, true/false, or short answer</li>
              <li><strong>Explanations:</strong> Each question includes a detailed explanation</li>
            </ul>
          </div>
          
          <div class="tips-section">
            <h4>Tips for Best Results</h4>
            <ul>
              <li>Be specific about the subject and topic</li>
              <li>Provide a sample question to guide the style</li>
              <li>Choose the appropriate difficulty level</li>
              <li>Start with fewer questions to test the format</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'PracticeTestAIView',
  setup() {
    const router = useRouter();
    const testTitle = ref('');
    const subject = ref('');
    const topic = ref('');
    const difficulty = ref('intermediate');
    const questionCount = ref('10');
    const questionFormat = ref('multiple-choice');
    const exampleQuestion = ref('');
    const generating = ref(false);
    
    // Test options
    const enableConfidence = ref(true);
    const enableMetacognitive = ref(true);
    const enableTimer = ref(true);
    const timerValue = ref(60);
    
    // Generate test with AI
    const generateTest = () => {
      if (!testTitle.value.trim() || !subject.value.trim()) return;
      
      generating.value = true;
      
      // In a real app, you would call an AI service to generate questions
      // For now, we'll simulate a delay and create a mock test
      setTimeout(() => {
        // Create test options object
        const options = {
          confidence: enableConfidence.value,
          metacognitive: enableMetacognitive.value,
          timer: enableTimer.value ? timerValue.value : 0
        };
        
        // Create AI parameters object
        const aiParams = {
          subject: subject.value,
          topic: topic.value,
          difficulty: difficulty.value,
          questionCount: parseInt(questionCount.value),
          questionFormat: questionFormat.value,
          exampleQuestion: exampleQuestion.value
        };
        
        // Navigate to test taking page with test ID
        // In a real app, you would save the test to the database and get an ID
        const testId = 'test-' + Date.now();
        router.push({
          name: 'PracticeTestTake',
          params: { id: testId },
          query: { 
            title: testTitle.value,
            source: 'ai',
            options: JSON.stringify(options),
            aiParams: JSON.stringify(aiParams)
          }
        });
        
        generating.value = false;
      }, 2500);
    };
    
    // Go back to previous page
    const goBack = () => {
      router.back();
    };
    
    return {
      testTitle,
      subject,
      topic,
      difficulty,
      questionCount,
      questionFormat,
      exampleQuestion,
      generating,
      enableConfidence,
      enableMetacognitive,
      enableTimer,
      timerValue,
      generateTest,
      goBack
    };
  }
};
</script>

<style scoped>
.practice-test-ai-container {
  padding: var(--spacing-6);
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  margin-bottom: var(--spacing-8);
  text-align: center;
}

.header h1 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--neutral-900);
  margin-bottom: var(--spacing-2);
}

.header p {
  font-size: var(--font-size-lg);
  color: var(--neutral-600);
  max-width: 600px;
  margin: 0 auto;
}

.content-container {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: var(--spacing-8);
}

.ai-section {
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-6);
}

.form-group {
  margin-bottom: var(--spacing-4);
}

.form-row {
  display: flex;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-4);
}

.form-group-half {
  flex: 1;
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-2);
  font-weight: var(--font-weight-medium);
  color: var(--neutral-700);
}

.form-control {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  border: 1px solid var(--neutral-300);
  border-radius: var(--radius-md);
  font-size: var(--font-size-md);
  transition: all var(--transition-fast);
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.helper-text {
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
  margin-top: var(--spacing-1);
}

.options-section {
  background-color: var(--neutral-50);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-6);
  margin-top: var(--spacing-6);
}

.options-section h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-900);
  margin: 0 0 var(--spacing-4);
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: var(--spacing-1);
}

.checkbox-text {
  margin-left: var(--spacing-2);
  font-weight: var(--font-weight-medium);
  color: var(--neutral-800);
}

.helper-text {
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
  margin-left: var(--spacing-6);
  margin-bottom: var(--spacing-3);
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-3);
}

.btn {
  padding: var(--spacing-2) var(--spacing-6);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.btn-outline {
  background-color: transparent;
  border: 1px solid var(--neutral-300);
  color: var(--neutral-700);
}

.btn-outline:hover {
  background-color: var(--neutral-100);
  border-color: var(--neutral-400);
  color: var(--neutral-900);
}

.btn-primary {
  background-color: var(--primary-color);
  border: 1px solid var(--primary-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-color-dark);
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.info-section {
  align-self: flex-start;
}

.info-card {
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-6);
}

.info-card h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-900);
  margin: 0 0 var(--spacing-4);
}

.info-card p {
  color: var(--neutral-700);
  margin-bottom: var(--spacing-4);
}

.info-card ol, .info-card ul {
  padding-left: var(--spacing-6);
  margin-bottom: var(--spacing-4);
}

.info-card li {
  margin-bottom: var(--spacing-2);
  color: var(--neutral-700);
}

.features-section {
  margin-top: var(--spacing-6);
  border-top: 1px solid var(--neutral-200);
  padding-top: var(--spacing-4);
}

.features-section h4 {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-800);
  margin-bottom: var(--spacing-2);
}

.tips-section {
  background-color: var(--primary-color-lightest);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--primary-color);
  margin-top: var(--spacing-6);
}

.tips-section h4 {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--primary-color-dark);
  margin: 0 0 var(--spacing-2);
}

.tips-section ul {
  margin-bottom: 0;
}

/* Animation for spinner */
.spinner {
  animation: rotate 2s linear infinite;
  width: 20px;
  height: 20px;
  display: inline-block;
  margin-right: var(--spacing-2);
}

.spinner .path {
  stroke: white;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .content-container {
    grid-template-columns: 1fr;
  }
  
  .info-section {
    order: -1;
    margin-bottom: var(--spacing-6);
  }
  
  .form-row {
    flex-direction: column;
    gap: var(--spacing-4);
  }
  
  .form-group-half {
    margin-bottom: var(--spacing-4);
  }
}
</style>