<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-columns">
        <div class="footer-column">
          <h4 class="footer-heading">Company</h4>
          <ul class="footer-links">
            <li><router-link to="/about">About Us</router-link></li>
            <li><router-link to="/careers">Careers</router-link></li>
            <li><router-link to="/blog">Blog</router-link></li>
          </ul>
        </div>

        <div class="footer-column">
          <h4 class="footer-heading">Product</h4>
          <ul class="footer-links">
            <li><a href="#cta-section">Pricing</a></li>
            <li><router-link to="/faq">FAQs</router-link></li>
            <li><router-link to="/mobile-app">Mobile App</router-link></li>
          </ul>
        </div>

        <div class="footer-column">
          <h4 class="footer-heading">Resources</h4>
          <ul class="footer-links">
            <li><router-link to="/terms">Terms of Service</router-link></li>
            <li><router-link to="/privacy">Privacy Policy</router-link></li>
            <li><router-link to="/contact">Contact</router-link></li>
          </ul>
        </div>

        <div class="footer-column footer-app">
          <div class="app-logo">
            <img src="/dog.png" alt="Retriv Dog Logo" class="dog-logo">
            <span class="logo-text">Retriv</span>
          </div>
          <p class="app-tagline">Learn faster. Remember longer.</p>
          <div class="app-social">
            <a href="#" aria-label="Instagram" class="social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <a href="#" aria-label="Discord" class="social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 9.25H11.25a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h6.75a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25Z"/>
                <path d="M14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"/>
                <path d="M6.75 8.25h0a2.25 2.25 0 0 1-2.25-2.25v0a2.25 2.25 0 0 1 2.25-2.25h6.75a2.25 2.25 0 0 1 2.25 2.25v0a2.25 2.25 0 0 1-2.25 2.25h-.75a.75.75 0 0 0-.75.75V12"/>
                <path d="M5.25 12v8.25a.75.75 0 0 0 .75.75h3.75"/>
                <path d="M9 9.75v-3"/>
                <path d="M9 12.75h0a.75.75 0 0 1-.75-.75h0a.75.75 0 0 1 .75-.75h0a.75.75 0 0 1 .75.75h0a.75.75 0 0 1-.75.75Z"/>
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn" class="social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="copyright">
          &copy; {{ currentYear }} Retriv. All rights reserved.
        </div>
        <div class="language-selector">
          <button class="language-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="m2 12 20 0"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <span>English (US)</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'AppFooter',
  setup() {
    const store = useStore();
    
    const currentYear = computed(() => {
      return new Date().getFullYear();
    });
    
    // Check if user is authenticated
    const isAuthenticated = computed(() => {
      return store.getters['auth/isAuthenticated'];
    });

    return {
      currentYear,
      isAuthenticated
    };
  }
}
</script>

<style scoped>
.footer {
  background-color: #f9f9f9;
  border-top: 1px solid #eaeaea;
  padding: 60px 0 30px;
  color: var(--neutral-700);
  margin-top: 60px;
}

.footer-columns {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  margin-bottom: 40px;
}

.footer-column h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--neutral-900);
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: var(--neutral-600);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: var(--primary-color);
}

.footer-app {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.app-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.dog-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.logo-text {
  font-weight: 700;
  font-size: 20px;
  color: var(--neutral-900);
}

.app-tagline {
  font-size: 14px;
  color: var(--neutral-600);
  margin-bottom: 20px;
}

.app-social {
  display: flex;
  gap: 15px;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: var(--neutral-100);
  border-radius: 18px;
  color: var(--neutral-600);
  transition: all 0.2s ease;
}

.social-icon:hover {
  background-color: var(--primary-color);
  color: white;
  transform: translateY(-2px);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #eaeaea;
}

.copyright {
  font-size: 14px;
  color: var(--neutral-500);
}

.language-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--neutral-100);
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  color: var(--neutral-700);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.language-button:hover {
  background-color: var(--neutral-200);
}

@media (max-width: 1024px) {
  .footer-columns {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .footer-app {
    grid-column: span 3;
    margin-top: 20px;
    align-items: center;
  }
}

@media (max-width: 768px) {
  .footer-columns {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .footer-app {
    grid-column: span 2;
  }
}

@media (max-width: 576px) {
  .footer-columns {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .footer-app {
    grid-column: span 1;
    align-items: center;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 15px;
  }
  
  .footer {
    padding: 40px 0 20px;
  }
  
  .footer-column h4 {
    margin-bottom: 15px;
  }
}
</style>