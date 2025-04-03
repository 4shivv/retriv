<template>
  <div class="mobile-app-page">
    <div class="container">
      <div class="app-header">
        <h1 class="app-title">Retriv Mobile App</h1>
        <p class="app-subtitle">Learn anywhere, anytime with our mobile companion</p>
      </div>
      
      <div class="app-overview">
        <div class="app-mockup">
          <div class="mockup-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
              <rect width="7" height="12" x="8.5" y="2" rx="1"></rect>
              <path d="M8.5 19h7"></path>
              <path d="M7 6l1.5-1.5"></path>
              <path d="M16.5 4.5 18 6"></path>
              <path d="M7 18l1.5 1.5"></path>
              <path d="M16.5 19.5 18 18"></path>
              <path d="M12 11v-1.5"></path>
              <path d="M12 11v4h4"></path>
              <circle cx="12" cy="11" r="0.5"></circle>
            </svg>
            <p>Mobile App Mockup</p>
          </div>
        </div>
        
        <div class="app-content">
          <h2>Learning That Fits in Your Pocket</h2>
          <p>The Retriv mobile app brings our powerful active recall learning system to your smartphone, making it easy to learn on the go. Whether you're commuting, waiting in line, or taking a break, turn those moments into productive learning opportunities.</p>
          
          <h2>Key Features</h2>
          <ul class="features-list">
            <li>
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <div>
                <h3>Offline Learning</h3>
                <p>Download your study materials for access without an internet connection</p>
              </div>
            </li>
            <li>
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" x2="12" y1="19" y2="22"></line>
                </svg>
              </div>
              <div>
                <h3>Voice Input</h3>
                <p>Practice active recall by speaking your answers, perfect for hands-free learning</p>
              </div>
            </li>
            <li>
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="8"></circle>
                  <line x1="3" x2="6" y1="3" y2="6"></line>
                  <line x1="21" x2="18" y1="3" y2="6"></line>
                  <line x1="3" x2="6" y1="21" y2="18"></line>
                  <line x1="21" x2="18" y1="21" y2="18"></line>
                </svg>
              </div>
              <div>
                <h3>Smart Notifications</h3>
                <p>Receive reminders for review sessions at the optimal time for memory retention</p>
              </div>
            </li>
          </ul>
          
          <div class="app-cta">
            <p>Coming soon to iOS and Android</p>
            <div class="app-buttons">
              <button class="app-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path>
                  <path d="M10 2c1 .5 2 2 2 5"></path>
                </svg>
                App Store
              </button>
              <button class="app-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path>
                  <path d="m13 13 6 6"></path>
                </svg>
                Google Play
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="app-screenshots">
        <h2>App Screenshots</h2>
        <div class="screenshots-grid">
          <div class="screenshot">
            <div class="screen-placeholder">
              <p>Home Screen</p>
            </div>
          </div>
          <div class="screenshot">
            <div class="screen-placeholder">
              <p>Learning Mode</p>
            </div>
          </div>
          <div class="screenshot">
            <div class="screen-placeholder">
              <p>Progress Dashboard</p>
            </div>
          </div>
          <div class="screenshot">
            <div class="screen-placeholder">
              <p>Voice Input</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="beta-signup">
        <div class="beta-card">
          <h2>Join the Beta</h2>
          <p>Be among the first to try our mobile app and help shape its development.</p>
          <form class="beta-form" @submit.prevent="submitBetaForm">
            <div class="form-group">
              <input type="email" v-model="betaEmail" placeholder="Enter your email" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary">Sign Up for Beta</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'MobileAppPage',
  setup() {
    const betaEmail = ref('');
    
    const submitBetaForm = () => {
      alert('Thank you for your interest! We\'ll notify you when the beta is available.');
      betaEmail.value = '';
    };
    
    return {
      betaEmail,
      submitBetaForm
    };
  }
}
</script>

<style scoped>
.mobile-app-page {
  padding: 5rem 0;
  background-color: var(--neutral-50);
}

.app-header {
  text-align: center;
  margin-bottom: 4rem;
}

.app-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--neutral-900);
  margin-bottom: 1rem;
}

.app-subtitle {
  font-size: 1.25rem;
  color: var(--neutral-600);
  max-width: 700px;
  margin: 0 auto;
}

.app-overview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 5rem;
  align-items: center;
}

.app-mockup {
  display: flex;
  justify-content: center;
}

.mockup-placeholder {
  width: 300px;
  height: 600px;
  background-color: var(--neutral-100);
  border-radius: 32px;
  border: 8px solid var(--neutral-300);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--neutral-400);
}

.mockup-placeholder::before {
  content: '';
  position: absolute;
  top: 18px;
  width: 120px;
  height: 24px;
  background-color: var(--neutral-300);
  border-radius: 16px;
}

.mockup-placeholder svg {
  margin-bottom: 1rem;
}

.app-content h2 {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--neutral-900);
  margin-bottom: 1.5rem;
}

.app-content p {
  color: var(--neutral-700);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.features-list {
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
}

.features-list li {
  display: flex;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: var(--neutral-100);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  flex-shrink: 0;
}

.features-list h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--neutral-900);
  margin-bottom: 0.5rem;
}

.features-list p {
  margin-bottom: 0;
}

.app-cta {
  background-color: var(--neutral-100);
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
}

.app-cta p {
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
}

.app-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.app-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--neutral-900);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
}

.app-btn:hover {
  transform: translateY(-2px);
  background-color: var(--neutral-800);
}

.app-screenshots {
  margin-bottom: 5rem;
}

.app-screenshots h2 {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--neutral-900);
  margin-bottom: 2rem;
  text-align: center;
}

.screenshots-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.screenshot {
  height: 100%;
}

.screen-placeholder {
  background-color: var(--neutral-100);
  border: 2px solid var(--neutral-200);
  border-radius: 16px;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--neutral-400);
}

.beta-signup {
  display: flex;
  justify-content: center;
}

.beta-card {
  background: var(--primary-gradient);
  padding: 3rem;
  border-radius: 16px;
  text-align: center;
  color: white;
  max-width: 600px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.beta-card h2 {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.beta-card p {
  margin-bottom: 2rem;
  opacity: 0.9;
}

.beta-form {
  display: flex;
  gap: 1rem;
}

.beta-form .form-group {
  flex: 1;
}

.beta-form .form-control {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
}

.beta-form .btn-primary {
  background-color: var(--neutral-900);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
}

.beta-form .btn-primary:hover {
  background-color: var(--neutral-800);
}

@media (max-width: 992px) {
  .app-overview {
    grid-template-columns: 1fr;
  }
  
  .screenshots-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .beta-form {
    flex-direction: column;
  }
  
  .app-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .app-title {
    font-size: 2rem;
  }
}

@media (max-width: 576px) {
  .screenshots-grid {
    grid-template-columns: 1fr;
  }
  
  .mobile-app-page {
    padding: 3rem 0;
  }
}
</style>