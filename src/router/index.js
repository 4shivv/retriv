import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '@/services/firebase';
import HomePage from '@/views/HomePage.vue';
import LoginPage from '@/views/LoginPage.vue';
import RegisterPage from '@/views/RegisterPage.vue';
import DashboardPage from '@/views/DashboardPage.vue';
import ProfilePage from '@/views/ProfilePage.vue';
import FolderPage from '@/views/folders/FolderPage.vue';
import CreateStudyCardView from '@/views/Study/CreateStudyCardView.vue';
import CreateWithAIView from '@/views/Study/CreateWithAIView.vue';
import FAQPage from '@/views/FAQPage.vue';
import BlogPage from '@/views/BlogPage.vue';
import TermsPage from '@/views/TermsPage.vue';
import PrivacyPage from '@/views/PrivacyPage.vue';
import ContactPage from '@/views/ContactPage.vue';
import CareersPage from '@/views/CareersPage.vue';
import AboutPage from '@/views/AboutPage.vue';
import MobileAppPage from '@/views/MobileAppPage.vue';
import PricingPage from '@/views/PricingPage.vue';

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
  {
    path: '/folder/:id',
    name: 'Folder',
    component: FolderPage,
    meta: { 
      requiresAuth: true,
      title: 'Folder - Retriv' 
    }
  },
  {
    path: '/study/create',
    name: 'CreateStudyCard',
    component: CreateStudyCardView,
    meta: { 
      requiresAuth: true,
      title: 'Create Study Card - Retriv' 
    }
  },
  {
    path: '/study/create-with-ai',
    name: 'CreateWithAI',
    component: CreateWithAIView,
    meta: { 
      requiresAuth: true,
      title: 'Create with AI - Retriv' 
    }
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: FAQPage,
    meta: { 
      title: 'FAQ - Retriv',
      redirectIfAuth: '/dashboard'  // Redirect authenticated users
    }
  },
  {
    path: '/blog',
    name: 'Blog',
    component: BlogPage,
    meta: { 
      title: 'Blog - Retriv',
      redirectIfAuth: '/dashboard'  // Redirect authenticated users
    }
  },
  {
    path: '/terms',
    name: 'Terms',
    component: TermsPage,
    meta: { 
      title: 'Terms of Service - Retriv',
      redirectIfAuth: '/dashboard'  // Redirect authenticated users
    }
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: PrivacyPage,
    meta: { 
      title: 'Privacy Policy - Retriv',
      redirectIfAuth: '/dashboard'  // Redirect authenticated users
    }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: ContactPage,
    meta: { 
      title: 'Contact Us - Retriv',
      redirectIfAuth: '/dashboard'  // Redirect authenticated users
    }
  },
  {
    path: '/about',
    name: 'About',
    component: AboutPage,
    meta: { 
      title: 'About Us - Retriv',
      redirectIfAuth: '/dashboard'  // Redirect authenticated users
    }
  },
  {
    path: '/careers',
    name: 'Careers',
    component: CareersPage,
    meta: { 
      title: 'Careers - Retriv',
      redirectIfAuth: '/dashboard'  // Redirect authenticated users
    }
  },
  {
    path: '/mobile-app',
    name: 'MobileApp',
    component: MobileAppPage,
    meta: { 
      title: 'Mobile App - Retriv',
      redirectIfAuth: '/dashboard'  // Redirect authenticated users
    }
  },
  {
    path: '/pricing',
    name: 'Pricing',
    component: PricingPage,
    meta: { 
      title: 'Pricing - Retriv',
      redirectIfAuth: '/dashboard'  // Redirect authenticated users
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
  
  // Get current user - explicitly check auth state
  const currentUser = auth.currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);
  const redirectIfAuth = to.matched.some(record => record.meta.redirectIfAuth);
  
  // Force a redirect for authenticated users trying to access any public page
  if (currentUser && (redirectIfAuth || to.path === '/')) {
    return next('/dashboard');
  }
  
  // Standard auth flow
  if (requiresAuth && !currentUser) {
    // If route requires auth and user is not logged in, redirect to login
    return next({
      path: '/login',
      query: { redirect: to.fullPath } // Store the path they were trying to access
    });
  } else if (requiresGuest && currentUser) {
    // If route requires guest (non-authenticated) and user is logged in, redirect to dashboard
    return next('/dashboard');
  }
  
  // No auth issues, proceed normally
  return next();
});

export default router;