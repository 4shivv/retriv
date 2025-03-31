<template>
  <button @click="handleAddToCalendar" class="calendar-button" :disabled="loading">
    <div class="calendar-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
        <circle cx="12" cy="15" r="2"></circle>
      </svg>
    </div>
    <span class="calendar-text">{{ buttonText }}</span>
    <div v-if="loading" class="loading-spinner"></div>
  </button>

  <!-- Notification Modal -->
  <div v-if="showNotification" class="notification-modal">
    <div class="notification-content">
      <div class="notification-header" :class="{ 'success': notificationSuccess, 'error': !notificationSuccess }">
        <div class="notification-icon">
          <svg v-if="notificationSuccess" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h3>{{ notificationTitle }}</h3>
        <button @click="closeNotification" class="close-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="notification-body">
        <p>{{ notificationMessage }}</p>
        <div v-if="notificationSuccess && addedMaterials.length > 0" class="added-materials">
          <p class="materials-title">Added reviews for:</p>
          <ul class="materials-list">
            <li v-for="(material, index) in addedMaterials" :key="index">{{ material }}</li>
          </ul>
        </div>
      </div>
      <div class="notification-footer">
        <button @click="closeNotification" class="btn">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import CalendarService from '@/services/calendar.service';
import StudyService from '@/services/study.service';

export default {
  name: 'CalendarButton',
  props: {
    dueReviews: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const loading = ref(false);
    const buttonText = ref('Add Reviews to Calendar');
    const showNotification = ref(false);
    const notificationTitle = ref('');
    const notificationMessage = ref('');
    const notificationSuccess = ref(true);
    const addedMaterials = ref([]);
    
    // Handle button click
    const handleAddToCalendar = async () => {
      loading.value = true;
      buttonText.value = 'Adding to Calendar...';
      
      try {
        // Initialize Google API
        await CalendarService.initializeGoogleApi();
        
        // Get materials with their review schedules
        let result;
        
        if (props.dueReviews && props.dueReviews.length > 0) {
          // Add due reviews directly
          result = await CalendarService.addDueReviewsToCalendar(props.dueReviews);
          addedMaterials.value = result.addedReviews || [];
        } else {
          // Fetch all materials and then add their reviews
          const materials = await StudyService.getStudyMaterials();
          
          // Enrich materials with their review schedules
          const enrichedMaterials = await Promise.all(
            materials.map(async material => {
              // Get the latest attempt with a review schedule
              const attempts = await StudyService.getStudyAttempts(material.id);
              
              if (!attempts || attempts.length === 0) {
                return { ...material, reviewSchedule: [] };
              }
              
              // Find the first attempt with a non-deprecated review schedule
              const attemptWithSchedule = attempts.find(
                attempt => attempt.reviewSchedule && 
                         attempt.reviewSchedule.length > 0 && 
                         !attempt.isDeprecatedSchedule
              );
              
              if (!attemptWithSchedule) {
                return { ...material, reviewSchedule: [] };
              }
              
              // Convert ISO string dates to Date objects
              const reviewSchedule = attemptWithSchedule.reviewSchedule.map(
                date => typeof date === 'string' ? new Date(date) : date.toDate()
              );
              
              // Filter to include only future dates
              const now = new Date();
              const futureReviews = reviewSchedule.filter(date => date > now);
              
              return { ...material, reviewSchedule: futureReviews };
            })
          );
          
          // Filter out materials with no future reviews
          const materialsWithReviews = enrichedMaterials.filter(
            material => material.reviewSchedule && material.reviewSchedule.length > 0
          );
          
          // Add reviews to calendar
          result = await CalendarService.addReviewsToCalendar(materialsWithReviews);
          addedMaterials.value = result.addedMaterials || [];
        }
        
        // Show success notification
        notificationSuccess.value = result.success;
        notificationTitle.value = result.success ? 'Success!' : 'No Reviews Added';
        notificationMessage.value = result.message;
        showNotification.value = true;
      } catch (error) {
        console.error('Error adding reviews to calendar:', error);
        
        // Show error notification
        notificationSuccess.value = false;
        notificationTitle.value = 'Error';
        notificationMessage.value = `Failed to add reviews to calendar: ${error.message}`;
        showNotification.value = true;
      } finally {
        loading.value = false;
        buttonText.value = 'Add Reviews to Calendar';
      }
    };
    
    // Close notification
    const closeNotification = () => {
      showNotification.value = false;
    };
    
    return {
      loading,
      buttonText,
      handleAddToCalendar,
      showNotification,
      notificationTitle,
      notificationMessage,
      notificationSuccess,
      closeNotification,
      addedMaterials
    };
  }
};
</script>

<style scoped>
.calendar-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 24px;
  background-color: #6c5ce7;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(108, 92, 231, 0.2);
  width: 100%;
  max-width: 320px;
}

.calendar-button:hover {
  background-color: #5d4aeb;
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(108, 92, 231, 0.3);
}

.calendar-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.3);
}

.calendar-button:disabled {
  background-color: #a29bfe;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.calendar-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.calendar-text {
  flex: 1;
  text-align: center;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Notification Modal */
.notification-modal {
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
}

.notification-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.notification-header {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.notification-header.success {
  color: #10b981;
}

.notification-header.error {
  color: #ef4444;
}

.notification-icon {
  margin-right: 12px;
}

.notification-header h3 {
  flex: 1;
  margin: 0;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: #f3f4f6;
}

.notification-body {
  padding: 16px;
  max-height: 50vh;
  overflow-y: auto;
}

.notification-footer {
  padding: 16px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
}

.added-materials {
  margin-top: 16px;
  padding: 12px;
  background-color: #f9fafb;
  border-radius: 6px;
}

.materials-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
}

.materials-list {
  margin: 0;
  padding-left: 20px;
}

.materials-list li {
  margin-bottom: 4px;
  font-size: 14px;
}

.btn {
  padding: 8px 16px;
  background-color: #e5e7eb;
  color: #111827;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn:hover {
  background-color: #d1d5db;
}
</style>