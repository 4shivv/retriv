<template>
  <div class="feynman-technique">
    <!-- Study Assistant Chat Modal -->
    <div v-if="showChatModal" class="chat-modal-overlay">
      <div class="chat-modal">
        <div class="chat-modal-header">
          <h3>Study Assistant</h3>
          <button @click="showChatModal = false" class="close-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="chat-modal-body">
          <div class="chat-conversation">
            <div class="chat-messages">
              <!-- Welcome message -->
              <div class="message system-message">
                <p>Hi there! I'm your study assistant. How can I help you understand this material better?</p>
              </div>
              
              <!-- Dynamic messages -->
              <div v-for="(message, index) in chatMessages" :key="index" 
                   :class="['message', message.type === 'user' ? 'user-message' : 'assistant-message']">
                <p>{{ message.content }}</p>
              </div>
            </div>
            <div class="chat-input-container">
              <textarea class="chat-input" placeholder="Ask a question about the material..." v-model="chatInput"></textarea>
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
    <div v-if="showForm">
      <feynman-form
        :material-id="materialId"
        :title="title"
        :content="content"
        @reset="$emit('reset')"
        @completed="handleCompletion"
        @open-chat="handleOpenChat"
      />
    </div>
    <div v-else>
      <div class="feynman-header" v-if="nextReviewDate">
        <div class="next-review-alert">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>
            Next review scheduled for <strong>{{ formatReviewDate(nextReviewDate) }}</strong>
          </span>
        </div>
      </div>
      <feynman-view
        :material-id="materialId"
        :title="title"
        @start-feynman="showForm = true"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import FeynmanForm from './FeynmanForm.vue';
import FeynmanView from './FeynmanView.vue';
import StudyService from '@/services/study.service';
import DeepseekService from '@/services/deepseek.service';

export default {
  name: 'FeynmanTechnique',
  components: {
    FeynmanForm,
    FeynmanView
  },
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
    },
    startMode: {
      type: String,
      default: 'view', // 'view' or 'form'
      validator: (value) => ['view', 'form'].includes(value)
    }
  },
  emits: ['reset', 'completed', 'open-chat'],
  

  
  setup(props, { emit }) {
    const showForm = ref(props.startMode === 'form');
    const nextReviewDate = ref(null);
    const showChatModal = ref(false);
    const chatInput = ref('');
    const chatMessages = ref([]);
    const currentChatData = ref(null);
    
    const handleCompletion = (result) => {
      showForm.value = false;
      emit('completed', result);
      loadNextReviewDate(); // Refresh the review date after completion
    };
    
    const handleOpenChat = (chatData) => {
      // Store the chat data and show the modal
      currentChatData.value = chatData;
      showChatModal.value = true;
      
      // Clear previous chat messages
      chatMessages.value = [];
      
      // Also pass the chat data up to parent in case it wants to handle it
      emit('open-chat', chatData);
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
      
      // Show loading indicator
      chatMessages.value.push({
        type: 'assistant',
        content: '...',
        isLoading: true
      });
      
      try {
        // Call DeepseekService for AI response
        const sourceContent = currentChatData.value?.content || '';
        const title = currentChatData.value?.title || '';
        
        const response = await DeepseekService.generateStudyAssistantResponse({
          sourceContent,
          title,
          userQuestion,
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
        
        // Save this exchange to the user's history
        try {
          await StudyService.saveStudyAssistantExchange({
            materialId: props.materialId,
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
        
        // Create a simple fallback response based on the content
        let fallbackResponse = '';
        const title = currentChatData.value?.title || 'this material';
        
        // If the explanation is available, provide more specific feedback
        const userExplanation = currentChatData.value?.explanation || '';
        
        if (userExplanation) {
          if (userQuestion.toLowerCase().includes('how did i do') || 
              userQuestion.toLowerCase().includes('my explanation') || 
              userQuestion.toLowerCase().includes('give feedback')) {
            fallbackResponse = `Your explanation shows an effort to understand the key concepts. While I can't provide detailed AI feedback right now, try comparing your explanation with the original material to identify any gaps or misunderstandings. Focus on explaining concepts in your own words, as if teaching someone else.`;
          } else {
            fallbackResponse = `I see you're working with the Feynman technique, which is excellent for deepening understanding. While I can't access the AI service right now, continue working on explaining concepts in simple terms as if teaching someone else. This process will help you identify gaps in your knowledge.`;
          }
        } 
        // Generic responses based on question type
        else if (userQuestion.toLowerCase().includes('what is') || 
                userQuestion.toLowerCase().includes('define') || 
                userQuestion.toLowerCase().includes('explain')) {
          fallbackResponse = `I understand you're asking for an explanation related to ${title}. While I can't access the AI service right now, I can suggest reviewing the material carefully, focusing on key terms and concepts. The Feynman technique involves explaining concepts in simple terms as if teaching someone else.`;
        } else if (userQuestion.toLowerCase().includes('how') || 
                  userQuestion.toLowerCase().includes('process')) {
          fallbackResponse = `It seems you're asking about a process or method in ${title}. Try breaking down the content into smaller parts and explain each component in your own words. This approach helps identify areas where your understanding might be incomplete.`;
        } else if (userQuestion.toLowerCase().includes('why')) {
          fallbackResponse = `You're asking about reasons or rationales in ${title}. Consider the broader implications and connections between different concepts. When using the Feynman technique, asking 'why' questions helps deepen your understanding.`;
        } else {
          fallbackResponse = `I'm currently experiencing connection issues with the AI service. Please try again later or ask your instructor for help with your question about "${title}". Continue using the Feynman technique by explaining concepts in simple terms.`;
        }
        
        // Show fallback message
        chatMessages.value.push({
          type: 'assistant',
          content: fallbackResponse
        });
      }
    };
    
    // Load the next scheduled review date for this material
    const loadNextReviewDate = async () => {
      try {
        const reviewDate = await StudyService.getNextReviewDate(props.materialId);
        nextReviewDate.value = reviewDate;
      } catch (error) {
        console.error('Error loading next review date:', error);
      }
    };
    
    // Format the review date for display
    const formatReviewDate = (date) => {
      if (!date) return '';
      
      const now = new Date();
      const reviewDate = new Date(date);
      
      // If it's today
      if (reviewDate.toDateString() === now.toDateString()) {
        return `Today at ${reviewDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
      
      // If it's tomorrow
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (reviewDate.toDateString() === tomorrow.toDateString()) {
        return `Tomorrow at ${reviewDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
      
      // Otherwise show full date
      return reviewDate.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit'
      });
    };
    
    // Load the next review date when component mounts
    onMounted(() => {
      loadNextReviewDate();
    });
    
    return {
      showForm,
      nextReviewDate,
      handleCompletion,
      handleOpenChat,
      formatReviewDate,
      showChatModal,
      chatInput,
      chatMessages,
      currentChatData,
      sendChatMessage
    };
  }
};
</script>

<style scoped>
.feynman-technique {
  width: 100%;
}

.feynman-header {
  margin-bottom: var(--spacing-4);
}

.next-review-alert {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-4);
  background-color: rgba(99, 102, 241, 0.1);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--primary-color);
}

.next-review-alert svg {
  color: var(--primary-color);
  flex-shrink: 0;
}

.next-review-alert span {
  font-size: var(--font-size-sm);
  color: var(--neutral-800);
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
  z-index: 1000;
}

.chat-modal {
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
}

.message {
  max-width: 85%;
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-lg);
  position: relative;
  animation: messageAppear 0.3s ease-out forwards;
}

@keyframes messageAppear {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
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

@media (max-width: 768px) {
  .chat-modal {
    width: 95%;
    max-height: 90vh;
  }
  
  .message {
    max-width: 90%;
  }
}
</style>