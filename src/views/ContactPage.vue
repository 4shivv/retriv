<template>
  <div class="contact-page">
    <div class="container">
      <div class="contact-header">
        <h1 class="contact-title">Contact Us</h1>
        <p class="contact-subtitle">Have questions or feedback? We'd love to hear from you.</p>
      </div>

      <div class="contact-content">
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
          <div class="contact-info-card">
            <h3>Contact Information</h3>
            <div class="contact-detail">
              <div class="contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div>
                <strong>Phone</strong>
                <p>+1 (800) 555-1234</p>
              </div>
            </div>
            
            <div class="contact-detail">
              <div class="contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div>
                <strong>Email</strong>
                <p>info@retriv.com</p>
              </div>
            </div>
            
            <div class="contact-detail">
              <div class="contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div>
                <strong>Address</strong>
                <p>123 Learning Lane<br>San Francisco, CA 94105</p>
              </div>
            </div>
            
            <div class="contact-detail">
              <div class="contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div>
                <strong>Hours</strong>
                <p>Monday - Friday: 9am - 5pm PST<br>Weekend: Closed</p>
              </div>
            </div>
            
            <div class="contact-socials">
              <a href="#" class="social-link" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
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
              <a href="#" class="social-link" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
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

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.contact-form-container {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 2rem;
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

.contact-info-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  height: 100%;
}

.contact-info-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--neutral-900);
}

.contact-detail {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
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

.contact-detail strong {
  display: block;
  margin-bottom: 0.25rem;
  color: var(--neutral-900);
}

.contact-detail p {
  color: var(--neutral-600);
  line-height: 1.5;
  margin: 0;
}

.contact-socials {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
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

@media (max-width: 768px) {
  .contact-content {
    grid-template-columns: 1fr;
  }
  
  .contact-title {
    font-size: 2rem;
  }
  
  .contact-form-container {
    order: 2;
  }
  
  .contact-info {
    order: 1;
    margin-bottom: 2rem;
  }
}
</style>