<template>
  <div class="material-list">
    <!-- View Material Details Mode -->
    <div v-if="viewMode && selectedMaterial" class="material-view">
      <div class="view-header">
        <button @click="closeView" class="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Back to Materials</span>
        </button>
      </div>
      
      <div class="material-view-card">
        <div class="material-view-header">
          <div class="title-area">
            <h3>{{ selectedMaterial.title }}</h3>
            <div class="material-view-meta">
              <span>Created on {{ formatDate(selectedMaterial.createdAt) }}</span>
            </div>
          </div>
          
          <div class="next-review-badge" v-if="nextReviewDate">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>Next Review: {{ formatDateWithTime(nextReviewDate) }}</span>
          </div>
        </div>
        
        <div class="material-view-content">
          <p>{{ selectedMaterial.content }}</p>
        </div>
        
        <!-- Study Attempts History -->
        <div v-if="studyAttempts && studyAttempts.length > 0" class="study-history-section">
          <h4>Study History</h4>
          <div class="attempts-list">
            <div v-for="(attempt, index) in studyAttempts" :key="index" class="attempt-item">
              <div class="attempt-header">
                <div class="attempt-score">
                  <div class="score-badge" :class="getScoreClass(attempt.matchPercentage)">
                    {{ attempt.matchPercentage }}%
                  </div>
                </div>
                <div class="attempt-date">
                  {{ formatDateWithTime(attempt.timestamp) }}
                  <span v-if="index === 0" class="latest-badge">Latest</span>
                </div>
              </div>
              
              <!-- Display the review schedule if available -->
              <div v-if="attempt.reviewSchedule && attempt.reviewSchedule.length > 0" class="review-schedule">
                <p class="schedule-heading">Review Schedule:</p>
                <ul class="schedule-list">
                  <li v-for="(date, i) in attempt.reviewSchedule" :key="i" class="schedule-item" :class="{ 'past-date': isPastDate(date), 'current-date': isCurrentDate(date) }">
                    {{ formatDateWithTime(date) }}
                    <span v-if="isPastDate(date)" class="status-badge completed">Completed</span>
                    <span v-else-if="isCurrentDate(date)" class="status-badge due">Due Today</span>
                    <span v-else class="status-badge upcoming">Upcoming</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div class="material-view-actions">
          <button @click="studyMaterial" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            Start Study Session
          </button>
          <button @click="editMaterial" class="btn btn-outline">Edit Material</button>
        </div>
      </div>
    </div>
    
    <!-- Edit Material Mode -->
    <div v-else-if="editMode && selectedMaterial" class="material-edit">
      <div class="view-header">
        <button @click="cancelEdit" class="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Cancel Edit</span>
        </button>
      </div>
      
      <div class="material-edit-card card">
        <div class="card-header">
          <h3>Edit Study Material</h3>
        </div>
        
        <div class="card-body">
          <div v-if="error" class="alert alert-danger">
            <div class="alert-content">
              <div class="alert-text">{{ error }}</div>
            </div>
          </div>
          
          <form @submit.prevent="saveEdit">
            <div class="form-group">
              <label class="form-label">Title</label>
              <input
                type="text"
                v-model="editForm.title"
                class="form-control"
                placeholder="Enter a title for this material"
                required
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">Content</label>
              <textarea
                v-model="editForm.content"
                class="form-control"
                rows="10"
                placeholder="Paste or type the content you want to study"
                required
              ></textarea>
            </div>
            
            <div class="form-actions">
              <button type="button" @click="cancelEdit" class="btn btn-outline">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="isLoading">
                <span v-if="isLoading" class="loading-spinner"></span>
                <span v-else>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="delete-modal-backdrop" @click="cancelDelete">
      <div class="delete-modal" @click.stop>
        <div class="delete-modal-header">
          <h4>Delete Material</h4>
        </div>
        <div class="delete-modal-body">
          <p>Are you sure you want to delete "{{ selectedMaterial?.title }}"?</p>
          <p class="text-danger">This action cannot be undone.</p>
        </div>
        <div class="delete-modal-footer">
          <button @click="cancelDelete" class="btn btn-outline">Cancel</button>
          <button @click="confirmDelete" class="btn btn-danger" :disabled="deleteLoading">
            <span v-if="deleteLoading" class="loading-spinner"></span>
            <span v-else>Delete</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Material List Mode -->
    <div v-else>
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading materials...</p>
      </div>
      
      <div v-else-if="!materials || materials.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
            <line x1="7" y1="2" x2="7" y2="22"></line>
            <line x1="17" y1="2" x2="17" y2="22"></line>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <line x1="2" y1="7" x2="7" y2="7"></line>
            <line x1="2" y1="17" x2="7" y2="17"></line>
            <line x1="17" y1="17" x2="22" y2="17"></line>
            <line x1="17" y1="7" x2="22" y2="7"></line>
          </svg>
        </div>
        <h3>No study materials yet</h3>
        <p>Start creating your first study material to begin your learning journey.</p>
        <button @click="$emit('create-new')" class="btn btn-primary">Create Your First Material</button>
      </div>
      
      <div v-else class="materials-grid">
        <div 
          v-for="material in materials" 
          :key="material.id"
          class="material-card"
          :class="{ 'has-review': material.hasReview }"
        >
          <div class="material-header">
            <div class="material-category">Study Material</div>
            <div class="material-date">{{ formatDate(material.createdAt) }}</div>
          </div>
          <h3 class="material-title" @click="viewMaterial(material)">{{ material.title }}</h3>
          <p class="material-excerpt" @click="viewMaterial(material)">{{ truncateText(material.content, 120) }}</p>
          <div v-if="material.nextReview" class="material-review-info">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span class="review-date" :class="{ 'review-due': isReviewDue(material.nextReview) }">
              Review: {{ formatReviewDate(material.nextReview) }}
            </span>
          </div>
          <div class="material-footer">
            <div class="material-actions">
              <button 
                @click="studyDirectly(material)" 
                class="btn btn-primary btn-sm material-action-btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span>Study</span>
              </button>
              <button 
                @click="editMaterial(material)" 
                class="btn btn-outline btn-sm material-action-btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                <span>Edit</span>
              </button>
              <button 
                @click="deleteMaterial(material)" 
                class="btn btn-danger btn-sm material-action-btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import StudyService from '@/services/study.service';

export default {
  name: 'MaterialList',
  props: {
    materials: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['select-material', 'create-new', 'material-edited', 'material-deleted'],
  
  setup(props, { emit }) {
    const viewMode = ref(false);
    const editMode = ref(false);
    const selectedMaterial = ref(null);
    const error = ref('');
    const isLoading = ref(false);
    const showDeleteModal = ref(false);
    const deleteLoading = ref(false);
    const studyAttempts = ref([]);
    const nextReviewDate = ref(null);
    
    // Form data for editing
    const editForm = ref({
      title: '',
      content: ''
    });
    
    const truncateText = (text, maxLength) => {
      if (!text) return '';
      if (text.length <= maxLength) return text;
      return text.slice(0, maxLength) + '...';
    };
    
    const formatDate = (timestamp) => {
      if (!timestamp) return 'N/A';
      
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    };

    const formatDateWithTime = (timestamp) => {
      if (!timestamp) return 'N/A';
      
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }).format(date);
    };

    const formatReviewDate = (timestamp) => {
      if (!timestamp) return 'N/A';
      
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Check if the date is today
      if (date >= today && date < tomorrow) {
        return 'Today';
      }
      
      // Check if the date is tomorrow
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + 1);
      const dayAfter = new Date(today);
      dayAfter.setDate(today.getDate() + 2);
      
      if (date >= nextDay && date < dayAfter) {
        return 'Tomorrow';
      }
      
      // Otherwise, return the formatted date
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      }).format(date);
    };

    const isReviewDue = (timestamp) => {
      if (!timestamp) return false;
      
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const now = new Date();
      
      // Review is due if it's today or in the past
      return date <= now;
    };

    const isPastDate = (timestamp) => {
      if (!timestamp) return false;
      
      const date = new Date(timestamp);
      const now = new Date();
      
      // Check if the date is in the past
      return date < now;
    };

    const isCurrentDate = (timestamp) => {
      if (!timestamp) return false;
      
      const date = new Date(timestamp);
      const now = new Date();
      
      // Check if the date is today
      return date.toDateString() === now.toDateString();
    };

    const getScoreClass = (score) => {
      if (score >= 90) return 'excellent';
      if (score >= 80) return 'good';
      if (score >= 70) return 'fair';
      if (score >= 50) return 'poor';
      return 'very-poor';
    };
    
    // Fetch study attempts for a material
    const fetchStudyAttempts = async (materialId) => {
      try {
        isLoading.value = true;
        const attempts = await StudyService.getStudyAttempts(materialId);
        studyAttempts.value = attempts;
        
        // Fetch next review date
        const nextReview = await StudyService.getNextReviewDate(materialId);
        nextReviewDate.value = nextReview;
        
      } catch (err) {
        console.error('Failed to fetch study attempts:', err);
        error.value = err.message || 'Failed to load study history';
      } finally {
        isLoading.value = false;
      }
    };
    
    // View material
    const viewMaterial = async (material) => {
      selectedMaterial.value = material;
      viewMode.value = true;
      editMode.value = false;
      
      // Fetch study attempts for this material
      await fetchStudyAttempts(material.id);
    };
    
    // Close view
    const closeView = () => {
      viewMode.value = false;
      selectedMaterial.value = null;
      studyAttempts.value = [];
    };
    
    // Study material
    const studyMaterial = () => {
      if (selectedMaterial.value) {
        emit('select-material', selectedMaterial.value);
        viewMode.value = false;
      }
    };
    
    // Study directly from list
    const studyDirectly = (material) => {
      emit('select-material', material);
    };
    
    // Edit material
    const editMaterial = (material) => {
      selectedMaterial.value = material || selectedMaterial.value;
      editForm.value.title = selectedMaterial.value.title;
      editForm.value.content = selectedMaterial.value.content;
      editMode.value = true;
      viewMode.value = false;
    };
    
    // Cancel edit
    const cancelEdit = () => {
      if (viewMode.value) {
        // If we were viewing the material, go back to view mode
        editMode.value = false;
      } else {
        // Otherwise go back to list
        editMode.value = false;
        selectedMaterial.value = null;
      }
    };
    
    // Save edit
    const saveEdit = async () => {
      if (!selectedMaterial.value) return;
      
      try {
        isLoading.value = true;
        error.value = '';
        
        // Update material in database
        await StudyService.updateStudyMaterial(
          selectedMaterial.value.id,
          editForm.value.title,
          editForm.value.content
        );
        
        // Update the material object
        const updatedMaterial = {
          ...selectedMaterial.value,
          title: editForm.value.title,
          content: editForm.value.content,
          updatedAt: new Date()
        };
        
        // Emit event to refresh materials
        emit('material-edited', updatedMaterial);
        
        // Go back to view mode
        selectedMaterial.value = updatedMaterial;
        editMode.value = false;
        viewMode.value = true;
        
      } catch (err) {
        console.error('Failed to update material:', err);
        error.value = err.message || 'Failed to update material';
      } finally {
        isLoading.value = false;
      }
    };
    
    // Delete material
    const deleteMaterial = (material) => {
      selectedMaterial.value = material;
      showDeleteModal.value = true;
    };
    
    // Cancel delete
    const cancelDelete = () => {
      showDeleteModal.value = false;
    };
    
    // Confirm delete
    const confirmDelete = async () => {
      if (!selectedMaterial.value) return;
      
      try {
        deleteLoading.value = true;
        
        // Delete material from database
        await StudyService.deleteStudyMaterial(selectedMaterial.value.id);
        
        // Emit event to refresh materials
        emit('material-deleted', selectedMaterial.value.id);
        
        // Close modal and reset state
        showDeleteModal.value = false;
        selectedMaterial.value = null;
        viewMode.value = false;
        
      } catch (err) {
        console.error('Failed to delete material:', err);
        error.value = err.message || 'Failed to delete material';
      } finally {
        deleteLoading.value = false;
      }
    };

    // Check if any materials have reviews due today
    onMounted(async () => {
      if (props.materials && props.materials.length > 0) {
        // Add review information to materials
        for (const material of props.materials) {
          try {
            const nextReview = await StudyService.getNextReviewDate(material.id);
            if (nextReview) {
              material.nextReview = nextReview;
              material.hasReview = isReviewDue(nextReview);
            }
          } catch (err) {
            console.error('Error fetching review date:', err);
          }
        }
      }
    });
    
    return {
      viewMode,
      editMode,
      selectedMaterial,
      editForm,
      error,
      isLoading,
      showDeleteModal,
      deleteLoading,
      studyAttempts,
      nextReviewDate,
      truncateText,
      formatDate,
      formatDateWithTime,
      formatReviewDate,
      isReviewDue,
      isPastDate,
      isCurrentDate,
      getScoreClass,
      viewMaterial,
      closeView,
      studyMaterial,
      studyDirectly,
      editMaterial,
      cancelEdit,
      saveEdit,
      deleteMaterial,
      cancelDelete,
      confirmDelete
    };
  }
}
</script>

<style scoped>
.material-list {
  width: 100%;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: var(--neutral-600);
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid rgba(99, 102, 241, 0.2);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-4);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--spacing-12);
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.empty-icon {
  margin-bottom: var(--spacing-6);
  color: var(--neutral-400);
}

.empty-state h3 {
  margin-bottom: var(--spacing-3);
  color: var(--neutral-800);
}

.empty-state p {
  margin-bottom: var(--spacing-6);
  color: var(--neutral-600);
  max-width: 400px;
}

/* Materials Grid */
.materials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-6);
}

.material-card {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  border: 1px solid var(--neutral-200);
  position: relative;
}

.material-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-light);
}

.material-card.has-review {
  border-left: 4px solid var(--primary-color);
}

.material-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
}

.material-category {
  font-size: var(--font-size-xs);
  color: var(--primary-color);
  font-weight: var(--font-weight-medium);
}

.material-date {
  font-size: var(--font-size-xs);
  color: var(--neutral-500);
}

.material-title {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-3);
  color: var(--neutral-900);
  cursor: pointer;
}

.material-title:hover {
  color: var(--primary-color);
}

.material-excerpt {
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
  margin-bottom: var(--spacing-4);
  line-height: 1.6;
  cursor: pointer;
}

.material-review-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-4);
  padding: var(--spacing-2) var(--spacing-3);
  background-color: var(--neutral-100);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
}

.review-date.review-due {
  color: var(--primary-color);
  font-weight: var(--font-weight-medium);
}

.material-footer {
  border-top: 1px solid var(--neutral-200);
  padding-top: var(--spacing-4);
}

.material-actions {
  display: flex;
  gap: var(--spacing-2);
  justify-content: flex-start;
}

.material-action-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: 0.35rem 0.75rem;
  font-size: var(--font-size-xs);
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

/* Material View Mode */
.material-view {
  animation: fadeIn 0.3s ease forwards;
}

.view-header {
  margin-bottom: var(--spacing-6);
}

.back-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: 0.75rem 1.25rem;
  background-color: white;
  border: none;
  border-radius: var(--radius-lg);
  color: var(--neutral-700);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-md);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.back-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--primary-gradient);
  opacity: 0;
  transition: opacity var(--transition-normal);
  z-index: 0;
}

.back-button:hover {
  color: white;
  transform: translateX(-5px);
}

.back-button:hover::before {
  opacity: 1;
}

.back-button svg,
.back-button span {
  position: relative;
  z-index: 1;
}

.back-button svg {
  transition: transform var(--transition-normal);
}

.back-button:hover svg {
  transform: translateX(-3px);
  stroke: white;
}

.material-view-card {
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-6);
  margin-bottom: var(--spacing-8);
}

.material-view-header {
  margin-bottom: var(--spacing-6);
  border-bottom: 1px solid var(--neutral-200);
  padding-bottom: var(--spacing-4);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

.title-area {
  flex: 1;
}

.material-view-header h3 {
  font-size: var(--font-size-2xl);
  color: var(--primary-color);
  margin-bottom: var(--spacing-2);
}

.material-view-meta {
  color: var(--neutral-500);
  font-size: var(--font-size-sm);
}

.next-review-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-4);
  background-color: rgba(99, 102, 241, 0.1);
  border-radius: var(--radius-full);
  color: var(--primary-color);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.material-view-content {
  padding: var(--spacing-6) 0;
  line-height: 1.8;
  font-size: var(--font-size-md);
  color: var(--neutral-800);
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: var(--spacing-6);
  border-bottom: 1px solid var(--neutral-200);
}

/* Study History Section */
.study-history-section {
  margin-bottom: var(--spacing-6);
}

.study-history-section h4 {
  margin-bottom: var(--spacing-4);
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-800);
}

.attempts-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.attempt-item {
  background-color: var(--neutral-50);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--neutral-300);
}

.attempt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-3);
}

.score-badge {
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
}

.score-badge.excellent {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.score-badge.good {
  background-color: rgba(6, 182, 212, 0.1);
  color: #06b6d4;
}

.score-badge.fair {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.score-badge.poor {
  background-color: rgba(249, 115, 22, 0.1);
  color: #f97316;
}

.score-badge.very-poor {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.attempt-date {
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.latest-badge {
  background-color: rgba(99, 102, 241, 0.1);
  color: var(--primary-color);
  padding: 0.1rem 0.5rem;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.review-schedule {
  margin-top: var(--spacing-3);
}

.schedule-heading {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--neutral-700);
  margin-bottom: var(--spacing-2);
}

.schedule-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.schedule-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-2) var(--spacing-3);
  background-color: white;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  color: var(--neutral-700);
}

.schedule-item.past-date {
  text-decoration: line-through;
  color: var(--neutral-500);
}

.schedule-item.current-date {
  border-left: 3px solid var(--primary-color);
  font-weight: var(--font-weight-medium);
}

.status-badge {
  padding: 0.1rem 0.5rem;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.status-badge.completed {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.status-badge.due {
  background-color: rgba(99, 102, 241, 0.1);
  color: var(--primary-color);
}

.status-badge.upcoming {
  background-color: rgba(6, 182, 212, 0.1);
  color: #06b6d4;
}

.material-view-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-4);
  padding-top: var(--spacing-6);
}

.material-view-actions .btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

/* Material Edit Mode */
.material-edit {
  animation: fadeIn 0.3s ease forwards;
}

.material-edit-card {
  margin-bottom: var(--spacing-8);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-4);
  margin-top: var(--spacing-6);
}

/* Delete Modal */
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
  width: 400px;
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
}

.delete-modal-body {
  padding: var(--spacing-6);
}

.delete-modal-body p {
  margin-bottom: var(--spacing-3);
}

.text-danger {
  color: #ef4444;
  font-weight: var(--font-weight-medium);
}

.delete-modal-footer {
  padding: var(--spacing-4) var(--spacing-6);
  border-top: 1px solid var(--neutral-200);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-3);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@media (max-width: 768px) {
  .materials-grid {
    grid-template-columns: 1fr;
  }
  
  .material-view-header {
    flex-direction: column;
  }
  
  .material-view-actions,
  .form-actions {
    flex-direction: column;
  }
  
  .material-view-actions .btn,
  .form-actions .btn {
    width: 100%;
  }
  
  .material-actions {
    flex-wrap: wrap;
    gap: var(--spacing-2);
  }
  
  .material-action-btn {
    flex: 1;
    min-width: 80px;
  }
}
</style>