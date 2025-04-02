<template>
  <div class="feynman-form card">
    <div class="card-header">
      <h3>Feynman Technique</h3>
      <div class="technique-badge">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6l-12 12"></path>
          <path d="M6 6l12 12"></path>
        </svg>
        <span>Active Learning</span>
      </div>
    </div>
    
    <div class="card-body">
      <!-- Display any error that occurred -->
      <div v-if="error" class="alert alert-danger mb-4">
        <div class="alert-content">
          <div class="alert-text">{{ error }}</div>
        </div>
      </div>
      
      <div class="instructions">
        <p>
          <strong>The Feynman Technique</strong> is one of the most effective learning methods. Explain the material in your own words, as if teaching it to someone else. This helps identify gaps in your understanding.
        </p>
        <ol class="feynman-steps">
          <li :class="{ 'active': currentStep === 1 }">Review the source material</li>
          <li :class="{ 'active': currentStep === 2 }">Explain it in your own simple words</li>
          <li :class="{ 'active': currentStep === 3 }">Identify gaps in your explanation</li>
          <li :class="{ 'active': currentStep === 4 }">Review, simplify, and use analogies</li>
        </ol>
      </div>
      
      <div class="original-content-section" v-if="currentStep === 1">
        <h4>Original Material</h4>
        <div class="original-content-container">
          <div class="original-content">{{ content }}</div>
          <button @click="proceedToExplanation" class="btn btn-primary">
            I've reviewed the material
          </button>
        </div>
      </div>
      
      <div class="explanation-section" v-if="currentStep === 2">
        <h4>Explain In Your Own Words</h4>
        <p class="explanation-guidance">
          Write an explanation as if you're teaching this concept to someone who has no prior knowledge of the subject. Use simple language and focus on the core ideas.
        </p>
        <div class="explanation-form">
          <div class="textarea-container">
            <textarea 
              v-model="userExplanation" 
              class="form-control"
              rows="8"
              placeholder="Start explaining the concept in your own words..."
              :disabled="loading || isRecording"
              autofocus
              ref="textareaRef"
            ></textarea>
            <div class="speech-controls">
              <div class="speech-buttons-container">
                <button 
                  type="button" 
                  @click="toggleSpeechRecognition" 
                  class="btn btn-speech" 
                  :class="{ 'recording': isRecording }"
                  :disabled="loading"
                  :title="isRecording ? 'Stop recording' : 'Start speech to text'"
                >
                  <svg v-if="!isRecording" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                </button>
                <div v-if="isRecording" class="recording-indicator">
                  <span class="recording-text">Recording...</span>
                  <span class="recording-dot"></span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="browserSupportsSpeech === false" class="speech-warning">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>Your browser doesn't support speech recognition. Please use Chrome or Edge browser for this feature.</span>
          </div>
          <div class="form-actions">
            <button @click="currentStep = 1" class="btn btn-outline" :disabled="loading">
              Back
            </button>
            <button @click="evaluateExplanation" class="btn btn-primary" :disabled="!canProceed || loading">
              <span v-if="loading" class="loading-spinner"></span>
              <span v-else>Analyze My Explanation</span>
            </button>
          </div>
        </div>
      </div>
      
      <div class="feedback-section" v-if="currentStep === 3 && feedback">
        <h4>Reflection & Feedback</h4>
        <div class="feedback-card">
          <div class="feedback-header">
            <div class="feedback-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
            </div>
            <h5>Analysis of Your Explanation</h5>
          </div>
          
          <div class="understanding-meter">
            <div class="meter-label">Understanding Level</div>
            <div class="meter-container">
              <div class="meter-fill" :style="{ width: `${understandingScore}%` }" :class="understandingClass"></div>
            </div>
            <div class="meter-value">{{ understandingScore }}%</div>
          </div>
          
          <div class="feedback-content">
            <div class="feedback-section-heading">What You Understood</div>
            <div class="feedback-text strengths-text">
              <p v-for="(strength, index) in feedback.strengths" :key="`strength-${index}`">
                {{ strength }}
              </p>
            </div>
            
            <div class="feedback-section-heading">What You Failed to Explain</div>
            <div class="feedback-text gaps-text">
              <p v-for="(gap, index) in feedback.gaps" :key="`gap-${index}`">
                {{ gap }}
              </p>
            </div>
            
            <div class="feedback-section-heading">Suggestions for Improvement</div>
            <div class="feedback-text suggestions-text">
              <p v-for="(suggestion, index) in feedback.suggestions" :key="`suggestion-${index}`">
                {{ suggestion }}
              </p>
            </div>
          </div>
        </div>
        
        <div class="step3-actions">
          <button @click="currentStep = 2" class="btn btn-outline">
            Revise My Explanation
          </button>
          <button @click="proceedToRefinement" class="btn btn-primary">
            Proceed to Refinement
          </button>
        </div>
      </div>
      
      <div class="refinement-section" v-if="currentStep === 4">
        <h4>Refine Your Understanding</h4>
        <p class="refinement-guidance">
          Based on the feedback, improve your explanation by filling gaps and simplifying concepts. Try using analogies or examples to make it even clearer.
        </p>
        <div class="refinement-form">
          <div class="textarea-container">
            <textarea 
              v-model="refinedExplanation" 
              class="form-control"
              rows="8"
              placeholder="Refine your explanation based on the feedback..."
              :disabled="refiningLoading || isRefiningRecording"
              autofocus
              ref="refinementTextareaRef"
            ></textarea>
            <div class="speech-controls">
              <div class="speech-buttons-container">
                <button 
                  type="button" 
                  @click="toggleRefinementSpeechRecognition" 
                  class="btn btn-speech" 
                  :class="{ 'recording': isRefiningRecording }"
                  :disabled="refiningLoading"
                  :title="isRefiningRecording ? 'Stop recording' : 'Start speech to text'"
                >
                  <svg v-if="!isRefiningRecording" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                </button>
                <div v-if="isRefiningRecording" class="recording-indicator">
                  <span class="recording-text">Recording...</span>
                  <span class="recording-dot"></span>
                </div>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button @click="currentStep = 3" class="btn btn-outline" :disabled="refiningLoading">
              Back to Feedback
            </button>
            <button @click="saveExplanation" class="btn btn-primary" :disabled="!canSave || refiningLoading">
              <span v-if="refiningLoading" class="loading-spinner"></span>
              <span v-else>Save & Complete</span>
            </button>
          </div>
        </div>
      </div>
      
      <div class="completion-section" v-if="currentStep === 5">
        <div class="completion-card">
          <div class="completion-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h4>Feynman Technique Completed!</h4>
          <p>You've successfully completed the Feynman Technique. Your understanding of this material has improved significantly.</p>
          
          <div class="progress-summary">
            <div class="progress-item">
              <div class="progress-label">Initial Understanding</div>
              <div class="progress-bar-container">
                <div class="progress-bar-fill" :style="{ width: `${understandingScore}%` }" :class="understandingClass"></div>
              </div>
              <div class="progress-value">{{ understandingScore }}%</div>
            </div>
            
            <div class="progress-item">
              <div class="progress-label">Final Understanding</div>
              <div class="progress-bar-container">
                <div class="progress-bar-fill" :style="{ width: `${finalUnderstandingScore}%` }" :class="finalUnderstandingClass"></div>
              </div>
              <div class="progress-value">{{ finalUnderstandingScore }}%</div>
            </div>
          </div>
          
          <div class="completion-actions">
            <button @click="handleReset" class="btn btn-primary">
              Study Something Else
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import DeepseekService from '@/services/deepseek.service';
import StudyService from '@/services/study.service';
import { auth } from '@/services/firebase';

export default {
  name: 'FeynmanForm',
  props: {
    materialId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  emits: ['reset', 'completed'],
  
  setup(props, { emit }) {
    const router = useRouter();
    
    // Form state
    const currentStep = ref(1);
    const userExplanation = ref('');
    const refinedExplanation = ref('');
    const loading = ref(false);
    const refiningLoading = ref(false);
    const error = ref('');
    const isRecording = ref(false);
    const isRefiningRecording = ref(false);
    const recognition = ref(null);
    const refinementRecognition = ref(null);
    const browserSupportsSpeech = ref(null);
    const textareaRef = ref(null);
    const refinementTextareaRef = ref(null);
    
    // Feedback state
    const feedback = ref(null);
    const understandingScore = ref(0);
    const finalUnderstandingScore = ref(0);
    
    // Computed properties
    const canProceed = computed(() => {
      return userExplanation.value.trim().length > 50;
    });
    
    const canSave = computed(() => {
      return refinedExplanation.value.trim().length > 50;
    });
    
    const understandingClass = computed(() => {
      if (understandingScore.value >= 80) return 'excellent';
      if (understandingScore.value >= 60) return 'good';
      if (understandingScore.value >= 40) return 'fair';
      return 'needs-work';
    });
    
    const finalUnderstandingClass = computed(() => {
      if (finalUnderstandingScore.value >= 80) return 'excellent';
      if (finalUnderstandingScore.value >= 60) return 'good';
      if (finalUnderstandingScore.value >= 40) return 'fair';
      return 'needs-work';
    });
    
    // Methods
    const proceedToExplanation = () => {
      currentStep.value = 2;
    };
    
    const evaluateExplanation = async () => {
      if (!canProceed.value) return;
      
      loading.value = true;
      error.value = '';
      
      try {
        // Check authentication
        if (!auth.currentUser) {
          error.value = "You must be logged in to use the Feynman technique";
          router.push('/login');
          return;
        }
        
        // Call DeepSeek API to analyze the explanation
        const result = await DeepseekService.evaluateFeynmanExplanation(
          props.content,
          userExplanation.value
        );
        
        // Update the feedback state
        feedback.value = result.feedback;
        understandingScore.value = result.understandingScore;
        
        // Move to the next step
        currentStep.value = 3;
        
        // Record this Feynman attempt in spaced repetition system
        // This will help track when to review this material again
        try {
          await StudyService.saveStudyAttempt(
            props.materialId, 
            userExplanation.value, 
            understandingScore.value
          );
        } catch (spacedRepErr) {
          console.error('Error recording attempt for spaced repetition:', spacedRepErr);
          // Don't show this error to the user, as the core functionality still worked
        }
      } catch (err) {
        console.error('Error evaluating explanation:', err);
        error.value = err.message || 'Failed to evaluate your explanation';
      } finally {
        loading.value = false;
      }
    };
    
    const proceedToRefinement = () => {
      // Pre-populate with the original explanation
      refinedExplanation.value = userExplanation.value;
      currentStep.value = 4;
    };
    
    const saveExplanation = async () => {
      if (!canSave.value) return;
      
      refiningLoading.value = true;
      error.value = '';
      
      try {
        // Check authentication
        if (!auth.currentUser) {
          error.value = "You must be logged in to save your work";
          router.push('/login');
          return;
        }
        
        // Call DeepSeek API to get the final evaluation
        const finalEvaluation = await DeepseekService.evaluateFeynmanExplanation(
          props.content,
          refinedExplanation.value
        );
        
        // Update the final understanding score
        finalUnderstandingScore.value = finalEvaluation.understandingScore || understandingScore.value + 10;
        
        // Save the feynman technique session
        await StudyService.saveFeynmanSession(
          props.materialId,
          props.title,
          userExplanation.value,
          refinedExplanation.value,
          feedback.value,
          understandingScore.value,
          finalUnderstandingScore.value
        );
        
        // Record the final attempt to generate a spaced repetition schedule
        // This will create review dates based on performance
        try {
          const attemptId = await StudyService.saveStudyAttempt(
            props.materialId, 
            refinedExplanation.value, 
            finalUnderstandingScore.value
          );
          
          // Generate a spaced repetition schedule based on performance
          await StudyService.generateSpacedRepetitionSchedule(
            attemptId,
            finalUnderstandingScore.value
          );
        } catch (spacedRepErr) {
          console.error('Error generating spaced repetition schedule:', spacedRepErr);
          // Don't show this error to the user as the core functionality still worked
        }
        
        // Move to completion step
        currentStep.value = 5;
        
        // Emit completed event
        emit('completed', {
          initialScore: understandingScore.value,
          finalScore: finalUnderstandingScore.value
        });
      } catch (err) {
        console.error('Error saving explanation:', err);
        error.value = err.message || 'Failed to save your explanation';
      } finally {
        refiningLoading.value = false;
      }
    };
    
    // Initialize speech recognition
    const initSpeechRecognition = () => {
      // Check if the browser supports speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        console.log('Speech recognition not supported by your browser');
        browserSupportsSpeech.value = false;
        return;
      }
      
      browserSupportsSpeech.value = true;
      
      // Initialize explanation speech recognition
      recognition.value = new SpeechRecognition();
      recognition.value.continuous = true;
      recognition.value.interimResults = true;
      recognition.value.lang = 'en-US'; // Default to English
      
      // Set up event handlers for explanation
      recognition.value.onresult = (event) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        // Append final transcript to the textarea
        if (finalTranscript) {
          // Add a space if there's already text and it doesn't end with a space
          const needsSpace = userExplanation.value && !userExplanation.value.endsWith(' ');
          userExplanation.value += (needsSpace ? ' ' : '') + finalTranscript;
        }
      };
      
      recognition.value.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        isRecording.value = false;
        
        if (event.error === 'not-allowed') {
          error.value = 'Microphone access denied. Please check your browser settings.';
        }
      };
      
      recognition.value.onend = () => {
        // Only set isRecording to false if we didn't manually stop
        // (This helps prevent the recognition from stopping unexpectedly)
        if (isRecording.value) {
          try {
            recognition.value.start();
          } catch (e) {
            console.log('Recognition already started');
            isRecording.value = false;
          }
        }
      };
      
      // Initialize refinement speech recognition
      refinementRecognition.value = new SpeechRecognition();
      refinementRecognition.value.continuous = true;
      refinementRecognition.value.interimResults = true;
      refinementRecognition.value.lang = 'en-US'; // Default to English
      
      // Set up event handlers for refinement
      refinementRecognition.value.onresult = (event) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        // Append final transcript to the refinement textarea
        if (finalTranscript) {
          // Add a space if there's already text and it doesn't end with a space
          const needsSpace = refinedExplanation.value && !refinedExplanation.value.endsWith(' ');
          refinedExplanation.value += (needsSpace ? ' ' : '') + finalTranscript;
        }
      };
      
      refinementRecognition.value.onerror = (event) => {
        console.error('Refinement speech recognition error', event.error);
        isRefiningRecording.value = false;
        
        if (event.error === 'not-allowed') {
          error.value = 'Microphone access denied. Please check your browser settings.';
        }
      };
      
      refinementRecognition.value.onend = () => {
        // Only set isRefiningRecording to false if we didn't manually stop
        if (isRefiningRecording.value) {
          try {
            refinementRecognition.value.start();
          } catch (e) {
            console.log('Refinement recognition already started');
            isRefiningRecording.value = false;
          }
        }
      };
    };
    
    // Toggle speech recognition on/off
    const toggleSpeechRecognition = () => {
      if (!browserSupportsSpeech.value) {
        return;
      }
      
      if (isRecording.value) {
        // Stop recording
        try {
          recognition.value.stop();
          isRecording.value = false;
        } catch (e) {
          console.error('Error stopping recognition', e);
        }
      } else {
        // Start recording
        try {
          recognition.value.start();
          isRecording.value = true;
          
          // Focus the textarea after starting recording
          if (textareaRef.value) {
            textareaRef.value.focus();
          }
        } catch (e) {
          console.error('Error starting recognition', e);
          error.value = 'Could not start speech recognition. Please try again.';
        }
      }
    };
    
    const toggleRefinementSpeechRecognition = () => {
      if (!browserSupportsSpeech.value) {
        return;
      }
      
      if (isRefiningRecording.value) {
        // Stop recording
        try {
          refinementRecognition.value.stop();
          isRefiningRecording.value = false;
        } catch (e) {
          console.error('Error stopping refinement recognition', e);
        }
      } else {
        // Start recording
        try {
          refinementRecognition.value.start();
          isRefiningRecording.value = true;
          
          // Focus the textarea after starting recording
          if (refinementTextareaRef.value) {
            refinementTextareaRef.value.focus();
          }
        } catch (e) {
          console.error('Error starting refinement recognition', e);
          error.value = 'Could not start speech recognition. Please try again.';
        }
      }
    };
    
    const handleReset = () => {
      emit('reset');
    };
    
    // Initialize speech recognition on component mount
    onMounted(() => {
      // Initialize speech recognition
      initSpeechRecognition();
    });
    
    // Clean up resources when the component is unmounted
    onBeforeUnmount(() => {
      // Stop speech recognition if it's running
      if (recognition.value && isRecording.value) {
        try {
          recognition.value.stop();
          isRecording.value = false;
        } catch (e) {
          console.error('Error stopping recognition on unmount', e);
        }
      }
      
      // Stop refinement speech recognition if it's running
      if (refinementRecognition.value && isRefiningRecording.value) {
        try {
          refinementRecognition.value.stop();
          isRefiningRecording.value = false;
        } catch (e) {
          console.error('Error stopping refinement recognition on unmount', e);
        }
      }
    });
    
    return {
      currentStep,
      userExplanation,
      refinedExplanation,
      loading,
      refiningLoading,
      error,
      feedback,
      understandingScore,
      finalUnderstandingScore,
      canProceed,
      canSave,
      understandingClass,
      finalUnderstandingClass,
      proceedToExplanation,
      evaluateExplanation,
      proceedToRefinement,
      saveExplanation,
      handleReset,
      isRecording,
      isRefiningRecording,
      browserSupportsSpeech,
      textareaRef,
      refinementTextareaRef,
      toggleSpeechRecognition,
      toggleRefinementSpeechRecognition
    };
  }
};
</script>

<style scoped>
.feynman-form {
  margin-bottom: var(--spacing-lg);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.technique-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: 0.35rem 0.75rem;
  background-color: rgba(99, 102, 241, 0.1);
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-medium);
  color: var(--primary-color);
  font-size: var(--font-size-sm);
}

.instructions {
  margin-bottom: var(--spacing-6);
  padding: var(--spacing-4);
  background-color: rgba(99, 102, 241, 0.05);
  border-left: 3px solid var(--primary-color);
  border-radius: var(--radius-md);
}

.feynman-steps {
  margin-top: var(--spacing-4);
  list-style-position: inside;
  counter-reset: step;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-4);
  padding: 0;
}

.feynman-steps li {
  flex: 1;
  min-width: 150px;
  position: relative;
  padding: var(--spacing-3) var(--spacing-4);
  background-color: white;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-md);
  margin-left: 0;
  font-size: var(--font-size-sm);
  counter-increment: step;
  display: flex;
  align-items: center;
  transition: all var(--transition-normal);
}

.feynman-steps li::before {
  content: counter(step);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: var(--neutral-100);
  border-radius: var(--radius-full);
  margin-right: var(--spacing-2);
  font-weight: var(--font-weight-bold);
  color: var(--neutral-600);
  transition: all var(--transition-normal);
}

.feynman-steps li.active {
  border-color: var(--primary-color);
  background-color: rgba(99, 102, 241, 0.05);
  font-weight: var(--font-weight-semibold);
}

.feynman-steps li.active::before {
  background-color: var(--primary-color);
  color: white;
}

/* Original content section */
.original-content-section {
  margin-bottom: var(--spacing-6);
}

.original-content-section h4 {
  margin-bottom: var(--spacing-3);
  color: var(--neutral-800);
  font-weight: var(--font-weight-semibold);
}

.original-content-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.original-content {
  padding: var(--spacing-4);
  background-color: white;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-md);
  max-height: 300px;
  overflow-y: auto;
  line-height: 1.6;
}

/* Explanation section */
.explanation-section {
  margin-bottom: var(--spacing-6);
}

.explanation-section h4 {
  margin-bottom: var(--spacing-3);
  color: var(--neutral-800);
  font-weight: var(--font-weight-semibold);
}

.explanation-guidance {
  margin-bottom: var(--spacing-4);
  color: var(--neutral-700);
  font-size: var(--font-size-sm);
}

.explanation-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.form-control {
  width: 100%;
  padding: var(--spacing-3);
  border: 1px solid var(--neutral-300);
  border-radius: var(--radius-md);
  line-height: 1.6;
  transition: border var(--transition-normal);
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-4);
}

.btn {
  padding: 0.6rem 1.2rem;
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

.btn-outline:hover:not(:disabled) {
  border-color: var(--neutral-400);
  background-color: var(--neutral-100);
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Feedback section */
.feedback-section {
  margin-bottom: var(--spacing-6);
}

.feedback-section h4 {
  margin-bottom: var(--spacing-3);
  color: var(--neutral-800);
  font-weight: var(--font-weight-semibold);
}

.feedback-card {
  padding: var(--spacing-6);
  background-color: white;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  margin-bottom: var(--spacing-5);
}

.feedback-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-4);
}

.feedback-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(99, 102, 241, 0.1);
  border-radius: var(--radius-md);
  color: var(--primary-color);
}

.feedback-header h5 {
  margin: 0;
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-900);
}

.understanding-meter {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-6);
  margin-top: var(--spacing-4);
  gap: var(--spacing-4);
}

.meter-label {
  min-width: 140px;
  font-weight: var(--font-weight-medium);
  color: var(--neutral-700);
}

.meter-container {
  flex: 1;
  height: 10px;
  background-color: var(--neutral-200);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
}

.meter-fill.excellent {
  background-color: #10b981;
}

.meter-fill.good {
  background-color: #3b82f6;
}

.meter-fill.fair {
  background-color: #f59e0b;
}

.meter-fill.needs-work {
  background-color: #ef4444;
}

.meter-value {
  min-width: 40px;
  text-align: right;
  font-weight: var(--font-weight-bold);
  color: var(--neutral-800);
}

.feedback-content {
  margin-bottom: var(--spacing-5);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-5);
}

.feedback-section-heading {
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-800);
  margin-bottom: var(--spacing-3);
  margin-top: var(--spacing-5);
  font-size: 1.05rem;
}

.feedback-text {
  margin: 0;
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-4);
  box-shadow: var(--shadow-sm);
}

.feedback-text p {
  margin-bottom: var(--spacing-3);
  line-height: 1.6;
  word-wrap: break-word;
  font-size: 1rem;
}

.feedback-text p:last-child {
  margin-bottom: 0;
}

.strengths-text {
  background-color: rgba(16, 185, 129, 0.1);
  border-left: 3px solid #10b981;
}

.strengths-text p {
  color: #10b981;
}

.gaps-text {
  background-color: rgba(239, 68, 68, 0.1);
  border-left: 3px solid #ef4444;
}

.gaps-text p {
  color: #ef4444;
}

.suggestions-text {
  background-color: rgba(99, 102, 241, 0.1);
  border-left: 3px solid var(--primary-color);
}

.suggestions-text p {
  color: var(--neutral-700);
}

.step3-actions {
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-6);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--neutral-200);
}

.feedback-actions {
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-5);
}

/* Refinement section */
.refinement-section {
  margin-bottom: var(--spacing-6);
}

.refinement-section h4 {
  margin-bottom: var(--spacing-3);
  color: var(--neutral-800);
  font-weight: var(--font-weight-semibold);
}

.refinement-guidance {
  margin-bottom: var(--spacing-4);
  color: var(--neutral-700);
  font-size: var(--font-size-sm);
}

.refinement-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

/* Completion section */
.completion-section {
  margin-bottom: var(--spacing-6);
}

.completion-card {
  text-align: center;
  padding: var(--spacing-6);
  background-color: white;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.completion-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--spacing-4);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(16, 185, 129, 0.1);
  border-radius: var(--radius-full);
  color: #10b981;
}

.completion-card h4 {
  margin-bottom: var(--spacing-3);
  color: var(--neutral-900);
  font-weight: var(--font-weight-bold);
}

.completion-card p {
  margin-bottom: var(--spacing-5);
  color: var(--neutral-700);
}

.progress-summary {
  margin-bottom: var(--spacing-6);
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.progress-item {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-3);
  gap: var(--spacing-3);
}

.progress-label {
  min-width: 140px;
  text-align: left;
  font-weight: var(--font-weight-medium);
  color: var(--neutral-700);
}

.progress-bar-container {
  flex: 1;
  height: 10px;
  background-color: var(--neutral-200);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
}

.progress-value {
  min-width: 40px;
  text-align: right;
  font-weight: var(--font-weight-bold);
  color: var(--neutral-800);
}

.completion-actions {
  display: flex;
  justify-content: center;
}

/* Textarea with Speech Controls */
.textarea-container {
  position: relative;
}

.speech-controls {
  position: absolute;
  bottom: var(--spacing-3);
  right: var(--spacing-3);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  z-index: 10;
}

.speech-buttons-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  background-color: rgba(255, 255, 255, 0.9);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--neutral-200);
}

.btn-speech {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--neutral-100);
  color: var(--neutral-600);
  border: 1px solid var(--neutral-300);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
  margin: 0;
  flex-shrink: 0;
}

.btn-speech:hover {
  background-color: var(--neutral-200);
  color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-speech.recording {
  background-color: #ef4444;
  color: white;
  border-color: #ef4444;
  animation: pulse-recording 2s infinite;
}

.btn-speech:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
}

.btn-speech svg {
  margin: 0;
  padding: 0;
  width: 20px;
  height: 20px;
}

@keyframes pulse-recording {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

.recording-indicator {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: #ef4444;
  white-space: nowrap;
  margin-left: var(--spacing-2);
}

.recording-text {
  white-space: nowrap;
}

.recording-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ef4444;
  animation: blink 1s infinite;
  flex-shrink: 0;
}

@keyframes blink {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}

.speech-warning {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-top: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  background-color: rgba(250, 204, 21, 0.1);
  color: #b45309;
  font-size: var(--font-size-xs);
}

/* Loading spinner */
.loading-spinner {
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Alert styling */
.alert {
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-4);
}

.alert-danger {
  background-color: rgba(239, 68, 68, 0.1);
  color: #b91c1c;
  border-left: 3px solid #ef4444;
}

.mb-4 {
  margin-bottom: var(--spacing-4);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .feynman-steps {
    flex-direction: column;
  }
  
  .form-actions, .feedback-actions {
    flex-direction: column;
    gap: var(--spacing-3);
  }
  
  .btn {
    width: 100%;
  }
  
  .understanding-meter, .progress-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-2);
  }
  
  .meter-container, .progress-bar-container {
    width: 100%;
  }
  
  .meter-value, .progress-value {
    text-align: left;
  }
}
</style>