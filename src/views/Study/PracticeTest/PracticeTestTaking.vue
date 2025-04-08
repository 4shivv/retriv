<template>
  <div class="practice-test-taking">
    <div class="test-header">
      <h2>{{ test.title }}</h2>
      <div class="test-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progressPercentage}%` }"></div>
        </div>
        <div class="progress-text">
          {{ currentQuestionIndex + 1 }} of {{ test.questions.length }} questions
        </div>
      </div>
      <button class="btn btn-outline btn-exit" @click="confirmExit">Exit Test</button>
    </div>
    
    <!-- Test Questions -->
    <div v-if="!testCompleted" class="question-container">
      <div class="question-header">
        <h3 class="question-number">Question {{ currentQuestionIndex + 1 }}</h3>
        <div class="timer" v-if="timerEnabled">{{ formatTime(timeRemaining) }}</div>
      </div>
      
      <div class="question-content">
        <p class="question-text">{{ currentQuestion.text }}</p>
        
        <div class="options-list">
          <div 
            v-for="option in currentQuestion.options" 
            :key="option.id"
            class="option-item" 
            :class="{
              'selected': selectedAnswer === option.id,
              'correct': showAnswer && option.id === currentQuestion.answer,
              'incorrect': showAnswer && selectedAnswer === option.id && option.id !== currentQuestion.answer
            }"
            @click="selectAnswer(option.id)"
          >
            <div class="option-marker">{{ option.id.toUpperCase() }}</div>
            <div class="option-text">{{ option.text }}</div>
            <div class="option-status" v-if="showAnswer">
              <svg v-if="option.id === currentQuestion.answer" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <svg v-else-if="selectedAnswer === option.id" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
          </div>
        </div>
        
        <div v-if="showConfidenceRating" class="confidence-rating">
          <p class="confidence-prompt">How confident are you in your answer?</p>
          <div class="confidence-options">
            <button 
              v-for="level in confidenceLevels" 
              :key="level.value"
              class="confidence-option" 
              :class="{ 'selected': confidenceLevel === level.value }"
              @click="setConfidence(level.value)"
            >
              {{ level.label }}
            </button>
          </div>
        </div>
        
        <div v-if="showAnswer" class="answer-explanation">
          <div class="explanation-header">
            <div :class="isCorrect ? 'result-correct' : 'result-incorrect'">
              {{ isCorrect ? 'Correct!' : 'Incorrect' }}
            </div>
            <div class="confidence-badge" v-if="confidenceLevel">
              {{ getConfidenceLabel(confidenceLevel) }} confidence
            </div>
          </div>
          <p class="explanation-text">{{ currentQuestion.explanation }}</p>
          
          <!-- Metacognitive insights -->
          <div v-if="insights.length > 0" class="metacognitive-insights">
            <h4>Learning Insights</h4>
            <ul>
              <li v-for="(insight, index) in insights" :key="index">{{ insight }}</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="question-actions">
        <button 
          v-if="!showAnswer" 
          class="btn btn-primary"
          @click="checkAnswer"
          :disabled="!selectedAnswer"
        >
          Submit Answer
        </button>
        <button 
          v-else-if="hasNextQuestion" 
          class="btn btn-primary"
          @click="nextQuestion"
        >
          Next Question
        </button>
        <button 
          v-else 
          class="btn btn-primary"
          @click="finishTest"
        >
          Complete Test
        </button>
      </div>
    </div>
    
    <!-- Test Results -->
    <div v-else class="results-container">
      <div class="results-header">
        <h3>Test Complete!</h3>
        <div class="score-display">
          <div class="score-circle" :style="{ '--percentage': scorePercentage + '%' }">
            <div class="score-inner">
              <div class="score-percentage">{{ scorePercentage }}%</div>
              <div class="score-text">{{ scoreMessage }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="results-summary">
        <div class="summary-item">
          <div class="summary-label">Total Questions</div>
          <div class="summary-value">{{ test.questions.length }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Correct Answers</div>
          <div class="summary-value">{{ correctAnswers }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Incorrect Answers</div>
          <div class="summary-value">{{ test.questions.length - correctAnswers }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Time Taken</div>
          <div class="summary-value">{{ formatTime(totalTime) }}</div>
        </div>
      </div>
      
      <!-- Metacognitive Insights -->
      <div class="metacognitive-summary" v-if="overallInsights.length > 0">
        <h4>Learning Insights</h4>
        <div class="insights-list">
          <div 
            v-for="(insight, index) in overallInsights" 
            :key="index"
            class="insight-item"
          >
            <div class="insight-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </div>
            <div class="insight-text">{{ insight }}</div>
          </div>
        </div>
      </div>
      
      <div class="question-review">
        <h4>Question Review</h4>
        <div class="question-list">
          <div 
            v-for="(question, index) in test.questions" 
            :key="index"
            class="question-item"
            :class="{ 'correct': answers[index] === question.answer, 'incorrect': answers[index] !== question.answer }"
            @click="showQuestion(index)"
          >
            <div class="question-number">{{ index + 1 }}</div>
            <div class="question-text">{{ truncateText(question.text, 60) }}</div>
            <div class="question-status">
              <svg v-if="answers[index] === question.answer" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div class="results-actions">
        <button class="btn btn-outline" @click="$emit('exit')">Exit</button>
        <button class="btn btn-primary" @click="retakeTest">Retake Test</button>
      </div>
    </div>
    
    <!-- Exit Confirmation Modal -->
    <div v-if="showExitModal" class="modal-backdrop" @click="showExitModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Exit Test?</h3>
          <button class="close-button" @click="showExitModal = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <p>Your progress will not be saved. Are you sure you want to exit the test?</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showExitModal = false">Cancel</button>
          <button class="btn btn-primary" @click="exitTest">Exit Test</button>
        </div>
      </div>
    </div>
    
    <!-- Question Review Modal -->
    <div v-if="showReviewModal" class="modal-backdrop" @click="showReviewModal = false">
      <div class="modal-content modal-large" @click.stop>
        <div class="modal-header">
          <h3>Question {{ reviewQuestionIndex + 1 }}</h3>
          <button class="close-button" @click="showReviewModal = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="review-question">
            <p class="question-text">{{ reviewQuestion.text }}</p>
            
            <div class="options-list">
              <div 
                v-for="option in reviewQuestion.options" 
                :key="option.id"
                class="option-item" 
                :class="{
                  'selected': answers[reviewQuestionIndex] === option.id,
                  'correct': option.id === reviewQuestion.answer,
                  'incorrect': answers[reviewQuestionIndex] === option.id && option.id !== reviewQuestion.answer
                }"
              >
                <div class="option-marker">{{ option.id.toUpperCase() }}</div>
                <div class="option-text">{{ option.text }}</div>
                <div class="option-status">
                  <svg v-if="option.id === reviewQuestion.answer" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <svg v-else-if="answers[reviewQuestionIndex] === option.id" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
              </div>
            </div>
            
            <div class="answer-explanation">
              <div class="explanation-header">
                <div :class="reviewIsCorrect ? 'result-correct' : 'result-incorrect'">
                  {{ reviewIsCorrect ? 'Correct Answer' : 'Incorrect Answer' }}
                </div>
                <div class="confidence-badge" v-if="confidenceLevels[reviewQuestionIndex]">
                  {{ getConfidenceLabel(confidenceRatings[reviewQuestionIndex]) }} confidence
                </div>
              </div>
              <p class="explanation-text">{{ reviewQuestion.explanation }}</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button 
            class="btn btn-outline" 
            :disabled="reviewQuestionIndex === 0"
            @click="reviewPrevQuestion"
          >
            Previous
          </button>
          <button 
            class="btn btn-primary" 
            :disabled="reviewQuestionIndex === test.questions.length - 1"
            @click="reviewNextQuestion"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

export default {
  name: 'PracticeTestTaking',
  props: {
    test: {
      type: Object,
      required: true
    }
  },
  emits: ['complete', 'exit'],
  setup(props, { emit }) {
    // Test state
    const currentQuestionIndex = ref(0);
    const selectedAnswer = ref('');
    const showAnswer = ref(false);
    const testCompleted = ref(false);
    const answers = ref([]);
    const confidenceRatings = ref([]);
    const showConfidenceRating = ref(false);
    const confidenceLevel = ref('');
    const insights = ref([]);
    const overallInsights = ref([]);
    
    // Test settings
    const timerEnabled = ref(true);
    const totalTime = ref(0);
    const startTime = ref(Date.now());
    const timeRemaining = ref(0);
    const questionTime = ref(60); // 60 seconds per question
    const timer = ref(null);
    
    // Modals
    const showExitModal = ref(false);
    const showReviewModal = ref(false);
    const reviewQuestionIndex = ref(0);
    
    // Confidence levels
    const confidenceLevels = [
      { value: 'very-low', label: 'Very Low' },
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
      { value: 'very-high', label: 'Very High' }
    ];
    
    // Computed properties
    const currentQuestion = computed(() => props.test.questions[currentQuestionIndex.value]);
    
    const hasNextQuestion = computed(() => {
      return currentQuestionIndex.value < props.test.questions.length - 1;
    });
    
    const progressPercentage = computed(() => {
      return (currentQuestionIndex.value / props.test.questions.length) * 100;
    });
    
    const isCorrect = computed(() => {
      return selectedAnswer.value === currentQuestion.value.answer;
    });
    
    const correctAnswers = computed(() => {
      return answers.value.filter((answer, index) => {
        return answer === props.test.questions[index].answer;
      }).length;
    });
    
    const scorePercentage = computed(() => {
      return Math.round((correctAnswers.value / props.test.questions.length) * 100);
    });
    
    const scoreMessage = computed(() => {
      const score = scorePercentage.value;
      if (score >= 90) return 'Excellent';
      if (score >= 80) return 'Great';
      if (score >= 70) return 'Good';
      if (score >= 60) return 'Satisfactory';
      return 'Needs Improvement';
    });
    
    const reviewQuestion = computed(() => {
      return props.test.questions[reviewQuestionIndex.value];
    });
    
    const reviewIsCorrect = computed(() => {
      return answers.value[reviewQuestionIndex.value] === reviewQuestion.value.answer;
    });
    
    // Methods
    const selectAnswer = (optionId) => {
      if (!showAnswer.value) {
        selectedAnswer.value = optionId;
      }
    };
    
    const checkAnswer = () => {
      if (selectedAnswer.value) {
        // Stop timer
        if (timer.value) {
          clearInterval(timer.value);
          timer.value = null;
        }
        
        // Show confidence rating
        showConfidenceRating.value = true;
      }
    };
    
    const setConfidence = (level) => {
      confidenceLevel.value = level;
      // Store the confidence level for this question
      confidenceRatings.value[currentQuestionIndex.value] = level;
      
      // Proceed to show answer
      showAnswer.value = true;
      showConfidenceRating.value = false;
      
      // Store the answer
      answers.value[currentQuestionIndex.value] = selectedAnswer.value;
      
      // Generate insights
      generateInsights();
    };
    
    const nextQuestion = () => {
      // Reset state for next question
      selectedAnswer.value = '';
      showAnswer.value = false;
      confidenceLevel.value = '';
      insights.value = [];
      
      // Move to next question
      currentQuestionIndex.value++;
      
      // Start timer for new question
      startTimer();
    };
    
    const finishTest = () => {
      // Store the time taken
      totalTime.value = Math.floor((Date.now() - startTime.value) / 1000);
      
      // Generate overall insights
      generateOverallInsights();
      
      // Mark test as completed
      testCompleted.value = true;
      
      // Emit completion event with results
      emit('complete', {
        id: props.test.id,
        score: scorePercentage.value,
        answers: answers.value,
        confidenceRatings: confidenceRatings.value,
        timeTaken: totalTime.value
      });
    };
    
    const confirmExit = () => {
      showExitModal.value = true;
    };
    
    const exitTest = () => {
      showExitModal.value = false;
      emit('exit');
    };
    
    const retakeTest = () => {
      // Reset all state
      currentQuestionIndex.value = 0;
      selectedAnswer.value = '';
      showAnswer.value = false;
      testCompleted.value = false;
      answers.value = [];
      confidenceRatings.value = [];
      confidenceLevel.value = '';
      insights.value = [];
      overallInsights.value = [];
      startTime.value = Date.now();
      
      // Start timer
      startTimer();
    };
    
    const showQuestion = (index) => {
      reviewQuestionIndex.value = index;
      showReviewModal.value = true;
    };
    
    const reviewNextQuestion = () => {
      if (reviewQuestionIndex.value < props.test.questions.length - 1) {
        reviewQuestionIndex.value++;
      }
    };
    
    const reviewPrevQuestion = () => {
      if (reviewQuestionIndex.value > 0) {
        reviewQuestionIndex.value--;
      }
    };
    
    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    const truncateText = (text, maxLength) => {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    };
    
    const getConfidenceLabel = (value) => {
      const level = confidenceLevels.find(l => l.value === value);
      return level ? level.label : '';
    };
    
    // Start timer
    const startTimer = () => {
      if (timerEnabled.value) {
        // Clear existing timer if it exists
        if (timer.value) {
          clearInterval(timer.value);
          timer.value = null;
        }
        
        timeRemaining.value = questionTime.value;
        timer.value = setInterval(() => {
          if (timeRemaining.value > 0) {
            timeRemaining.value--;
          } else {
            // Time's up, auto-submit
            clearInterval(timer.value);
            timer.value = null;
            if (!showAnswer.value && !showConfidenceRating.value) {
              checkAnswer();
            }
          }
        }, 1000);
      }
    };
    
    // Generate metacognitive insights
    const generateInsights = () => {
      const isCorrect = selectedAnswer.value === currentQuestion.value.answer;
      const confidenceHigh = ['high', 'very-high'].includes(confidenceLevel.value);
      const confidenceLow = ['low', 'very-low'].includes(confidenceLevel.value);
      
      if (!isCorrect && confidenceHigh) {
        // High confidence wrong answer - dangerous misconception
        insights.value.push("Be careful! You were highly confident but incorrect. This suggests a potential misconception that needs attention.");
      } else if (isCorrect && confidenceLow) {
        // Low confidence correct answer - lucky guess
        insights.value.push("You got this right but weren't confident. Take time to strengthen your understanding of this concept.");
      }
      
      // Add more insights based on the specific question topics
      // This would be more sophisticated in a real implementation
    };
    
    // Generate overall metacognitive insights
    const generateOverallInsights = () => {
      // Detect patterns in mistakes
      const wrongAnswers = answers.value.map((answer, index) => {
        return {
          index,
          question: props.test.questions[index],
          answer,
          isCorrect: answer === props.test.questions[index].answer,
          confidence: confidenceRatings.value[index]
        };
      }).filter(item => !item.isCorrect);
      
      const highConfidenceWrong = wrongAnswers.filter(item => 
        ['high', 'very-high'].includes(item.confidence)
      );
      
      if (highConfidenceWrong.length > 0 && highConfidenceWrong.length >= wrongAnswers.length * 0.5) {
        overallInsights.value.push("We noticed you were highly confident in several wrong answers. This suggests you may have some misconceptions that need addressing.");
      }
      
      // In a real implementation, we would analyze question topics, categories, etc.
      // For this prototype, we'll add some sample insights
      if (correctAnswers.value < props.test.questions.length * 0.7) {
        overallInsights.value.push("Consider reviewing the core concepts covered in this test, as your score suggests some gaps in understanding.");
      }
      
      if (wrongAnswers.length > 0) {
        overallInsights.value.push("Focus on the questions you missed. Take time to understand why the correct answer is correct.");
      }
      
      // Add a random insight about study habits
      const studyInsights = [
        "Try using spaced repetition to reinforce these concepts over time.",
        "Consider teaching these concepts to someone else to solidify your understanding.",
        "Creating visual representations of these concepts may help strengthen your recall."
      ];
      
      overallInsights.value.push(studyInsights[Math.floor(Math.random() * studyInsights.length)]);
    };
    
    // Initialize
    onMounted(() => {
      // Initialize arrays for answers and confidence ratings
      answers.value = new Array(props.test.questions.length).fill('');
      confidenceRatings.value = new Array(props.test.questions.length).fill('');
      
      // Start timer
      startTimer();
    });
    
    // Clean up
    onBeforeUnmount(() => {
      if (timer.value) {
        clearInterval(timer.value);
        timer.value = null;
      }
    });
    
    return {
      currentQuestionIndex,
      selectedAnswer,
      showAnswer,
      testCompleted,
      answers,
      confidenceRatings,
      showConfidenceRating,
      confidenceLevel,
      insights,
      overallInsights,
      timerEnabled,
      totalTime,
      timeRemaining,
      showExitModal,
      showReviewModal,
      reviewQuestionIndex,
      confidenceLevels,
      currentQuestion,
      hasNextQuestion,
      progressPercentage,
      isCorrect,
      correctAnswers,
      scorePercentage,
      scoreMessage,
      reviewQuestion,
      reviewIsCorrect,
      selectAnswer,
      checkAnswer,
      setConfidence,
      nextQuestion,
      finishTest,
      confirmExit,
      exitTest,
      retakeTest,
      showQuestion,
      reviewNextQuestion,
      reviewPrevQuestion,
      formatTime,
      truncateText,
      getConfidenceLabel
    };
  }
};
</script>

<style scoped>
.practice-test-taking {
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.test-header {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-4) var(--spacing-6);
  border-bottom: 1px solid var(--neutral-200);
  position: relative;
}

.test-header h2 {
  margin: 0 0 var(--spacing-2);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-900);
}

.test-progress {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.progress-bar {
  flex: 1;
  height: 8px;
  background-color: var(--neutral-200);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary-gradient);
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
  white-space: nowrap;
}

.btn-exit {
  position: absolute;
  top: var(--spacing-4);
  right: var(--spacing-6);
}

.question-container {
  padding: var(--spacing-6);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
}

.question-number {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-800);
  margin: 0;
}

.timer {
  background-color: var(--neutral-100);
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--neutral-700);
}

.question-content {
  margin-bottom: var(--spacing-6);
}

.question-text {
  font-size: var(--font-size-lg);
  line-height: 1.5;
  margin-bottom: var(--spacing-4);
  color: var(--neutral-900);
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-4);
}

.option-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-3) var(--spacing-4);
  border: 1px solid var(--neutral-300);
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
  cursor: pointer;
  position: relative;
}

.option-item:hover:not(.correct):not(.incorrect) {
  border-color: var(--primary-color);
  background-color: rgba(99, 102, 241, 0.05);
}

.option-item.selected:not(.correct):not(.incorrect) {
  border-color: var(--primary-color);
  background-color: rgba(99, 102, 241, 0.1);
  box-shadow: 0 0 0 1px var(--primary-color);
}

.option-item.correct {
  border-color: var(--success-color);
  background-color: rgba(34, 197, 94, 0.1);
}

.option-item.incorrect {
  border-color: var(--danger-color);
  background-color: rgba(239, 68, 68, 0.1);
}

.option-marker {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background-color: var(--neutral-100);
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-semibold);
  margin-right: var(--spacing-3);
  color: var(--neutral-700);
  flex-shrink: 0;
}

.option-item.selected .option-marker,
.option-item:hover .option-marker {
  background-color: var(--primary-color-light);
  color: var(--primary-color-dark);
}

.option-item.correct .option-marker {
  background-color: var(--success-color-light);
  color: var(--success-color-dark);
}

.option-item.incorrect .option-marker {
  background-color: var(--danger-color-light);
  color: var(--danger-color-dark);
}

.option-text {
  flex: 1;
  font-size: var(--font-size-md);
  color: var(--neutral-800);
}

.option-status {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-left: var(--spacing-2);
}

.option-item.correct .option-status {
  color: var(--success-color);
}

.option-item.incorrect .option-status {
  color: var(--danger-color);
}

.confidence-rating {
  background-color: var(--primary-color-lightest);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-4);
  border: 1px solid var(--primary-color-light);
}

.confidence-prompt {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--primary-color-dark);
  margin: 0 0 var(--spacing-3);
  text-align: center;
}

.confidence-options {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

.confidence-option {
  background-color: white;
  border: 1px solid var(--primary-color-light);
  color: var(--primary-color);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.confidence-option:hover {
  background-color: var(--primary-color-lightest);
  transform: translateY(-2px);
}

.confidence-option.selected {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.answer-explanation {
  background-color: var(--neutral-100);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  margin-top: var(--spacing-4);
}

.explanation-header {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-3);
  gap: var(--spacing-3);
}

.result-correct {
  font-weight: var(--font-weight-semibold);
  color: var(--success-color);
  font-size: var(--font-size-md);
}

.result-incorrect {
  font-weight: var(--font-weight-semibold);
  color: var(--danger-color);
  font-size: var(--font-size-md);
}

.confidence-badge {
  background-color: white;
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  color: var(--neutral-700);
  border: 1px solid var(--neutral-300);
}

.explanation-text {
  color: var(--neutral-800);
  margin: 0;
  line-height: 1.5;
}

.metacognitive-insights {
  background-color: var(--primary-color-lightest);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  margin-top: var(--spacing-4);
  border: 1px solid var(--primary-color-light);
}

.metacognitive-insights h4 {
  color: var(--primary-color-dark);
  margin: 0 0 var(--spacing-2);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
}

.metacognitive-insights ul {
  margin: 0;
  padding-left: var(--spacing-4);
}

.metacognitive-insights li {
  color: var(--neutral-800);
  margin-bottom: var(--spacing-1);
}

.question-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--spacing-6);
}

/* Results Styles */
.results-container {
  padding: var(--spacing-6);
}

.results-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--spacing-8);
}

.results-header h3 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--neutral-900);
  margin: 0 0 var(--spacing-4);
}

.score-display {
  display: flex;
  justify-content: center;
  align-items: center;
}

.score-circle {
  width: 160px;
  height: 160px;
  border-radius: var(--radius-full);
  background: conic-gradient(
    var(--primary-color) calc(var(--percentage) * 1%), 
    var(--neutral-200) calc(var(--percentage) * 1%)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  color: var(--neutral-900);
}

.score-inner {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.score-percentage {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-1);
  color: var(--neutral-900);
}

.score-text {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--neutral-600);
}

.results-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-8);
}

.summary-item {
  background-color: var(--neutral-100);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  text-align: center;
}

.summary-label {
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
  margin-bottom: var(--spacing-2);
}

.summary-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-900);
}

.metacognitive-summary {
  background-color: var(--primary-color-lightest);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-8);
  border: 1px solid var(--primary-color-light);
}

.metacognitive-summary h4 {
  color: var(--primary-color-dark);
  margin: 0 0 var(--spacing-4);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

.insights-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.insight-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  padding: var(--spacing-3);
  background-color: white;
  border-radius: var(--radius-md);
  border: 1px solid var(--primary-color-light);
}

.insight-icon {
  color: var(--primary-color);
  flex-shrink: 0;
}

.insight-text {
  color: var(--neutral-800);
  flex: 1;
  line-height: 1.5;
}

.question-review {
  margin-bottom: var(--spacing-8);
}

.question-review h4 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-900);
  margin: 0 0 var(--spacing-4);
}

.question-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-3);
}

.question-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  border: 1px solid var(--neutral-300);
}

.question-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.question-item.correct {
  border-color: var(--success-color-light);
  background-color: rgba(34, 197, 94, 0.05);
}

.question-item.incorrect {
  border-color: var(--danger-color-light);
  background-color: rgba(239, 68, 68, 0.05);
}

.question-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: var(--neutral-100);
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  color: var(--neutral-700);
  flex-shrink: 0;
}

.question-item.correct .question-number {
  background-color: var(--success-color-light);
  color: var(--success-color-dark);
}

.question-item.incorrect .question-number {
  background-color: var(--danger-color-light);
  color: var(--danger-color-dark);
}

.question-text {
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--neutral-800);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.question-status {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.question-item.correct .question-status {
  color: var(--success-color);
}

.question-item.incorrect .question-status {
  color: var(--danger-color);
}

.results-actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-4);
}

/* Modal Styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.modal-content {
  background-color: white;
  border-radius: var(--radius-lg);
  width: 400px;
  max-width: 90vw;
  box-shadow: var(--shadow-xl);
  animation: scaleIn 0.2s ease;
}

.modal-large {
  width: 600px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-4) var(--spacing-6);
  border-bottom: 1px solid var(--neutral-200);
}

.modal-header h3 {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-900);
}

.close-button {
  background: none;
  border: none;
  color: var(--neutral-500);
  cursor: pointer;
  padding: var(--spacing-1);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.close-button:hover {
  background-color: var(--neutral-100);
  color: var(--neutral-900);
}

.modal-body {
  padding: var(--spacing-6);
}

.modal-footer {
  padding: var(--spacing-4) var(--spacing-6);
  border-top: 1px solid var(--neutral-200);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-3);
}

.review-question {
  position: relative;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Responsive Styles */
@media (max-width: 768px) {
  .results-summary {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .question-list {
    grid-template-columns: 1fr;
  }
  
  .confidence-options {
    flex-direction: column;
    align-items: center;
  }
  
  .confidence-option {
    width: 100%;
    max-width: 200px;
    text-align: center;
  }
}
</style>