<template>
  <div class="auth-page">
    <div class="auth-page-content">
      <div class="auth-card">
        <div class="auth-card-body">
          <div class="auth-header">
            <div class="app-logo mb-6">
              <div class="logo-mark">
                <span class="logo-icon">R</span>
              </div>
            </div>
            <h1 class="auth-title">Create an account</h1>
            <p class="auth-subtitle">
              Join Retriv to learn faster and remember longer
            </p>
          </div>
          
          <div v-if="error" class="alert alert-danger mb-4">
            <div class="alert-content">
              <div class="alert-text">{{ error }}</div>
            </div>
          </div>
          
          <form @submit.prevent="handleSubmit" class="auth-form">
            <div class="form-group">
              <label for="email" class="form-label">Email address</label>
              <input
                type="email"
                id="email"
                v-model="email"
                class="form-control"
                placeholder="name@example.com"
                required
                autocomplete="email"
                :disabled="loading"
              />
            </div>
            
            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                id="password"
                v-model="password"
                class="form-control"
                placeholder="••••••••"
                required
                autocomplete="new-password"
                :disabled="loading"
              />
              <p class="form-text">
                Password must be at least 6 characters
              </p>
            </div>
            
            <div class="form-group">
              <label for="passwordConfirm" class="form-label">Confirm Password</label>
              <input
                type="password"
                id="passwordConfirm"
                v-model="passwordConfirm"
                class="form-control"
                placeholder="••••••••"
                required
                autocomplete="new-password"
                :disabled="loading"
              />
            </div>
            
            <div class="form-group mt-6">
              <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
                <span v-if="loading" class="loading-spinner"></span>
                <span v-else>Create account</span>
              </button>
            </div>
          </form>
          
          <div class="auth-divider">
            <span>or register with</span>
          </div>
          
          <div class="social-login mb-6">
            <button 
              @click="handleGoogleLogin" 
              class="social-btn google-btn"
              :disabled="loading"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2C17.64 8.57 17.58 7.96 17.47 7.36H9V10.46H13.84C13.63 11.36 13.01 12.14 12.12 12.66V14.66H15C16.66 13.14 17.64 11.36 17.64 9.2Z" fill="#4285F4"/>
                <path d="M9 18C11.43 18 13.47 17.21 15 14.66L12.12 12.66C11.36 13.22 10.31 13.56 9 13.56C6.65 13.56 4.67 12.01 3.96 9.89H1V11.96C2.52 15.45 5.55 18 9 18Z" fill="#34A853"/>
                <path d="M3.96 9.89C3.78 9.36 3.68 8.79 3.68 8.2C3.68 7.61 3.78 7.04 3.96 6.51V4.44H1C0.36 5.59 0 6.86 0 8.2C0 9.54 0.36 10.81 1 11.96L3.96 9.89Z" fill="#FBBC05"/>
                <path d="M9 3.2C10.32 3.2 11.5 3.65 12.45 4.48L15 2.1C13.46 0.8 11.43 0 9 0C5.55 0 2.52 2.55 1 6.04L3.96 8.11C4.67 5.99 6.65 3.2 9 3.2Z" fill="#EA4335"/>
              </svg>
              <span>Google</span>
            </button>
          </div>
          
          <div class="auth-footer">
            <p class="text-center mb-0">
              Already have an account? <router-link to="/login" class="font-medium">Sign in</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Decorative background elements -->
    <div class="auth-bg">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
      <div class="shape shape-4"></div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import AuthService from '@/services/auth.service';

export default {
  name: 'RegisterPage',
  
  setup() {
    const email = ref('');
    const password = ref('');
    const passwordConfirm = ref('');
    const error = ref('');
    const loading = ref(false);
    
    const router = useRouter();
    const store = useStore();
    
    const passwordsMatch = computed(() => {
      return password.value === passwordConfirm.value;
    });
    
    const handleSubmit = async () => {
      try {
        loading.value = true;
        error.value = '';
        
        if (!passwordsMatch.value) {
          error.value = 'Passwords do not match';
          return;
        }
        
        if (password.value.length < 6) {
          error.value = 'Password must be at least 6 characters long';
          return;
        }
        
        const user = await AuthService.register(email.value, password.value);
        store.dispatch('auth/setUser', user);
        router.push('/dashboard');
      } catch (err) {
        error.value = err.message || 'Failed to create account';
      } finally {
        loading.value = false;
      }
    };
    
    const handleGoogleLogin = async () => {
      try {
        loading.value = true;
        error.value = '';
        
        const user = await AuthService.loginWithGoogle();
        store.dispatch('auth/setUser', user);
        router.push('/dashboard');
      } catch (err) {
        error.value = err.message || 'Failed to sign up with Google';
      } finally {
        loading.value = false;
      }
    };
    
    return {
      email,
      password,
      passwordConfirm,
      error,
      loading,
      handleSubmit,
      handleGoogleLogin
    };
  }
}
</script>

<style scoped>
/* Same styles as LoginPage.vue */
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: var(--spacing-6) var(--spacing-4);
  overflow: hidden;
  background-color: var(--neutral-50);
}

.auth-page-content {
  width: 100%;
  max-width: 28rem;
  position: relative;
  z-index: 10;
}

.auth-card {
  background-color: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out forwards;
}

.auth-card-body {
  padding: var(--spacing-8);
}

.auth-header {
  text-align: center;
  margin-bottom: var(--spacing-6);
}

.app-logo {
  display: flex;
  justify-content: center;
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
  width: 3rem;
  height: 3rem;
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

.auth-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-2);
  color: var(--neutral-900);
}

.auth-subtitle {
  color: var(--neutral-600);
  margin-bottom: 0;
}

.auth-form {
  margin-bottom: var(--spacing-6);
}

.auth-divider {
  position: relative;
  text-align: center;
  margin: var(--spacing-6) 0;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: calc(50% - 5rem);
  height: 1px;
  background-color: var(--neutral-300);
}

.auth-divider::before {
  left: 0;
}

.auth-divider::after {
  right: 0;
}

.auth-divider span {
  display: inline-block;
  padding: 0 1rem;
  background-color: white;
  position: relative;
  color: var(--neutral-500);
  font-size: var(--font-size-sm);
}

.social-login {
  display: flex;
  gap: var(--spacing-3);
  justify-content: center;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--neutral-300);
  background-color: white;
  color: var(--neutral-700);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-normal);
  cursor: pointer;
  width: 100%;
}

.social-btn:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--neutral-400);
}

.google-btn {
  color: var(--neutral-800);
}

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

.auth-footer {
  margin-top: var(--spacing-6);
  text-align: center;
}

.auth-footer a {
  color: var(--primary-color);
}

/* Decorative background elements */
.auth-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.5;
}

.shape-1 {
  background: rgba(99, 102, 241, 0.2);
  width: 500px;
  height: 500px;
  top: -250px;
  right: -100px;
  animation: floatAnimation 8s ease-in-out infinite alternate;
}

.shape-2 {
  background: rgba(236, 72, 153, 0.15);
  width: 300px;
  height: 300px;
  bottom: -150px;
  left: -100px;
  animation: floatAnimation 6s ease-in-out infinite alternate-reverse;
}

.shape-3 {
  background: rgba(99, 102, 241, 0.1);
  width: 200px;
  height: 200px;
  top: 60%;
  left: 60%;
  animation: floatAnimation 10s ease-in-out infinite alternate;
}

.shape-4 {
  background: rgba(139, 92, 246, 0.1);
  width: 400px;
  height: 400px;
  top: 40%;
  right: 60%;
  animation: floatAnimation 12s ease-in-out infinite alternate-reverse;
}

@keyframes floatAnimation {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(20px, 20px) rotate(5deg); }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .auth-card-body {
    padding: var(--spacing-6) var(--spacing-4);
  }
  
  .auth-title {
    font-size: var(--font-size-xl);
  }
  
  .auth-divider::before,
  .auth-divider::after {
    width: calc(50% - 3rem);
  }
}
</style>