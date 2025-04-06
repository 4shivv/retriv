<template>
  <div class="material-list">
    <!-- Material List Mode -->
    <div v-if="!viewMode && !editMode">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner-large"></div>
        <p>Loading materials...</p>
      </div>
      
      <div v-else-if="!materials || materials.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round">
            <!-- Sleeping dog with books -->
            <!-- Main body/back -->
            <path d="M9 15c0-3 1-5.5 4-5.5s4 2 4.5 5c.3 2 0 3.5-1.5 3.5" fill="none" />
            <!-- Head -->
            <circle cx="8" cy="12" r="3.2" />
            <!-- Ears -->
            <path d="M5.5 10c-.8-1-1.5-.6-1.5.2" stroke-width="0.9" />
            <path d="M6 9.5c-.4-1.2.3-1.8 1.2-1" stroke-width="0.9" />
            <!-- Face details -->
            <circle cx="6.8" cy="11.2" r="0.4" fill="currentColor" />
            <path d="M7.5 13.2c.8.4 1.5.2 1.8-.2" />
            <path d="M9 12c0 .1-.1.2-.2.2" />
            <!-- Sleeping Z's -->
            <path d="M11 9l1.2-.8-1-.8" stroke-width="0.7" />
            <path d="M12.5 7.5l1.8-1.2-1.5-1.2" stroke-width="0.7" />
            <!-- Paws -->
            <path d="M6 15c.5.3 1.2.4 2 0" />
            <circle cx="16" cy="18" r="1" />
            <!-- Wagging tail -->
            <path d="M17 16c1-.2 2-1 2-2.5" stroke-width="1" />
            <!-- Books scattered around -->
            <rect x="13" y="18" width="6" height="1.5" rx="0.3" />
            <rect x="12" y="19.5" width="5" height="1.5" rx="0.3" />
            <rect x="7" y="17" width="4" height="1.5" rx="0.3" />
            <rect x="5" y="18.5" width="6" height="1.5" rx="0.3" />
            <rect x="9" y="20" width="5" height="1.5" rx="0.3" />
            <!-- Collar -->
            <path d="M6.8 15.3c.8.3 1.8.3 2.4 0" stroke-width="0.7" stroke="#6366f1" />
            <circle cx="8" cy="15.3" r="0.25" fill="#6366f1" stroke="none" />
          </svg>
        </div>
        <h3>No study materials yet</h3>
        <p>Start creating your first study material to begin your learning journey.</p>
        <button @click="$emit('create-new')" class="btn btn-primary">Create Your First Material</button>
      </div>
      
      <div v-else>
        <div class="materials-grid">
          <div 
            v-for="material in filteredMaterials" 
            :key="material.id"
            class="material-card"
            :class="{ 'has-review': material.hasReview }"
          >
            <div class="material-header">
              <div class="material-category">{{ material.category || 'Uncategorized' }}</div>
              <div class="material-actions-menu">
                <button class="action-menu-button" @click.stop="toggleActionMenu(material.id)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                  </svg>
                </button>
                <div v-if="activeActionMenu === material.id" class="action-menu">
                  <button class="action-menu-item" @click.stop="editMaterial(material)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    <span>Edit</span>
                  </button>
                  <button class="action-menu-item danger" @click.stop="deleteMaterial(material)">
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
            <div class="material-date">{{ formatDate(material.createdAt) }}</div>
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
                  @click.stop="startBlurting(material)" 
                    class="btn btn-primary btn-sm material-action-btn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    <span>Blurting</span>
                  </button>
                  <button 
                    @click.stop="startFeynman(material)" 
                    class="btn btn-outline btn-sm material-action-btn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M23 6l-9.5 9.5-5-5L1 18"></path>
                      <path d="M17 6h6v6"></path>
                    </svg>
                    <span>Feynman</span>
                  </button>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
    
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
            <div class="material-category-badge">{{ selectedMaterial.category || 'Uncategorized' }}</div>
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
        <div class="study-technique-buttons">
        <button @click="blurtingMaterial" class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
            Blurting Technique
          </button>
        <button @click="feynmanMaterial" class="btn btn-outline">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M23 6l-9.5 9.5-5-5L1 18"></path>
          <path d="M17 6h6v6"></path>
        </svg>
          Feynman Technique
        </button>
        </div>
          <div class="management-buttons">
              <button @click="editMaterial" class="btn btn-outline">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit Material
              </button>
              <button @click="deleteMaterial(selectedMaterial)" class="btn btn-danger">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                Delete Material
              </button>
            </div>
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
              <label class="form-label">Category</label>
              <div class="category-select-container">
                <select
                  v-model="editForm.category"
                  class="form-control"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  <option value="Programming">Programming</option>
                  <option value="Languages">Languages</option>
                  <option value="Science">Science</option>
                  <option value="Math">Math</option>
                  <option value="History">History</option>
                  <option value="Art">Art</option>
                  <option value="Other">Other</option>
                </select>
              </div>
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
    
    <!-- Delete Category Confirmation Modal -->  
    <div v-if="showCategoryDeleteModal" class="delete-modal-backdrop" @click="cancelCategoryDelete">
      <div class="delete-modal" @click.stop>
        <div class="delete-modal-header">
          <h4>Delete Category</h4>
        </div>
        <div class="delete-modal-body">
          <p>Are you sure you want to delete the category "{{ categoryToDelete }}"?</p>
          <p class="text-warning">Materials in this category will be set to "Uncategorized".</p>
        </div>
        <div class="delete-modal-footer">
          <button @click="cancelCategoryDelete" class="btn btn-outline">Cancel</button>
          <button @click="deleteCategory" class="btn btn-danger" :disabled="categoryDeleteLoading">
            <span v-if="categoryDeleteLoading" class="loading-spinner"></span>
            <span v-else>Delete Category</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Delete Material Confirmation Modal -->
    <div v-if="showDeleteModal" class="delete-modal-backdrop" @click="cancelDelete">
      <div class="delete-modal" @click.stop>
        <div class="delete-modal-header">
          <h4>Delete Material</h4>
        </div>
        <div class="delete-modal-body">
          <p>Are you sure you want to delete "{{ selectedMaterial?.title }}"?</p>
          <p class="text-danger">This action cannot be undone and will delete all study history associated with this material.</p>
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
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
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
    },
    filteredMaterials: {
      type: Array,
      default: () => []
    }
  },
  emits: ['select-material', 'create-new', 'material-edited', 'material-deleted', 'category-deleted'],
  
  setup(props, { emit }) {
    const router = useRouter();
    const viewMode = ref(false);
    const editMode = ref(false);
    const selectedMaterial = ref(null);
    const error = ref('');
    const isLoading = ref(false);
    const showDeleteModal = ref(false);
    const deleteLoading = ref(false);
    const showCategoryDeleteModal = ref(false);
    const categoryDeleteLoading = ref(false);
    const categoryToDelete = ref('');
    const studyAttempts = ref([]);
    const nextReviewDate = ref(null);
    const activeActionMenu = ref(null);
    // These filter-related properties are now managed by the parent component
    
    // Form data for editing
    const editForm = ref({
      title: '',
      content: '',
      category: ''
    });
    
    // Category management for the list component
    
    // Handle category deletion
    const confirmDeleteCategory = (category) => {
      categoryToDelete.value = category;
      showCategoryDeleteModal.value = true;
    };
    
    const cancelCategoryDelete = () => {
      showCategoryDeleteModal.value = false;
      categoryToDelete.value = '';
    };
    
    const deleteCategory = async () => {
      if (!categoryToDelete.value) return;
      
      try {
        categoryDeleteLoading.value = true;
        
        // Get all materials with this category
        const materialsToUpdate = props.materials.filter(m => m.category === categoryToDelete.value);
        
        // Update all materials in this category to 'Uncategorized'
        const updatePromises = materialsToUpdate.map(material => 
          StudyService.updateStudyMaterial(
            material.id, 
            material.title, 
            material.content, 
            ''
          )
        );
        
        await Promise.all(updatePromises);
        // Category deletion now handled by parent component
        
        // Emit an event to refresh the materials list
        emit('category-deleted', categoryToDelete.value);
        
        // Close modal
        showCategoryDeleteModal.value = false;
        categoryToDelete.value = '';
      } catch (err) {
        console.error('Failed to delete category:', err);
        error.value = err.message || 'Failed to delete category';
      } finally {
        categoryDeleteLoading.value = false;
      }
    };
    
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
    
    // Toggle action menu
    const toggleActionMenu = (materialId) => {
      if (activeActionMenu.value === materialId) {
        activeActionMenu.value = null;
      } else {
        activeActionMenu.value = materialId;
      }
    };
    
    // Close all action menus when clicking outside
    const closeActionMenus = (event) => {
      // If clicking on a menu button, don't close
      if (event.target.closest('.action-menu-button')) {
        return;
      }
      
      // Otherwise, close any open menu
      activeActionMenu.value = null;
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
      activeActionMenu.value = null;
      
      // Fetch study attempts for this material
      await fetchStudyAttempts(material.id);
    };
    
    // Close view
    const closeView = () => {
      viewMode.value = false;
      selectedMaterial.value = null;
      studyAttempts.value = [];
    };
    

    // Blurting technique from material view
    const blurtingMaterial = () => {
      if (selectedMaterial.value) {
        router.push(`/study/blurting/${selectedMaterial.value.id}`);
      }
    };
    
    // Feynman technique from material view
    const feynmanMaterial = () => {
      if (selectedMaterial.value) {
        router.push(`/study/feynman/${selectedMaterial.value.id}`);
      }
    };
    

    // Start blurting technique
    const startBlurting = (material) => {
      router.push(`/study/blurting/${material.id}`);
    };
    
    // Start Feynman technique
    const startFeynman = (material) => {
      router.push(`/study/feynman/${material.id}`);
    };
    
    // Edit material
    const editMaterial = (material) => {
      selectedMaterial.value = material || selectedMaterial.value;
      editForm.value.title = selectedMaterial.value.title;
      editForm.value.content = selectedMaterial.value.content;
      editForm.value.category = selectedMaterial.value.category || ''; // Include category in edit form
      editMode.value = true;
      viewMode.value = false;
      activeActionMenu.value = null;
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
        
        // Update material in database with category
        await StudyService.updateStudyMaterial(
          selectedMaterial.value.id,
          editForm.value.title,
          editForm.value.content,
          editForm.value.category
        );
        
        // Update the material object
        const updatedMaterial = {
          ...selectedMaterial.value,
          title: editForm.value.title,
          content: editForm.value.content,
          category: editForm.value.category, // Update with new category
          updatedAt: new Date()
        };
        
        // Emit event to refresh materials
        emit('material-edited', updatedMaterial);
        
        // Go back to view mode
        selectedMaterial.value = updatedMaterial;
        editMode.value = false;
        viewMode.value = true;
        
        // Emit event to reload categories
        emit('reload-categories');
        
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
      activeActionMenu.value = null;
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
        
        // Emit event to reload categories
        emit('reload-categories');
        
      } catch (err) {
        console.error('Failed to delete material:', err);
        error.value = err.message || 'Failed to delete material';
      } finally {
        deleteLoading.value = false;
      }
    };
    
    // Category loading is now handled by the parent component
    
    // Filtering is now handled by the parent component
    
    onMounted(() => {
      // Add event listener to close action menus when clicking outside
      document.addEventListener('click', closeActionMenus);
    });
    
    onBeforeUnmount(() => {
      // Remove event listener
      document.removeEventListener('click', closeActionMenus);
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
      showCategoryDeleteModal,
      categoryDeleteLoading,
      categoryToDelete,
      studyAttempts,
      nextReviewDate,
      activeActionMenu,
      truncateText,
      formatDate,
      formatDateWithTime,
      formatReviewDate,
      isReviewDue,
      isPastDate,
      isCurrentDate,
      getScoreClass,
      toggleActionMenu,
      viewMaterial,
      closeView,
      blurtingMaterial,
      feynmanMaterial,
      startBlurting,
      startFeynman,
      editMaterial,
      cancelEdit,
      saveEdit,
      deleteMaterial,
      cancelDelete,
      confirmDelete,
      confirmDeleteCategory,
      cancelCategoryDelete,
      deleteCategory
    };
  }
}
</script>

<style scoped>
.material-list {
  width: 100%;
}

/* Category Filter Styles */
.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.category-chip {
  background-color: white;
  border: 1px solid var(--neutral-300);
  border-radius: var(--radius-full);
  padding: 0.35rem 0.75rem;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--neutral-700);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.category-chip:hover {
  background-color: var(--neutral-100);
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.category-chip.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  box-shadow: var(--shadow-sm);
}

/* Material category badge */
.material-category {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  background-color: var(--neutral-100);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--primary-color);
}

.material-category-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  background-color: var(--primary-color);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: white;
  margin-bottom: 0.5rem;
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

.loading-spinner-large {
  width: 2rem;
  height: 2rem;
  border: 3px solid rgba(99, 102, 241, 0.2);
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

/* List Controls */
.list-controls {
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--spacing-4);
  position: relative;
}

.filter-toggle-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px solid var(--neutral-300);
  border-radius: var(--radius-md);
  color: var(--neutral-700);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
}

.filter-toggle-btn:hover, .filter-toggle-btn.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.filter-toggle-btn.active svg {
  animation: pulse-light 2s infinite;
}

@keyframes pulse-light {
  0% { opacity: 0.7; }
  50% { opacity: 1; }
  100% { opacity: 0.7; }
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
  display: flex;
  flex-direction: column;
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
  margin-bottom: var(--spacing-2);
}

.material-date {
  font-size: var(--font-size-xs);
  color: var(--neutral-500);
  margin-bottom: var(--spacing-3);
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
  flex-grow: 1;
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
  margin-top: auto;
}

.material-actions {
  display: flex;
  gap: var(--spacing-2);
  justify-content: center;
  flex-wrap: wrap;
}

.material-action-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: 0.35rem 0.75rem;
  font-size: var(--font-size-xs);
}

/* Action Menu */
.material-actions-menu {
  position: relative;
}

.action-menu-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background-color: transparent;
  color: var(--neutral-500);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.action-menu-button:hover {
  background-color: var(--neutral-200);
  color: var(--neutral-700);
}

.action-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 150px;
  background-color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 10;
  overflow: hidden;
  border: 1px solid var(--neutral-200);
  margin-top: var(--spacing-1);
}

.action-menu-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  width: 100%;
  padding: var(--spacing-2) var(--spacing-3);
  border: none;
  background-color: transparent;
  color: var(--neutral-700);
  font-size: var(--font-size-sm);
  text-align: left;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.action-menu-item:hover {
  background-color: var(--neutral-100);
}

.action-menu-item.danger {
  color: #ef4444;
}

.action-menu-item.danger:hover {
  background-color: rgba(239, 68, 68, 0.1);
}

/* Material View */
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
  overflow: hidden;
  margin-bottom: var(--spacing-8);
}

.material-view-header {
  margin-bottom: var(--spacing-6);
  border-bottom: 1px solid var(--neutral-200);
  padding: var(--spacing-6) var(--spacing-6) var(--spacing-4);
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
  padding: 0 var(--spacing-6) var(--spacing-6);
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
  margin: var(--spacing-4) var(--spacing-6) var(--spacing-6);
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
  flex-direction: column;
  gap: var(--spacing-4);
  padding: 0 var(--spacing-6) var(--spacing-6);
}

.study-technique-buttons {
  display: flex;
  justify-content: center;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-2);
}

.management-buttons {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-4);
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

/* Delete Confirmation Modal */
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
  color: #ef4444;
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

.text-warning {
  color: #f59e0b;
  font-weight: var(--font-weight-medium);
}

.delete-modal-footer {
  padding: var(--spacing-4) var(--spacing-6);
  border-top: 1px solid var(--neutral-200);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-3);
}

/* Button Styles */
.btn {
  cursor: pointer;
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-normal);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: var(--primary-gradient);
  color: white;
  padding: 0.5rem 1rem;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-outline {
  background-color: transparent;
  border: 1px solid var(--neutral-300);
  color: var(--neutral-700);
  padding: 0.5rem 1rem;
}

.btn-outline:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.btn-danger {
  background-color: #ef4444;
  color: white;
  padding: 0.5rem 1rem;
}

.btn-danger:hover {
  background-color: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(239, 68, 68, 0.25);
}

.btn-sm {
  font-size: var(--font-size-sm);
  padding: 0.35rem 0.75rem;
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
  
  .category-filter {
    overflow-x: auto;
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
  }
}

/* Add filter menu styles */
.filter-menu {
  min-width: 250px;
  max-width: 320px;
  position: absolute;
  top: 45px;
  right: 0;
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: 100;
  padding: var(--spacing-4);
  border: 1px solid var(--neutral-200);
}

.filter-checkbox-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-1) 0;
  border-bottom: 1px solid var(--neutral-100);
}

.category-checkbox {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  cursor: pointer;
}

.delete-category-btn {
  background: none;
  border: none;
  color: var(--neutral-500);
  cursor: pointer;
  padding: var(--spacing-2);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  margin-right: -8px;
}

.delete-category-btn:hover {
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
  transform: scale(1.1);
}

.category-help {
  font-size: var(--font-size-xs);
  font-weight: normal;
  color: var(--neutral-500);
  font-style: italic;
  margin-left: var(--spacing-2);
}

.category-name {
  white-space: normal;
  word-break: break-word;
}

.filter-actions {
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-3);
}

.category-filter-list {
  max-height: 150px;
  overflow-y: auto;
  padding-right: var(--spacing-2);
  margin-bottom: var(--spacing-2);
}
</style>