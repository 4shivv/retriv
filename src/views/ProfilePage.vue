<template>
    <div class="profile-page">
      <div class="container">
        <!-- Profile Header -->
        <header class="profile-header">
          <div class="header-content">
            <h1 class="profile-title">Your Profile</h1>
            <p class="profile-subtitle">Manage your account settings and view your study statistics</p>
          </div>
        </header>
  
        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner-large"></div>
          <p>Loading your profile...</p>
        </div>
  
        <!-- Profile Content -->
        <div v-else class="profile-content">
          <div class="profile-section">
            <div class="section-header">
              <h2 class="section-title">Account Information</h2>
            </div>
            
            <div class="card">
              <div class="card-body">
                <div v-if="updateSuccess" class="alert alert-success mb-4">
                  <div class="alert-content">
                    <div class="alert-text">Profile updated successfully!</div>
                  </div>
                </div>
                
                <div v-if="error" class="alert alert-danger mb-4">
                  <div class="alert-content">
                    <div class="alert-text">{{ error }}</div>
                  </div>
                </div>
                
                <form @submit.prevent="handleUpdateProfile">
                  <div class="profile-avatar">
                    <div class="avatar avatar-xl">
                      {{ userInitials }}
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label for="email" class="form-label">Email</label>
                    <input
                      type="email"
                      id="email"
                      v-model="email"
                      class="form-control"
                      disabled
                    />
                    <p class="form-text">Your email cannot be changed.</p>
                  </div>
                  
                  <div class="form-group">
                    <label for="displayName" class="form-label">Display Name</label>
                    <input
                      type="text"
                      id="displayName"
                      v-model="displayName"
                      class="form-control"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div class="form-actions">
                    <button type="submit" class="btn btn-primary" :disabled="updateLoading">
                      <span v-if="updateLoading" class="loading-spinner"></span>
                      <span v-else>Update Profile</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          <div class="profile-section">
            <div class="section-header">
              <h2 class="section-title">Study Statistics</h2>
            </div>
            
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon study-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div class="stat-content">
                  <h3 class="stat-value">{{ stats.studySessions }}</h3>
                  <p class="stat-label">Study Sessions</p>
                </div>
              </div>
  
              <div class="stat-card">
                <div class="stat-icon streak-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
                    <path d="M12 9v6"></path>
                    <path d="M9 12h6"></path>
                  </svg>
                </div>
                <div class="stat-content">
                  <h3 class="stat-value">{{ stats.streak }}</h3>
                  <p class="stat-label">Day Streak</p>
                </div>
              </div>
  
              <div class="stat-card">
                <div class="stat-icon retention-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <path d="M16 13l-4 4l-4-4"></path>
                    <path d="M8 13v-1h8v1"></path>
                  </svg>
                </div>
                <div class="stat-content">
                  <h3 class="stat-value">{{ stats.avgRetention }}%</h3>
                  <p class="stat-label">Avg. Retention</p>
                </div>
              </div>
  
              <div class="stat-card">
                <div class="stat-icon material-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  </svg>
                </div>
                <div class="stat-content">
                  <h3 class="stat-value">{{ stats.totalMaterials }}</h3>
                  <p class="stat-label">Total Materials</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="profile-section">
            <div class="section-header">
              <h2 class="section-title">Security</h2>
            </div>
            
            <div class="card">
              <div class="card-body">
                <div v-if="passwordSuccess" class="alert alert-success mb-4">
                  <div class="alert-content">
                    <div class="alert-text">Password updated successfully!</div>
                  </div>
                </div>
                
                <div v-if="passwordError" class="alert alert-danger mb-4">
                  <div class="alert-content">
                    <div class="alert-text">{{ passwordError }}</div>
                  </div>
                </div>
                
                <form @submit.prevent="handleUpdatePassword">
                  <div class="form-group">
                    <label for="currentPassword" class="form-label">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      v-model="currentPassword"
                      class="form-control"
                      placeholder="Enter your current password"
                      required
                    />
                  </div>
                  
                  <div class="form-group">
                    <label for="newPassword" class="form-label">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      v-model="newPassword"
                      class="form-control"
                      placeholder="Enter your new password"
                      required
                      minlength="6"
                    />
                    <p class="form-text">Password must be at least 6 characters long.</p>
                  </div>
                  
                  <div class="form-group">
                    <label for="confirmPassword" class="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      v-model="confirmPassword"
                      class="form-control"
                      placeholder="Confirm your new password"
                      required
                    />
                  </div>
                  
                  <div class="form-actions">
                    <button type="submit" class="btn btn-primary" :disabled="passwordLoading">
                      <span v-if="passwordLoading" class="loading-spinner"></span>
                      <span v-else>Update Password</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          <div class="profile-section danger-zone">
            <div class="section-header">
              <h2 class="section-title text-danger">Danger Zone</h2>
            </div>
            
            <div class="card danger-card">
              <div class="card-body">
                <h3>Delete Account</h3>
                <p>Once you delete your account, there is no going back. All of your data will be permanently deleted. Please be certain.</p>
                <button @click="confirmDeleteAccount" class="btn btn-danger">Delete Account</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Delete Account Confirmation Modal -->
      <div v-if="showDeleteModal" class="delete-modal-backdrop" @click="cancelDeleteAccount">
        <div class="delete-modal" @click.stop>
          <div class="delete-modal-header">
            <h4>Delete Account</h4>
          </div>
          <div class="delete-modal-body">
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <div class="form-group">
              <label for="confirmEmail" class="form-label">Please type your email to confirm</label>
              <input
                type="email"
                id="confirmEmail"
                v-model="confirmEmail"
                class="form-control"
                placeholder="Enter your email"
              />
            </div>
          </div>
          <div class="delete-modal-footer">
            <button @click="cancelDeleteAccount" class="btn btn-outline">Cancel</button>
            <button 
              @click="handleDeleteAccount" 
              class="btn btn-danger" 
              :disabled="confirmEmail !== email || deleteAccountLoading"
            >
              <span v-if="deleteAccountLoading" class="loading-spinner"></span>
              <span v-else>Delete Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  import { auth } from '@/services/firebase';
  import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from 'firebase/auth';
  import StudyService from '@/services/study.service';
  
  export default {
    name: 'ProfilePage',
    
    setup() {
      const router = useRouter();
      const store = useStore();
      
      // User profile state
      const loading = ref(true);
      const email = ref('');
      const displayName = ref('');
      const error = ref('');
      const updateLoading = ref(false);
      const updateSuccess = ref(false);
      
      // Password update state
      const currentPassword = ref('');
      const newPassword = ref('');
      const confirmPassword = ref('');
      const passwordLoading = ref(false);
      const passwordError = ref('');
      const passwordSuccess = ref(false);
      
      // Delete account state
      const showDeleteModal = ref(false);
      const confirmEmail = ref('');
      const deleteAccountLoading = ref(false);
      
      // Stats
      const stats = ref({
        studySessions: 0,
        streak: 0,
        avgRetention: 0,
        totalMaterials: 0
      });
      
      const userInitials = computed(() => {
        if (!displayName.value && !email.value) return '';
        
        if (displayName.value) {
          const names = displayName.value.split(' ');
          if (names.length >= 2) {
            return (names[0][0] + names[1][0]).toUpperCase();
          }
          return displayName.value.substring(0, 2).toUpperCase();
        }
        
        // Use email if no display name
        const parts = email.value.split('@');
        return parts[0].substring(0, 2).toUpperCase();
      });
      
      // Load user profile
      const loadProfile = async () => {
        try {
          loading.value = true;
          
          // Check if user is logged in
          const user = auth.currentUser;
          if (!user) {
            router.push('/login');
            return;
          }
          
          // Set user data
          email.value = user.email || '';
          displayName.value = user.displayName || '';
          
          // Load user stats
          await loadUserStats();
          
        } catch (err) {
          console.error('Error loading profile:', err);
          error.value = 'Failed to load profile data';
        } finally {
          loading.value = false;
        }
      };
      
      // Load user statistics
      const loadUserStats = async () => {
        try {
          // Get user materials
          const materials = await StudyService.getStudyMaterials();
          stats.value.totalMaterials = materials.length;
          
          // For MVP, we'll use placeholder values
          // In a real app, you'd calculate these from actual user data
          stats.value.studySessions = materials.length > 0 ? 12 : 0;
          stats.value.streak = materials.length > 0 ? 7 : 0;
          stats.value.avgRetention = materials.length > 0 ? 85 : 0;
          
        } catch (err) {
          console.error('Error loading user stats:', err);
          // Don't show error for stats, just log it
        }
      };
      
      // Update profile
      const handleUpdateProfile = async () => {
        try {
          updateLoading.value = true;
          error.value = '';
          updateSuccess.value = false;
          
          const user = auth.currentUser;
          if (!user) {
            router.push('/login');
            return;
          }
          
          await updateProfile(user, {
            displayName: displayName.value
          });
          
          // Update store with new user data
          store.dispatch('auth/setUser', {
            uid: user.uid,
            email: user.email,
            displayName: displayName.value,
            photoURL: user.photoURL
          });
          
          updateSuccess.value = true;
          
          // Hide success message after 3 seconds
          setTimeout(() => {
            updateSuccess.value = false;
          }, 3000);
          
        } catch (err) {
          console.error('Error updating profile:', err);
          error.value = err.message || 'Failed to update profile';
        } finally {
          updateLoading.value = false;
        }
      };
      
      // Update password
      const handleUpdatePassword = async () => {
        try {
          passwordLoading.value = true;
          passwordError.value = '';
          passwordSuccess.value = false;
          
          // Validate passwords
          if (newPassword.value !== confirmPassword.value) {
            passwordError.value = 'New passwords do not match';
            return;
          }
          
          if (newPassword.value.length < 6) {
            passwordError.value = 'Password must be at least 6 characters long';
            return;
          }
          
          const user = auth.currentUser;
          if (!user || !user.email) {
            router.push('/login');
            return;
          }
          
          // Reauthenticate user
          const credential = EmailAuthProvider.credential(user.email, currentPassword.value);
          await reauthenticateWithCredential(user, credential);
          
          // Update password
          await updatePassword(user, newPassword.value);
          
          // Reset form
          currentPassword.value = '';
          newPassword.value = '';
          confirmPassword.value = '';
          
          passwordSuccess.value = true;
          
          // Hide success message after 3 seconds
          setTimeout(() => {
            passwordSuccess.value = false;
          }, 3000);
          
        } catch (err) {
          console.error('Error updating password:', err);
          
          // Handle specific errors
          if (err.code === 'auth/wrong-password') {
            passwordError.value = 'Current password is incorrect';
          } else {
            passwordError.value = err.message || 'Failed to update password';
          }
        } finally {
          passwordLoading.value = false;
        }
      };
      
      // Delete account confirmation
      const confirmDeleteAccount = () => {
        showDeleteModal.value = true;
      };
      
      // Cancel delete account
      const cancelDeleteAccount = () => {
        showDeleteModal.value = false;
        confirmEmail.value = '';
      };
      
      // Delete account
      const handleDeleteAccount = async () => {
        try {
          deleteAccountLoading.value = true;
          
          // Confirm email matches
          if (confirmEmail.value !== email.value) {
            return;
          }
          
          const user = auth.currentUser;
          if (!user) {
            router.push('/login');
            return;
          }
          
          // Delete user data
          // In a real app, you'd want to also delete user data from Firestore
          
          // Delete user account
          await deleteUser(user);
          
          // Clear user from store
          store.dispatch('auth/clearUser');
          
          // Redirect to home
          router.push('/');
          
        } catch (err) {
          console.error('Error deleting account:', err);
          error.value = err.message || 'Failed to delete account. You may need to reauthenticate.';
          showDeleteModal.value = false;
        } finally {
          deleteAccountLoading.value = false;
        }
      };
      
      onMounted(() => {
        loadProfile();
      });
      
      return {
        loading,
        email,
        displayName,
        error,
        updateLoading,
        updateSuccess,
        currentPassword,
        newPassword,
        confirmPassword,
        passwordLoading,
        passwordError,
        passwordSuccess,
        showDeleteModal,
        confirmEmail,
        deleteAccountLoading,
        stats,
        userInitials,
        handleUpdateProfile,
        handleUpdatePassword,
        confirmDeleteAccount,
        cancelDeleteAccount,
        handleDeleteAccount
      };
    }
  }
  </script>
  
  <style scoped>
  .profile-page {
    padding-top: 1.5rem;
    min-height: 100vh;
    background-color: var(--neutral-50);
  }
  
  @media (max-width: 768px) {
    .profile-page {
      padding-top: 5rem; /* Provide space for mobile toggle button */
    }
  }
  
  /* Profile Header */
  .profile-header {
    margin-bottom: var(--spacing-8);
    padding-top: var(--spacing-12);
  }
  
  .profile-title {
    font-size: var(--font-size-3xl);
    margin-bottom: var(--spacing-2);
    color: var(--neutral-900);
  }
  
  .profile-subtitle {
    color: var(--neutral-600);
    margin-bottom: 0;
  }
  
  /* Loading State */
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    color: var(--neutral-600);
  }
  
  .loading-spinner-large {
    width: 3rem;
    height: 3rem;
    border: 3px solid rgba(99, 102, 241, 0.2);
    border-radius: 50%;
    border-top-color: var(--primary-color);
    animation: spin 1s linear infinite;
    margin-bottom: var(--spacing-4);
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  /* Profile Content */
  .profile-content {
    margin-bottom: var(--spacing-16);
  }
  
  .profile-section {
    margin-bottom: var(--spacing-12);
  }
  
  .section-header {
    margin-bottom: var(--spacing-6);
  }
  
  .section-title {
    font-size: var(--font-size-2xl);
    margin-bottom: 0;
    color: var(--neutral-900);
  }
  
  .card {
    background-color: white;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    overflow: hidden;
    margin-bottom: var(--spacing-6);
  }
  
  .card-body {
    padding: var(--spacing-6);
  }
  
  /* Avatar */
  .profile-avatar {
    display: flex;
    justify-content: center;
    margin-bottom: var(--spacing-6);
  }
  
  .avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background-color: var(--primary-color);
    color: white;
    font-weight: var(--font-weight-semibold);
    font-size: var(--font-size-md);
  }
  
  .avatar-xl {
    width: 5rem;
    height: 5rem;
    font-size: var(--font-size-xl);
  }
  
  /* Form Actions */
  .form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: var(--spacing-6);
  }
  
  /* Statistics */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-6);
    margin-bottom: var(--spacing-6);
  }
  
  .stat-card {
    background-color: white;
    border-radius: var(--radius-lg);
    padding: var(--spacing-6);
    display: flex;
    align-items: center;
    gap: var(--spacing-4);
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-normal);
  }
  
  .stat-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }
  
  .stat-icon {
    width: 3rem;
    height: 3rem;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  
  .study-icon {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
  }
  
  .streak-icon {
    background: linear-gradient(135deg, #f43f5e, #ec4899);
  }
  
  .retention-icon {
    background: linear-gradient(135deg, #10b981, #06b6d4);
  }
  
  .material-icon {
    background: linear-gradient(135deg, #f59e0b, #fb923c);
  }
  
  .stat-content {
    flex: 1;
  }
  
  .stat-value {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--spacing-1);
    color: var(--neutral-900);
  }
  
  .stat-label {
    font-size: var(--font-size-sm);
    color: var(--neutral-600);
    margin-bottom: 0;
  }
  
  /* Danger Zone */
  .danger-zone .section-title {
    color: #ef4444;
  }
  
  .danger-card {
    border: 1px solid rgba(239, 68, 68, 0.3);
  }
  
  .danger-card h3 {
    color: #ef4444;
    margin-bottom: var(--spacing-4);
  }
  
  .btn-danger {
    background-color: #ef4444;
    color: white;
  }
  
  .btn-danger:hover {
    background-color: #dc2626;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(239, 68, 68, 0.25);
  }
  
  /* Spinners */
  .loading-spinner {
    display: inline-block;
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s linear infinite;
  }
  
  /* Delete Account Modal */
  .delete-modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease forwards;
  }
  
  .delete-modal {
    background-color: white;
    border-radius: var(--radius-lg);
    width: 500px;
    max-width: 90%;
    box-shadow: var(--shadow-xl);
    animation: scaleIn 0.2s ease forwards;
  }
  
  .delete-modal-header {
    padding: var(--spacing-4) var(--spacing-6);
    border-bottom: 1px solid var(--neutral-200);
  }
  
  .delete-modal-header h4 {
    margin: 0;
    font-weight: var(--font-weight-semibold);
    color: #ef4444;
  }
  
  .delete-modal-body {
    padding: var(--spacing-6);
  }
  
  .delete-modal-footer {
    padding: var(--spacing-4) var(--spacing-6);
    border-top: 1px solid var(--neutral-200);
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-3);
  }
  
  /* Alerts */
  .alert {
    padding: var(--spacing-4);
    border-radius: var(--radius-md);
    margin-bottom: var(--spacing-4);
  }
  
  .alert-success {
    background-color: rgba(16, 185, 129, 0.1);
    color: #065f46;
    border-left: 3px solid #10b981;
  }
  
  .alert-danger {
    background-color: rgba(239, 68, 68, 0.1);
    color: #b91c1c;
    border-left: 3px solid #ef4444;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes scaleIn {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  
  /* Responsive styles */
  @media (max-width: 992px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 768px) {
    .profile-header {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-4);
    }
    
    .form-actions {
      flex-direction: column;
    }
    
    .form-actions .btn {
      width: 100%;
    }
    
    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>