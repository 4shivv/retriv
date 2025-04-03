<template>
  <div class="contact-page">
    <div class="container">
      <div class="contact-header">
        <h1 class="contact-title">Contact Us</h1>
        <p class="contact-subtitle">Have questions or feedback? We'd love to hear from you.</p>
      </div>

      <div class="contact-card">
        <div class="dog-icon">
          <img src="/dog.png" alt="Retriv Dog Logo" class="dog-logo"/>
        </div>

        <div class="contact-form-container">
          <form class="contact-form" @submit.prevent="submitForm">
            <div class="form-group">
              <label for="name">Your Name</label>
              <input type="text" id="name" v-model="formData.name" class="form-control" required>
            </div>
            
            <div class="form-group">
              <label for="email">Your Email</label>
              <input type="email" id="email" v-model="formData.email" class="form-control" required>
            </div>
            
            <div class="form-group">
              <label for="subject">Subject</label>
              <select id="subject" v-model="formData.subject" class="form-control" required>
                <option value="">Please select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="feedback">Product Feedback</option>
                <option value="billing">Billing Question</option>
                <option value="partnership">Partnership Opportunity</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="message">Your Message</label>
              <textarea id="message" v-model="formData.message" class="form-control" rows="5" required></textarea>
            </div>
            
            <button type="submit" class="btn btn-primary btn-block" :disabled="submitting">
              {{ submitting ? 'Sending...' : 'Send Message' }}
            </button>
            
            <div v-if="formSubmitted" class="form-success">
              Thank you for your message! We'll get back to you as soon as possible.
            </div>
          </form>
        </div>
        
        <div class="contact-info">
          <div class="contact-info-header">
            <h3>Quick Contact</h3>
            <p>You can also reach us directly via:</p>
          </div>
          
          <div class="contact-methods">
            <div class="contact-method">
              <div class="contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <a href="mailto:info@retriv.com">info@retriv.com</a>
            </div>
            
            <div class="contact-socials">
              <a href="#" class="social-link" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="#" class="social-link" aria-label="Discord">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 9.25H11.25a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h6.75a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25Z"></path>
                  <path d="M14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"></path>
                  <path d="M6.75 8.25h0a2.25 2.25 0 0 1-2.25-2.25v0a2.25 2.25 0 0 1 2.25-2.25h6.75a2.25 2.25 0 0 1 2.25 2.25v0a2.25 2.25 0 0 1-2.25 2.25h-.75a.75.75 0 0 0-.75.75V12"></path>
                  <path d="M5.25 12v8.25a.75.75 0 0 0 .75.75h3.75"></path>
                  <path d="M9 9.75v-3"></path>
                  <path d="M9 12.75h0a.75.75 0 0 1-.75-.75h0a.75.75 0 0 1 .75-.75h0a.75.75 0 0 1 .75.75h0a.75.75 0 0 1-.75.75Z"></path>
                </svg>
              </a>
              <a href="#" class="social-link" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
          
          <div class="response-time">
            <p>We typically respond to all inquiries within 24-48 hours during business days.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';

export default {
  name: 'ContactPage',
  setup() {
    const formData = reactive({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    const submitting = ref(false);
    const formSubmitted = ref(false);
    
    const submitForm = () => {
      submitting.value = true;
      
      // Simulate form submission delay
      setTimeout(() => {
        submitting.value = false;
        formSubmitted.value = true;
        
        // Reset form
        formData.name = '';
        formData.email = '';
        formData.subject = '';
        formData.message = '';
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          formSubmitted.value = false;
        }, 5000);
      }, 1500);
    };
    
    return {
      formData,
      submitting,
      formSubmitted,
      submitForm
    };
  }
}
</script>

<style scoped>
.contact-page {
  padding: 5rem 0;
  background-color: var(--neutral-50);
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.contact-header {
  margin-bottom: 3rem;
  text-align: center;
}

.contact-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--neutral-900);
  margin-bottom: 0.5rem;
}

.contact-subtitle {
  color: var(--neutral-600);
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto;
}

.contact-card {
  background-color: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.dog-icon {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border-radius: 50%;
  padding: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dog-logo {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
}

.contact-form-container {
  margin-top: 2rem;
  margin-bottom: 3rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--neutral-700);
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid var(--neutral-300);
  border-radius: 0.375rem;
  background-color: white;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-control:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 3px rgba(213, 141, 32, 0.1);
}

textarea.form-control {
  resize: vertical;
  min-height: 120px;
}

.btn-block {
  width: 100%;
  margin-top: 1rem;
}

.form-success {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #e6f4ea;
  color: #0d652d;
  border-radius: 0.375rem;
  text-align: center;
}

.contact-info {
  border-top: 1px solid var(--neutral-200);
  padding-top: 2rem;
}

.contact-info-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.contact-info-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--neutral-900);
}

.contact-info-header p {
  color: var(--neutral-600);
}

.contact-methods {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.contact-method {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.contact-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: var(--neutral-100);
  border-radius: 50%;
  color: var(--primary-color);
  flex-shrink: 0;
}

.contact-method a {
  color: var(--primary-color);
  font-weight: 500;
  text-decoration: none;
}

.contact-method a:hover {
  text-decoration: underline;
}

.contact-socials {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: var(--neutral-100);
  border-radius: 50%;
  color: var(--neutral-600);
  transition: all 0.2s;
}

.social-link:hover {
  background-color: var(--primary-color);
  color: white;
  transform: translateY(-2px);
}

.response-time {
  text-align: center;
  margin-top: 1.5rem;
  color: var(--neutral-500);
  font-size: 0.875rem;
}

.btn-primary {
  background: var(--primary-gradient);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .contact-title {
    font-size: 2rem;
  }
  
  .contact-card {
    padding: 2rem 1.5rem;
    margin-top: 3rem;
  }
  
  .dog-icon {
    top: -40px;
  }
  
  .dog-logo {
    width: 60px;
    height: 60px;
  }
}

@media (max-width: 576px) {
  .contact-page {
    padding: 3rem 0;
  }
}
</style>