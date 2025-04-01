<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-main">
        <div class="footer-brand">
          <div class="footer-logo">
            <div class="logo-mark">
              <span class="logo-icon">R</span>
            </div>
            <div class="logo-text">Retriv</div>
          </div>
          <p class="footer-tagline">
            Learn faster. Remember longer.
          </p>
          <div class="footer-socials">
            <a href="#" class="social-link" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
          </div>
        </div>

        <div class="footer-links">
          <!-- Different footer links for logged-out users -->
          <div class="footer-group" v-if="!isAuthenticated">
            <h3 class="footer-heading">Product</h3>
            <ul class="footer-list">
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#science">The Science</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">FAQs</a></li>
            </ul>
          </div>

          <!-- Different footer links for logged-in users -->
          <div class="footer-group" v-else>
            <h3 class="footer-heading">App</h3>
            <ul class="footer-list">
              <li><router-link to="/dashboard">Dashboard</router-link></li>
              <li><router-link to="/profile">Profile</router-link></li>
              <li><a href="#">Help Center</a></li>
            </ul>
          </div>

          <div class="footer-group">
            <h3 class="footer-heading">Resources</h3>
            <ul class="footer-list">
              <li><a href="#">Blog</a></li>
              <li><a href="#">Guides</a></li>
              <li><a href="#">Research</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>

          <div class="footer-group">
            <h3 class="footer-heading">Company</h3>
            <ul class="footer-list">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Press Kit</a></li>
            </ul>
          </div>

          <div class="footer-group">
            <h3 class="footer-heading">Legal</h3>
            <ul class="footer-list">
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-copyright">
          &copy; {{ currentYear }} Retriv. All rights reserved.
        </div>
        <div class="footer-locale">
          <button class="locale-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span>English (US)</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Footer Background -->
    <div class="footer-bg">
      <div class="footer-shape"></div>
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
  position: relative;
  background-color: var(--neutral-900);
  color: var(--neutral-200);
  padding-top: var(--spacing-16);
  padding-bottom: var(--spacing-8);
  overflow: hidden;
}

.footer-main {
  display: grid;
  grid-template-columns: 1.5fr repeat(4, 1fr);
  gap: var(--spacing-8);
  padding-bottom: var(--spacing-12);
  border-bottom: 1px solid var(--neutral-800);
  margin-bottom: var(--spacing-8);
}

.footer-brand {
  grid-column: span 1;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-6);
}

.logo-mark {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: var(--primary-gradient);
  color: white;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  border-radius: var(--radius-lg);
  font-family: var(--font-family-heading);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
}

.logo-icon::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0) 60%
  );
  transform: rotate(30deg);
}

.logo-text {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: white;
}

.footer-tagline {
  font-size: var(--font-size-md);
  color: var(--neutral-400);
  margin-bottom: var(--spacing-6);
}

.footer-socials {
  display: flex;
  gap: var(--spacing-4);
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background-color: var(--neutral-800);
  color: var(--neutral-300);
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
}

.social-link:hover {
  background-color: var(--neutral-700);
  color: white;
  transform: translateY(-2px);
}

.footer-links {
  grid-column: span 4;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-6);
}

.footer-heading {
  color: white;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-4);
}

.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-list li {
  margin-bottom: var(--spacing-3);
}

.footer-list a {
  color: var(--neutral-400);
  text-decoration: none;
  transition: color var(--transition-fast);
  font-size: var(--font-size-sm);
}

.footer-list a:hover {
  color: white;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-copyright {
  font-size: var(--font-size-sm);
  color: var(--neutral-500);
}

.locale-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  background-color: var(--neutral-800);
  border: none;
  color: var(--neutral-300);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.locale-button:hover {
  background-color: var(--neutral-700);
  color: white;
}

.footer-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.footer-shape {
  position: absolute;
  bottom: -50%;
  right: -10%;
  width: 70%;
  height: 70%;
  background: linear-gradient(to right, var(--primary-dark), var(--accent-color));
  opacity: 0.05;
  border-radius: 50%;
  filter: blur(100px);
}

@media (max-width: 992px) {
  .footer-main {
    grid-template-columns: 1fr 1fr;
  }
  
  .footer-brand {
    grid-column: span 2;
    margin-bottom: var(--spacing-8);
  }
  
  .footer-links {
    grid-column: span 2;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-8) var(--spacing-6);
  }
}

@media (max-width: 640px) {
  .footer {
    padding-top: var(--spacing-12);
  }
  
  .footer-main {
    grid-template-columns: 1fr;
    gap: var(--spacing-8);
  }
  
  .footer-brand {
    grid-column: span 1;
  }
  
  .footer-links {
    grid-column: span 1;
    grid-template-columns: 1fr;
    gap: var(--spacing-8);
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: var(--spacing-4);
    align-items: flex-start;
  }
}
</style>