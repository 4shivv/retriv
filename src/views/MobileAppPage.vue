<template>
  <div class="mobile-app-page">
    <div class="container">
      <div class="coming-soon-wrapper">
        <div class="coming-soon-content">
          <div class="app-icon">
            <img src="/dog.png" alt="Retriv Dog Logo" class="dog-logo"/>
          </div>
          <h1>Mobile App Coming Soon</h1>
          <p>We're working hard to bring the Retriv learning experience to your mobile device.</p>
          <p>Learn anywhere, anytime - whether you're driving, cooking, cleaning, or on the go.</p>
          
          <div class="features">
            <div class="feature">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <p>Offline Learning</p>
            </div>
            <div class="feature">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" x2="12" y1="19" y2="22"></line>
                </svg>
              </div>
              <p>Voice Input</p>
            </div>
            <div class="feature">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="8"></circle>
                  <line x1="3" x2="6" y1="3" y2="6"></line>
                  <line x1="21" x2="18" y1="3" y2="6"></line>
                  <line x1="3" x2="6" y1="21" y2="18"></line>
                  <line x1="21" x2="18" y1="21" y2="18"></line>
                </svg>
              </div>
              <p>Smart Notifications</p>
            </div>
          </div>
          
          <div class="notify-me">
            <h2>Get Notified on Launch</h2>
            <form class="notify-form" @submit.prevent="submitNotifyForm">
              <input type="email" v-model="notifyEmail" placeholder="Your email address" required>
              <button type="submit">Notify Me</button>
            </form>
          </div>
          
          <div class="platforms">
            <p>Coming soon to</p>
            <div class="platform-icons">
              <div class="platform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path>
                  <path d="M10 2c1 .5 2 2 2 5"></path>
                </svg>
                <span>iOS</span>
              </div>
              <div class="platform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path>
                  <path d="m13 13 6 6"></path>
                </svg>
                <span>Android</span>
              </div>
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
  name: 'MobileAppPage',
  setup() {
    const notifyEmail = ref('');
    
    const submitNotifyForm = () => {
      alert('Thank you for your interest! We\'ll notify you when the app is available.');
      notifyEmail.value = '';
    };
    
    return {
      notifyEmail,
      submitNotifyForm
    };
  }
}
</script>

<style scoped>
.mobile-app-page {
  padding: 5rem 0;
  background-color: var(--neutral-50);
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.coming-soon-wrapper {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.coming-soon-content {
  background-color: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.app-icon {
  margin-bottom: 2rem;
}

.dog-logo {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.coming-soon-content h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--neutral-900);
  margin-bottom: 1.5rem;
}

.coming-soon-content p {
  font-size: 1.1rem;
  color: var(--neutral-600);
  max-width: 600px;
  margin: 0 auto 0.5rem;
  line-height: 1.6;
}

.features {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 3rem 0;
}

.feature {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 150px;
}

.feature-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background-color: var(--neutral-100);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.feature p {
  font-weight: 500;
  color: var(--neutral-800);
}

.notify-me {
  margin: 3rem 0;
  padding: 2rem;
  background-color: var(--neutral-100);
  border-radius: 12px;
}

.notify-me h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--neutral-900);
}

.notify-form {
  display: flex;
  max-width: 500px;
  margin: 0 auto;
  gap: 0.5rem;
}

.notify-form input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--neutral-200);
  border-radius: 6px;
  font-size: 1rem;
}

.notify-form button {
  background: var(--primary-gradient);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: transform 0.2s;
}

.notify-form button:hover {
  transform: translateY(-2px);
}

.platforms {
  margin-top: 2rem;
}

.platforms p {
  font-size: 1rem;
  color: var(--neutral-500);
  margin-bottom: 1rem;
}

.platform-icons {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.platform {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.platform svg {
  width: 36px;
  height: 36px;
  color: var(--neutral-600);
}

.platform span {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--neutral-700);
}

@media (max-width: 768px) {
  .features {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    margin: 2rem 0;
  }
  
  .coming-soon-content h1 {
    font-size: 2rem;
  }
  
  .notify-form {
    flex-direction: column;
  }
  
  .coming-soon-content {
    padding: 2rem 1.5rem;
  }
}

@media (max-width: 576px) {
  .mobile-app-page {
    padding: 3rem 0;
  }
  
  .platform-icons {
    gap: 1rem;
  }
  
  .dog-logo {
    width: 80px;
    height: 80px;
  }
}
</style>