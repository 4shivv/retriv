<template>
  <div class="faq-page">
    <div class="container">
      <div class="faq-header">
        <h1 class="faq-title">Frequently Asked Questions</h1>
        <p class="faq-subtitle">Find answers to common questions about Retriv</p>
      </div>

      <div class="faq-content">
        <div class="faq-section">
          <div class="faq-item" v-for="(faq, index) in faqs" :key="index">
            <div class="faq-question" @click="toggleFaq(index)" :class="{ 'active': activeFaq === index }">
              <h3>{{ faq.question }}</h3>
              <div class="faq-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 5v14M5 12h14" v-if="activeFaq !== index"></path>
                  <path d="M5 12h14" v-else></path>
                </svg>
              </div>
            </div>
            <div class="faq-answer" v-show="activeFaq === index">
              <p v-html="faq.answer"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'FAQPage',
  setup() {
    const activeFaq = ref(null);
    
    const toggleFaq = (index) => {
      activeFaq.value = activeFaq.value === index ? null : index;
    };
    
    const faqs = [
      {
        question: "What is Retriv?",
        answer: "Retriv is an innovative learning platform that utilizes cognitive science principles to help you learn faster and remember information longer. Our app is based on active recall techniques, spaced repetition, and voice-based learning."
      },
      {
        question: "How does the active recall technique work?",
        answer: "Active recall is a learning method where you actively stimulate memory during the learning process. Instead of passively reading or watching content, Retriv challenges you to retrieve information from memory, which strengthens neural connections and improves long-term retention."
      },
      {
        question: "Can I use Retriv on multiple devices?",
        answer: "Yes! Retriv is accessible across devices. You can start a learning session on your computer and continue on your mobile device. Your progress and learning materials are automatically synced across all platforms."
      },
      {
        question: "Is there a limit to how much content I can create?",
        answer: "The free version of Retriv allows you to create a limited number of learning materials. For unlimited content creation and additional premium features, you can upgrade to one of our paid plans."
      },
      {
        question: "How does voice input work?",
        answer: "Retriv uses advanced speech-to-text technology that allows you to create and practice with learning materials using just your voice. This hands-free approach makes learning possible even during commutes or other activities."
      },
      {
        question: "Is my data secure?",
        answer: "We take data security very seriously. All your learning materials and personal information are encrypted and stored securely. We never share your data with third parties without your explicit consent."
      }
    ];
    
    return {
      activeFaq,
      toggleFaq,
      faqs
    };
  }
}
</script>

<style scoped>
.faq-page {
  padding: 6rem 0;
  background-color: var(--neutral-50);
}

.faq-header {
  text-align: center;
  margin-bottom: 4rem;
}

.faq-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: 1rem;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.faq-subtitle {
  font-size: var(--font-size-lg);
  color: var(--neutral-600);
  max-width: 600px;
  margin: 0 auto;
}

.faq-section {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  margin-bottom: 1.5rem;
  border-radius: var(--radius-lg);
  background-color: white;
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: all var(--transition-normal);
}

.faq-item:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.faq-question {
  padding: 1.5rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color var(--transition-fast);
}

.faq-question:hover {
  background-color: var(--neutral-100);
}

.faq-question.active {
  background-color: var(--primary-color);
  color: white;
}

.faq-question h3 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

.faq-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--transition-normal);
}

.faq-question.active .faq-icon {
  transform: rotate(90deg);
}

.faq-answer {
  padding: 0 1.5rem 1.5rem;
  color: var(--neutral-700);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .faq-page {
    padding: 4rem 0;
  }
  
  .faq-title {
    font-size: var(--font-size-3xl);
  }
  
  .faq-question h3 {
    font-size: var(--font-size-md);
  }
}
</style>