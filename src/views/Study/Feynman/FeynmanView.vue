<template>
  <div class="feynman-page">
    <div class="page-header">
      <h1>Feynman Technique</h1>
      <p class="page-description">Deepen your understanding by explaining concepts in simple terms</p>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner-large"></div>
      <p>Loading study material...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h2>Error Loading Material</h2>
      <p>{{ error }}</p>
      <button @click="goToMaterials" class="btn btn-primary">
        Back to Materials
      </button>
    </div>
    
    <!-- Main Content -->
    <div v-else-if="material" class="main-content">
      <!-- Feynman Form Component -->
      <feynman-form
        :material-id="material.id"
        :title="material.title"
        :content="material.content"
        @reset="goToMaterials"
        @completed="handleCompleted"
        @open-chat="handleOpenChat"
      ></feynman-form>
    </div>
    
    <!-- Chat Modal -->
    <teleport to="body">
      <div v-if="showChatModal" class="chat-modal-overlay" @click="closeChatModal">
        <div class="chat-modal" @click.stop>
          <div class="chat-modal-header">
            <h3>Study Assistant</h3>
            <button @click="closeChatModal" class="close-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="chat-modal-body">
            <div class="chat-conversation">
              <div class="chat-messages" ref="chatMessagesContainer">
                <!-- Welcome message -->
                <div class="message system-message">
                  <p>Hi there! I'm your study assistant. I can help you understand "{{ material?.title }}" better. What questions do you have?</p>
                </div>
                
                <!-- Dynamic messages -->
                <div v-for="(message, index) in chatMessages" :key="index" 
                     :class="['message', message.type === 'user' ? 'user-message' : 'assistant-message', message.isLoading ? 'loading-message' : '']">
                  <p v-if="message.isLoading"><span class="loading-dots"><span>.</span><span>.</span><span>.</span></span></p>
                  <p v-else>{{ message.content }}</p>
                </div>
              </div>
              <div class="chat-input-container">
                <textarea 
                  class="chat-input" 
                  placeholder="Ask a question about the material..." 
                  v-model="chatInput"
                  @keydown.enter.prevent="sendChatMessage"
                ></textarea>
                <button class="send-button" @click="sendChatMessage">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </teleport>
    
    <!-- Results Modal -->
    <teleport to="body">
      <div v-if="showResultsModal" class="results-modal-overlay" @click="closeResultsModal">
        <div class="results-modal" @click.stop>
          <div class="results-modal-header">
            <h3>Feynman Technique Results</h3>
            <button @click="closeResultsModal" class="close-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="results-modal-body">
            <div class="understanding-score">
              <div class="score-circle" :class="getScoreClass(results.finalScore)">
                <span class="score-value">{{ results.finalScore }}%</span>
                <span class="score-label">Understanding</span>
              </div>
            </div>
            
            <div class="results-message">
              <p v-if="results.finalScore >= 85">
                <strong>Outstanding!</strong> You have a deeply developed understanding of this material.
              </p>
              <p v-else-if="results.finalScore >= 70">
                <strong>Great job!</strong> You have a solid grasp of this material.
              </p>
              <p v-else-if="results.finalScore >= 50">
                <strong>Good progress!</strong> You understand the basics, but could benefit from more review.
              </p>
              <p v-else>
                <strong>Keep practicing!</strong> This material still needs more focus to fully understand.
              </p>
            </div>
            
            <div class="next-steps">
              <p>A personalized review schedule has been created to help you retain this knowledge long-term.</p>
              <div class="review-info">
                <div class="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <div class="review-text">
                  <p>Your next review session is scheduled based on your performance. Check the dashboard for your next review date.</p>
                </div>
              </div>
            </div>
            
            <div class="results-actions">
              <button @click="closeResultsModal" class="btn btn-outline">
                Close
              </button>
              <button @click="goToMaterials" class="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Back to Materials
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import StudyService from '@/services/study.service';
import DeepseekService from '@/services/deepseek.service';
import FeynmanForm from '@/components/study/feynman/FeynmanForm.vue';

export default {
  name: 'FeynmanView',
  components: {
    FeynmanForm
  },
  
  setup() {
    const router = useRouter();
    const route = useRoute();
    
    // State
    const material = ref(null);
    const loading = ref(true);
    const error = ref('');
    
    // Results modal state
    const showResultsModal = ref(false);
    const results = ref({
      initialScore: 0,
      finalScore: 0
    });
    
    // Chat modal state
    const showChatModal = ref(false);
    const chatMessages = ref([]);
    const chatInput = ref('');
    const chatMessagesContainer = ref(null);
    const chatContext = ref(null);
    
    // Load the study material based on the route parameter
    const loadMaterial = async () => {
      const materialId = route.params.id;
      
      if (!materialId) {
        error.value = 'No material ID provided.';
        loading.value = false;
        return;
      }
      
      try {
        loading.value = true;
        
        // Get all materials and find the one matching the ID
        const materials = await StudyService.getStudyMaterials();
        const foundMaterial = materials.find(m => m.id === materialId);
        
        if (!foundMaterial) {
          error.value = 'Study material not found.';
          loading.value = false;
          return;
        }
        
        material.value = foundMaterial;
      } catch (err) {
        console.error('Error loading study material:', err);
        error.value = err.message || 'Failed to load study material';
      } finally {
        loading.value = false;
      }
    };
    
    // Navigation
    const goToMaterials = () => {
      router.push('/dashboard');
    };
    
    // Handle Feynman technique completion
    const handleCompleted = (completionData) => {
      results.value = {
        initialScore: completionData.initialScore || 0,
        finalScore: completionData.finalScore || 0
      };
      
      // Show the results modal
      showResultsModal.value = true;
    };
    
    const closeResultsModal = () => {
      showResultsModal.value = false;
    };
    
    // Get CSS class based on score
    const getScoreClass = (score) => {
      if (score >= 85) return 'excellent';
      if (score >= 70) return 'good';
      if (score >= 50) return 'fair';
      return 'needs-improvement';
    };
    
    // Chat Functions
    const handleOpenChat = (context) => {
      // Store context for AI to understand the user's current state
      chatContext.value = context;
      
      // Reset chat state
      chatMessages.value = [];
      chatInput.value = '';
      
      // Show the chat modal
      showChatModal.value = true;
      
      // Scroll to top of messages
      setTimeout(() => {
        if (chatMessagesContainer.value) {
          chatMessagesContainer.value.scrollTop = 0;
        }
      }, 100);
    };
    
    const closeChatModal = () => {
      showChatModal.value = false;
    };
    
    const scrollToBottom = () => {
      setTimeout(() => {
        if (chatMessagesContainer.value) {
          chatMessagesContainer.value.scrollTop = chatMessagesContainer.value.scrollHeight;
        }
      }, 50);
    };
    
    const sendChatMessage = async () => {
      if (!chatInput.value.trim()) return;
      
      // Add user message to chat
      chatMessages.value.push({
        type: 'user',
        content: chatInput.value
      });
      
      // Clear input
      const userQuestion = chatInput.value;
      chatInput.value = '';
      
      // Scroll to bottom after adding the user's message
      scrollToBottom();
      
      // Show loading indicator
      chatMessages.value.push({
        type: 'assistant',
        content: '',
        isLoading: true
      });
      
      // Scroll again to show the loading indicator
      scrollToBottom();
      
      try {
        // Call DeepseekService for AI response
        const response = await DeepseekService.generateStudyAssistantResponse({
          sourceContent: material.value.content,
          title: material.value.title,
          userQuestion,
          // Include any context about the study session
          context: chatContext.value,
          previousExchanges: chatMessages.value
            .filter(msg => !msg.isLoading)
            .map(msg => ({
              role: msg.type === 'user' ? 'user' : 'assistant',
              content: msg.content
            }))
        });
        
        // Remove loading message
        chatMessages.value = chatMessages.value.filter(msg => !msg.isLoading);
        
        // Add AI response
        chatMessages.value.push({
          type: 'assistant',
          content: response.answer
        });
        
        // Scroll to bottom after adding the AI's response
        scrollToBottom();
        
        // Save this exchange to the user's history
        try {
          await StudyService.saveStudyAssistantExchange({
            materialId: material.value.id,
            question: userQuestion,
            answer: response.answer,
            timestamp: new Date()
          });
        } catch (saveError) {
          console.error('Error saving study assistant exchange:', saveError);
          // Non-blocking error, user can still continue the conversation
        }
        
      } catch (error) {
        console.error('Error getting AI response:', error);
        
        // Remove loading message
        chatMessages.value = chatMessages.value.filter(msg => !msg.isLoading);
        
        // Create a simple fallback response
        let fallbackResponse = `I'm currently experiencing connection issues. Please try again later or ask your instructor for help with your question about "${material.value.title}".`;
        
        // Show fallback message
        chatMessages.value.push({
          type: 'assistant',
          content: fallbackResponse
        });
        
        // Scroll to bottom
        scrollToBottom();
      }
    };
    
    onMounted(() => {
      loadMaterial();
    });
    
    return {
      material,
      loading,
      error,
      goToMaterials,
      // Results modal
      showResultsModal,
      results,
      handleCompleted,
      closeResultsModal,
      getScoreClass,
      // Chat-related
      showChatModal,
      chatMessages,
      chatInput,
      chatMessagesContainer,
      handleOpenChat,
      closeChatModal,
      sendChatMessage
    };
  }
};
</script>

<style scoped>
.feynman-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--neutral-900);
  margin-bottom: 0.5rem;
}

.page-description {
  color: var(--neutral-600);
  font-size: 1.1rem;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
  color: var(--neutral-600);
}

.loading-spinner-large {
  width: 3rem;
  height: 3rem;
  border: 3px solid rgba(99, 102, 241, 0.2);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 5rem 0;
}

.error-icon {
  color: #ef4444;
  margin-bottom: 1.5rem;
}

.error-state h2 {
  font-size: 1.5rem;
  color: var(--neutral-900);
  margin-bottom: 1rem;
}

.error-state p {
  color: var(--neutral-700);
  max-width: 500px;
  margin: 0 auto 2rem;
}

/* Button Styles */
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background-color: var(--primary-color);
  border: 2px solid var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
  border-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(99, 102, 241, 0.25);
}

.btn-outline {
  background-color: white;
  border: 2px solid var(--neutral-300);
  color: var(--neutral-700);
}

.btn-outline:hover {
  border-color: var(--neutral-400);
  background-color: var(--neutral-100);
}

/* Chat Modal Styles */
.chat-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
}

.chat-modal {
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modalAppear 0.3s ease-out forwards;
  transform-origin: center center;
  will-change: transform, opacity;
}

/* Results Modal Styles */
.results-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
}

.results-modal {
  width: 90%;
  max-width: 550px;
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modalAppear 0.3s ease-out forwards;
}

.results-modal-header {
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--neutral-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.results-modal-header h3 {
  margin: 0;
  color: var(--neutral-900);
  font-weight: var(--font-weight-semibold);
}

.results-modal-body {
  padding: var(--spacing-6);
}

.understanding-score {
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-6);
}

.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  position: relative;
  background-color: white;
  overflow: hidden;
}

.score-circle::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  border-radius: 50%;
  opacity: 0.7;
}

.score-circle.excellent::before {
  background: linear-gradient(135deg, #10b981, #6ee7b7);
}

.score-circle.good::before {
  background: linear-gradient(135deg, #3b82f6, #93c5fd);
}

.score-circle.fair::before {
  background: linear-gradient(135deg, #f59e0b, #fcd34d);
}

.score-circle.needs-improvement::before {
  background: linear-gradient(135deg, #ef4444, #fca5a5);
}

.score-value {
  position: relative;
  z-index: 1;
  font-size: 2.25rem;
  font-weight: bold;
  color: white;
}

.score-label {
  position: relative;
  z-index: 1;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  margin-top: 0.25rem;
  color: rgba(255, 255, 255, 0.9);
}

.results-message {
  text-align: center;
  background-color: var(--neutral-50);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  margin-bottom: var(--spacing-6);
}

.results-message p {
  margin: 0;
  color: var(--neutral-800);
  font-size: 1.1rem;
  line-height: 1.5;
}

.next-steps {
  margin-bottom: var(--spacing-6);
}

.next-steps p {
  margin-bottom: var(--spacing-4);
  color: var(--neutral-700);
}

.review-info {
  display: flex;
  gap: var(--spacing-3);
  background-color: rgba(99, 102, 241, 0.05);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  margin-top: var(--spacing-4);
}

.info-icon {
  color: var(--primary-color);
  flex-shrink: 0;
}

.review-text p {
  margin: 0;
  color: var(--neutral-700);
  line-height: 1.5;
}

.results-actions {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-4);
  margin-top: var(--spacing-6);
}

@keyframes modalAppear {
  0% { opacity: 0; transform: scale(0.96) translateY(20px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

.chat-modal-header {
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--neutral-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-modal-header h3 {
  margin: 0;
  color: var(--neutral-900);
  font-weight: var(--font-weight-semibold);
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--neutral-500);
  padding: var(--spacing-1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  transition: all var(--transition-normal);
}

.close-button:hover {
  background-color: var(--neutral-100);
  color: var(--neutral-700);
}

.chat-modal-body {
  padding: 0;
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-conversation {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 70vh;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-4);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  scroll-behavior: smooth;
  max-height: calc(70vh - 120px);
}

.message {
  max-width: 85%;
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-lg);
  position: relative;
  animation: messageAppear 0.3s ease-out forwards;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  word-break: break-word;
}

@keyframes messageAppear {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

.system-message {
  background-color: var(--neutral-100);
  color: var(--neutral-700);
  align-self: center;
  margin-bottom: var(--spacing-4);
  text-align: center;
  font-style: italic;
  border-radius: var(--radius-md);
  padding: var(--spacing-3);
  font-size: var(--font-size-sm);
}

.user-message {
  background-color: var(--primary-color);
  color: white;
  align-self: flex-end;
  border-bottom-right-radius: var(--spacing-1);
}

.assistant-message {
  background-color: var(--neutral-100);
  color: var(--neutral-800);
  align-self: flex-start;
  border-bottom-left-radius: var(--spacing-1);
}

.message p {
  margin: 0;
  line-height: 1.5;
  white-space: pre-wrap;
}

.loading-message p {
  min-height: 24px;
}

.loading-dots span {
  animation: loadingDots 1.4s infinite;
  animation-fill-mode: both;
  font-size: 1.5rem;
  opacity: 0;
  display: inline-block;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes loadingDots {
  0% { opacity: 0; transform: translateY(0); }
  25% { opacity: 1; transform: translateY(-3px); }
  50% { opacity: 1; transform: translateY(0); }
  75% { opacity: 1; transform: translateY(3px); }
  100% { opacity: 0; transform: translateY(0); }
}

.chat-input-container {
  display: flex;
  padding: var(--spacing-3);
  border-top: 1px solid var(--neutral-200);
  background-color: white;
}

.chat-input {
  flex: 1;
  padding: var(--spacing-3);
  border: 1px solid var(--neutral-300);
  border-radius: var(--radius-md);
  resize: none;
  height: 60px;
  font-family: inherit;
  font-size: var(--font-size-md);
  line-height: 1.5;
  transition: border-color var(--transition-normal);
}

.chat-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.send-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  width: 60px;
  margin-left: var(--spacing-2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
}

.send-button:hover {
  background-color: var(--primary-dark);
  transform: translateY(-1px);
}

.send-button:active {
  transform: translateY(1px);
}

.mr-2 {
  margin-right: 0.5rem;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .feynman-page {
    padding: 1rem;
  }
  
  .page-header h1 {
    font-size: 1.75rem;
  }
  
  .page-description {
    font-size: 1rem;
  }
  
  .results-actions {
    flex-direction: column-reverse;
  }
  
  .results-actions .btn {
    width: 100%;
  }
}
</style>