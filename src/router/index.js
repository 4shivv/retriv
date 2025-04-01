import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '@/services/firebase';
import HomePage from '@/views/HomePage.vue';
import LoginPage from '@/views/LoginPage.vue';
import RegisterPage from '@/views/RegisterPage.vue';
import DashboardPage from '@/views/DashboardPage.vue';
import ProfilePage from '@/views/ProfilePage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { 
      title: 'Retriv - Learn Faster, Remember Longer',
      redirectIfAuth: '/dashboard' // Redirect authenticated users to dashboard
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { 
      requiresGuest: true,
      title: 'Sign In - Retriv' 
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { 
      requiresGuest: true,
      title: 'Create Account - Retriv' 
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    meta: { 
      requiresAuth: true,
      title: 'Dashboard - Retriv' 
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: { 
      requiresAuth: true,
      title: 'Profile - Retriv' 
    }
  },
  // Handle 404 - catch all route
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  // Enhanced scroll behavior for handling hash navigation
  scrollBehavior(to, from, savedPosition) {
    // If the user is navigating back, restore the saved position
    if (savedPosition) {
      return savedPosition;
    }
    
    // If there's a hash in the URL, scroll to that element
    if (to.hash) {
      return new Promise((resolve) => {
        // Wait for the page to load completely
        setTimeout(() => {
          const element = document.querySelector(to.hash);
          if (element) {
            resolve({
              el: to.hash,
              behavior: 'smooth',
              top: 80, // Offset for fixed navbar
            });
          } else {
            // If element doesn't exist, scroll to top
            resolve({ top: 0 });
          }
        }, 500); // Small delay to ensure the page is rendered
      });
    }
    
    // Default: scroll to top
    return { top: 0 };
  }
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
  // Update document title
  document.title = to.meta.title || 'Retriv';
  
  // Wait for Firebase auth to initialize
  const currentUser = auth.currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);
  const redirectIfAuth = to.matched.some(record => record.meta.redirectIfAuth);
  
  if (requiresAuth && !currentUser) {
    // If route requires auth and user is not logged in, redirect to login
    next({
      path: '/login',
      query: { redirect: to.fullPath } // Store the path they were trying to access
    });
  } else if (requiresGuest && currentUser) {
    // If route requires guest (non-authenticated) and user is logged in, redirect to dashboard
    next('/dashboard');
  } else if (redirectIfAuth && currentUser) {
    // If route should redirect authenticated users and user is logged in, redirect to dashboard
    next(to.meta.redirectIfAuth || '/dashboard');
  } else {
    // Proceed normally
    next();
  }
});

export default router;