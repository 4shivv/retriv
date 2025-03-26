<template>
    <div class="auth-form">
      <h2 class="text-center mb-4">Sign In to Retriv</h2>
      
      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="form-control"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="form-control"
            placeholder="Enter your password"
            required
          />
        </div>
        
        <div class="form-group">
          <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </div>
      </form>
      
      <div class="text-center mt-3">
        <span>Or sign in with</span>
        <button 
          @click="handleGoogleLogin" 
          class="btn btn-outline btn-block mt-2"
          :disabled="loading"
        >
          Google
        </button>
      </div>
      
      <div class="text-center mt-3">
        <span>Don't have an account? </span>
        <router-link to="/register">Sign Up</router-link>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  import AuthService from '@/services/auth.service';
  
  export default {
    name: 'LoginForm',
    setup() {
      const email = ref('');
      const password = ref('');
      const error = ref('');
      const loading = ref(false);
      
      const router = useRouter();
      const store = useStore();
      
      const handleSubmit = async () => {
        try {
          loading.value = true;
          error.value = '';
          
          const user = await AuthService.login(email.value, password.value);
          store.dispatch('auth/setUser', user);
          router.push('/dashboard');
        } catch (err) {
          error.value = err.message || 'Failed to sign in';
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
          error.value = err.message || 'Failed to sign in with Google';
        } finally {
          loading.value = false;
        }
      };
      
      return {
        email,
        password,
        error,
        loading,
        handleSubmit,
        handleGoogleLogin
      };
    }
  }
  </script>
  
  <style scoped>
  .auth-form {
    max-width: 400px;
    margin: 0 auto;
    padding: var(--spacing-lg);
    background-color: white;
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-md);
  }
  </style>