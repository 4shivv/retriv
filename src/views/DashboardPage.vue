<template>
  <div class="dashboard">
    <div class="container">
      <!-- Dashboard Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <h1 class="dashboard-title">Your Learning Dashboard</h1>
          <p class="dashboard-subtitle">Track your progress and manage your study materials</p>
        </div>
        <div class="header-actions">
          <button v-if="currentMode !== 'create'" @click="currentMode = 'create'" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New Material
          </button>
        </div>
      </header>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner-large"></div>
        <p>Loading your dashboard...</p>
      </div>

      <!-- Dashboard Content -->
      <template v-else>
        <!-- Materials List Mode -->
        <div v-if="currentMode === 'list'" class="dashboard-content">
          <!-- Stats Section -->
          <section class="stats-section">
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-header">
                  <div class="stat-icon study-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div class="stat-title">Study Sessions</div>
                </div>
                <div class="stat-content">
                  <div class="stat-value-container">
                    <h3 class="stat-value">{{ studySessions }}</h3>
                    <div class="goal-info">
                      <span class="goal-label">Goal: {{ studySessionGoal }}/month</span>
                      <button @click="showGoalModal = true" class="goal-edit-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div class="stat-progress">
                    <div class="progress-container">
                      <div 
                        class="progress-bar" 
                        :style="{ width: `${Math.min(100, (studySessions / studySessionGoal) * 100)}%` }"
                        :class="{ 'goal-complete': studySessions >= studySessionGoal }"
                      ></div>
                    </div>
                    <div class="progress-label">
                      {{ Math.min(100, Math.floor((studySessions / studySessionGoal) * 100)) }}% of monthly goal
                      <span v-if="studySessions >= studySessionGoal" class="goal-complete-badge">Goal Complete!</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-header">
                  <div class="stat-icon streak-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
                      <path d="M12 9v6"></path>
                      <path d="M9 12h6"></path>
                    </svg>
                  </div>
                  <div class="stat-title">Day Streak</div>
                </div>
                <div class="stat-content">
                  <div class="stat-value-container">
                    <h3 class="stat-value">{{ streak }}</h3>
                    <div class="stat-badge">
                      <span>{{ getStreakStatus(streak) }}</span>
                    </div>
                  </div>
                  <div class="streak-calendar">
                    <div 
                      v-for="i in 7" 
                      :key="i" 
                      class="calendar-day"
                      :class="{ active: i <= streak % 7 || streak >= 7 }"
                    >
                      {{ getDayLabel(i) }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-header">
                  <div class="stat-icon retention-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <path d="M16 13l-4 4l-4-4"></path>
                      <path d="M8 13v-1h8v1"></path>
                    </svg>
                  </div>
                  <div class="stat-title">Avg. Retention</div>
                </div>
                <div class="stat-content">
                  <div class="stat-value-container">
                    <h3 class="stat-value">{{ avgRetention }}%</h3>
                    <div class="stat-change neutral">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      <span>Stable</span>
                    </div>
                  </div>
                  <div class="retention-chart">
                    <div class="chart-bar-container">
                      <div v-for="(value, index) in retentionHistory" :key="index" 
                           class="chart-bar" 
                           :style="{ height: `${value}%`, left: `${index * 14}%` }"
                           :class="getRetentionClass(value)">
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-header">
                  <div class="stat-icon material-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                    </svg>
                  </div>
                  <div class="stat-title">Total Materials</div>
                </div>
                <div class="stat-content">
                  <div class="stat-value-container">
                    <h3 class="stat-value">{{ totalMaterials }}</h3>
                    <div class="stat-change positive" v-if="totalMaterials > 0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="18 15 12 9 6 15"></polyline>
                      </svg>
                      <span>+{{ Math.min(2, totalMaterials) }} new</span>
                    </div>
                  </div>
                  <div class="materials-distribution">
                    <div class="distribution-item" v-for="(category, index) in materialCategories" :key="index">
                      <div class="distribution-color" :style="{ backgroundColor: category.color }"></div>
                      <div class="distribution-label">{{ category.name }}</div>
                      <div class="distribution-value">{{ category.count }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Due Reviews Section -->
          <section class="reviews-section" v-if="hasDueReviews">
            <div class="section-header">
              <h2 class="section-title">Due for Review</h2>
              <div class="reviews-header-meta">
                <p class="section-subtitle">Review these materials to maintain your retention</p>
                <div class="review-stats" v-if="reviewsDueToday > 0">
                  <div class="review-stat-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
                    </svg>
                    <span>{{ reviewsDueToday }} {{ reviewsDueToday === 1 ? 'review' : 'reviews' }} due today</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="due-reviews">
              <div class="review-card" v-for="(review, index) in dueReviews" :key="index" :class="{ 'is-overdue': review.isOverdue }">
                <div class="review-header">
                  <div class="review-badge" :class="{ urgent: review.isOverdue }">
                    {{ review.isOverdue ? 'Overdue' : review.dueLabel }}
                  </div>
                  <div class="review-meta">Last reviewed: {{ review.lastReviewedLabel }}</div>
                </div>
                <h3 class="review-title">{{ review.title }}</h3>
                <div class="review-progress">
                  <div class="progress">
                    <div class="progress-bar" :style="{ width: review.retentionPercentage + '%' }" :class="getRetentionClass(review.retentionPercentage)"></div>
                  </div>
                  <span class="progress-text">{{ review.retentionPercentage }}% retention</span>
                </div>
                <div class="review-actions">
                  <button class="btn btn-primary btn-sm" @click="reviewMaterial(review)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <span>Review Now</span>
                  </button>
                </div>
              </div>
              
              <!-- View All Reviews button -->
              <div v-if="dueReviews.length > 3" class="view-all-container">
                <button class="btn btn-outline btn-sm view-all-btn" @click="viewAllDueReviews">
                  View All {{ dueReviews.length }} Reviews
                </button>
              </div>
            </div>
          </section>

          <!-- Materials Library Section -->
          <section class="materials-section">
            <div class="section-header">
              <h2 class="section-title">Your Materials</h2>
              <!-- Unified Search and Filter Section -->
              <div class="materials-filter">
                <div class="search-box">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input 
                    type="text" 
                    v-model="searchQuery" 
                    placeholder="Search materials..." 
                    class="search-input"
                    @input="filterMaterials"
                  >
                </div>
                <button @click="showFilterMenu = !showFilterMenu" class="filter-toggle-btn" :class="{ active: showFilterMenu }">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                  </svg>
                  <span>Filters</span>
                </button>
                
                <!-- Filter Menu -->
                <div class="filter-menu" v-if="showFilterMenu" @click.stop>
                  <div class="filter-option filter-section">
                    <h5 class="filter-section-title">View Options</h5>
                    <label class="filter-checkbox">
                      <input type="checkbox" v-model="filters.dueReview"> 
                      <span>Show Due Reviews Only</span>
                    </label>
                    <label class="filter-checkbox">
                      <input type="checkbox" v-model="filters.recentlyAdded"> 
                      <span>Recently Added</span>
                    </label>
                  </div>
                  
                  <div class="filter-option filter-section">
                    <h5 class="filter-section-title">Categories</h5>
                    <div class="category-filter-list">
                      <div v-for="category in materialCategories" :key="category.name" class="filter-checkbox-container">
                        <div class="category-checkbox">
                        <input 
                        type="checkbox" 
                        :value="category.name" 
                        v-model="activeCategory"
                        :id="'category-' + category.name"
                        > 
                        <label :for="'category-' + category.name" class="category-name">{{ category.name }}</label>
                        </div>
                                        <button 
                                          class="delete-category-btn" 
                                          @click.stop="handleCategoryDeleteClick(category.name)"
                                          title="Delete category"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                          </svg>
                                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div class="filter-actions">
                    <button class="btn btn-sm btn-outline" @click="applyFilters">Apply</button>
                    <button class="btn btn-sm btn-outline" @click="resetFilters">Reset</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Now using the MaterialList component here -->
            <MaterialList 
              :materials="materials"
              :filtered-materials="filteredMaterials"
              :loading="materialsLoading"
              @select-material="handleSelectMaterial"
              @create-new="currentMode = 'create'"
              @material-edited="handleMaterialEdited"
              @material-deleted="handleMaterialDeleted"
              @category-deleted="handleCategoryDeleted"
            />
          </section>
        </div>

        <!-- Create Material Mode -->
        <div v-else-if="currentMode === 'create'" class="dashboard-content">
          <div class="back-button-container">
            <button @click="currentMode = 'list'" class="back-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back to Materials</span>
            </button>
          </div>

          <InputForm @material-saved="handleMaterialSaved" />
        </div>

        <!-- Study Mode -->
        <div v-else-if="currentMode === 'study'" class="dashboard-content">
          <div class="back-button-container">
            <button @click="currentMode = 'list'" class="back-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back to Materials</span>
            </button>
          </div>

          <BlurtingForm 
            :material-id="currentMaterial.id"
            :title="currentMaterial.title"
            :content="currentMaterial.content"
            @reset="currentMode = 'list'"
            @study-again="handleStudyAgain"
          />
        </div>
      </template>
    </div>

    <!-- Goal Setting Modal -->
    <div v-if="showGoalModal" class="modal-backdrop" @click="showGoalModal = false">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3>Set Monthly Study Goal</h3>
        </div>
        <div class="modal-body">
          <p>Set your monthly study session goal to track your progress.</p>
          <div class="form-group">
            <label for="goalValue" class="form-label">Sessions per month</label>
            <input 
              type="number" 
              id="goalValue" 
              v-model="newGoalValue" 
              class="form-control" 
              min="1" 
              max="100"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="showGoalModal = false">Cancel</button>
          <button class="btn btn-primary" @click="updateStudySessionGoal">Save Goal</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import MaterialList from '@/components/study/MaterialList.vue';
import InputForm from '@/components/study/InputForm.vue';
import BlurtingForm from '@/components/study/BlurtingForm.vue';
import StudyService from '@/services/study.service';

export default {
  name: 'DashboardPage',
  components: {
    MaterialList,
    InputForm,
    BlurtingForm
  },
  
  setup() {
    const currentMode = ref('list'); // 'list', 'create', 'study'
    const currentMaterial = ref(null);
    const loading = ref(true);
    const materials = ref([]);
    const filteredMaterials = ref([]);
    const materialsLoading = ref(false);
    const searchQuery = ref('');
    const showFilterMenu = ref(false);
    
    const filters = ref({
      dueReview: false,
      recentlyAdded: false
    });
    
    // State for category filtering
    const activeCategory = ref([]);
    
    // State variables for dashboard stats - initially empty and populated from real data
    const studySessions = ref(0);
    const streak = ref(0);
    const avgRetention = ref(0);
    // Retention history tracks average retention over time (last 7 attempts)
    const retentionHistory = ref([68, 72, 75, 79, 82, 78, 76]);
    const totalMaterials = ref(0);
    const dueReviews = ref([]);
    const materialCategories = ref([]);
    
    // Extract real categories from materials
    const extractRealCategories = (materials) => {
      const categoryMap = new Map();
      const defaultCategories = [
        { name: 'Programming', color: '#6366F1' },
        { name: 'Languages', color: '#EC4899' },
        { name: 'Science', color: '#10B981' },
        { name: 'Math', color: '#F59E0B' },
        { name: 'History', color: '#8B5CF6' },
        { name: 'Art', color: '#14B8A6' },
        { name: 'Other', color: '#6B7280' },
        { name: 'Uncategorized', color: '#9CA3AF' }
      ];
      
      const colorMap = new Map(defaultCategories.map(cat => [cat.name, cat.color]));
      
      // First add any predefined categories with 0 count
      defaultCategories.forEach(cat => {
        categoryMap.set(cat.name, { name: cat.name, count: 0, color: cat.color });
      });
      
      // Then count actual materials in each category
      materials.forEach(material => {
        const categoryName = material.category || 'Uncategorized';
        if (!categoryMap.has(categoryName)) {
          // If it's a new category not in our defaults, assign it a color
          const color = colorMap.get('Other') || '#6B7280';
          categoryMap.set(categoryName, { name: categoryName, count: 0, color });
        }
        categoryMap.get(categoryName).count++;
      });
      
      // Convert to array and sort - Show only categories with materials
      return Array.from(categoryMap.values())
        .filter(cat => cat.count > 0)
        .sort((a, b) => b.count - a.count); // Sort by count, highest first
    };
    
    const router = useRouter();
    const store = useStore();
    
    // Check if the user has due reviews
    const hasDueReviews = computed(() => {
      return dueReviews.value && dueReviews.value.length > 0;
    });
    
    // Compute the material count that needs review today
    const reviewsDueToday = computed(() => {
      if (!dueReviews.value || dueReviews.value.length === 0) return 0;
      
      return dueReviews.value.filter(review => 
        review.dueLabel === 'Due Today' || review.isOverdue
      ).length;
    });
    
    // Handle category deletion with confirmation
    const handleCategoryDeleteClick = (categoryName) => {
      if (confirm(`Are you sure you want to delete the category "${categoryName}"? \nMaterials in this category will be set to "Uncategorized".`)) {
        handleCategoryDeleted(categoryName);
      }
    };
    
    // Handle category deletion
    const handleCategoryDeleted = async (categoryName) => {
      console.log(`Category deleted: ${categoryName}`);
      loading.value = true;
      
      try {
        // Get all materials with this category
        const materialsToUpdate = materials.value.filter(m => m.category === categoryName);
        
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
        
        // Remove from material categories
        materialCategories.value = materialCategories.value.filter(c => c.name !== categoryName);
        
        // If this was the active category, reset to show all
        if (activeCategory.value === categoryName) {
          activeCategory.value = '';
        }
        
        // Update any materials with this category to be uncategorized in our local arrays
        materials.value.forEach(material => {
          if (material.category === categoryName) {
            material.category = '';
          }
        });
        
        filteredMaterials.value.forEach(material => {
          if (material.category === categoryName) {
            material.category = '';
          }
        });
        
        // Update material categories
        updateMaterialCategories();
        
        // Refresh all materials to ensure everything is in sync
        await fetchMaterials();
        
        // Reapply filters
        filterMaterials();
      } catch (err) {
        console.error('Failed to delete category:', err);
        error.value = err.message || 'Failed to delete category';
      } finally {
        loading.value = false;
      }
    };
    
    // Handle search and filtering
    const filterMaterials = () => {
      let filtered = [...materials.value];
      
      // Apply search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(material => 
          material.title.toLowerCase().includes(query) || 
          material.content.toLowerCase().includes(query)
        );
      }
      
      // Apply due review filter
      if (filters.value.dueReview) {
        filtered = filtered.filter(material => material.hasReview);
      }
      
      // Apply category filter
      if (activeCategory.value && activeCategory.value.length > 0) {
        filtered = filtered.filter(material => activeCategory.value.includes(material.category));
      }
      
      // Apply recently added filter
      if (filters.value.recentlyAdded) {
        // Sort by creation date (newest first)
        filtered.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          return dateB - dateA;
        });
        
        // Take only the 5 most recent
        filtered = filtered.slice(0, 5);
      }
      
      filteredMaterials.value = filtered;
    };
    
    // Reset all filters
    const resetFilters = () => {
      filters.value.dueReview = false;
      filters.value.recentlyAdded = false;
      activeCategory.value = [];
      searchQuery.value = '';
      filterMaterials();
      showFilterMenu.value = false;
    };
    
    // Apply filters
    const applyFilters = () => {
      filterMaterials();
      showFilterMenu.value = false;
    };

    
    // Get streak status message
    const getStreakStatus = (streakValue) => {
      if (streakValue >= 14) return 'Excellent!';
      if (streakValue >= 7) return 'Great!';
      if (streakValue >= 3) return 'Good start!';
      return 'Just started';
    };
    
    // Get day label for streak calendar
    const getDayLabel = (dayIndex) => {
      const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
      return days[dayIndex - 1];
    };
    
    // Get color class based on retention percentage
    const getRetentionClass = (value) => {
      if (value >= 90) return 'excellent';
      if (value >= 80) return 'good';
      if (value >= 70) return 'fair';
      return 'poor';
    };
    
    // Review a material
    const reviewMaterial = (review) => {
      // Find the corresponding material
      const material = materials.value.find(m => m.id === review.materialId);
      if (material) {
        handleSelectMaterial(material);
      } else {
        // Use the review info to create a placeholder material for demo purposes
        handleSelectMaterial({
          id: review.id,
          title: review.title,
          content: "This is a placeholder content for the review. In a real application, this would be the actual content of the material."
        });
      }
    };
    
    // View all due reviews by filtering the materials
    const viewAllDueReviews = () => {
      // Set the filter to show only due reviews
      filters.value.dueReview = true;
      
      // Apply filters
      filterMaterials();
      
      // Scroll to the materials section
      const materialsSection = document.querySelector('.materials-section');
      if (materialsSection) {
        materialsSection.scrollIntoView({ behavior: 'smooth' });
      }
    };
    
    // Calculate streak based on study activity
    const calculateStreak = async () => {
      try {
        // This will be replaced with a direct call to StudyService in production
        // For MVP, we'll simulate streak data based on study attempts
        const attempts = await fetchRecentAttempts();
        if (!attempts || attempts.length === 0) {
          streak.value = 0;
          return;
        }
        
        // Calculate streak based on consecutive days with study attempts
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Create a set of dates (as strings) when the user studied
        const studyDays = new Set();
        attempts.forEach(attempt => {
          const date = attempt.timestamp.toDate ? 
            attempt.timestamp.toDate() : new Date(attempt.timestamp);
          studyDays.add(date.toDateString());
        });
        
        // Calculate streak by checking consecutive days
        let currentStreak = 0;
        const checkDate = new Date(today);
        
        // Check if user studied today
        if (studyDays.has(checkDate.toDateString())) {
          currentStreak = 1;
          // Check previous days
          let keepChecking = true;
          while (keepChecking) {
            checkDate.setDate(checkDate.getDate() - 1);
            if (studyDays.has(checkDate.toDateString())) {
              currentStreak++;
            } else {
              keepChecking = false;
            }
          }
        } else {
          // Check if user studied yesterday (streak still counts)
          checkDate.setDate(checkDate.getDate() - 1);
          if (studyDays.has(checkDate.toDateString())) {
            currentStreak = 1;
            // Check previous days
            let keepChecking = true;
            while (keepChecking) {
              checkDate.setDate(checkDate.getDate() - 1);
              if (studyDays.has(checkDate.toDateString())) {
                currentStreak++;
              } else {
                keepChecking = false;
              }
            }
          }
        }
        
        streak.value = currentStreak;
      } catch (err) {
        console.error('Failed to calculate streak:', err);
        // Keep current value or set a reasonable default
        streak.value = streak.value || 0;
      }
    };
    
    // Fetch recent study attempts across all materials
    const fetchRecentAttempts = async () => {
      try {
        // First get all materials
        const userMaterials = await StudyService.getStudyMaterials();
        if (!userMaterials || userMaterials.length === 0) {
          return [];
        }
        
        // Fetch attempts for each material
        const allAttemptsPromises = userMaterials.map(material => 
          StudyService.getStudyAttempts(material.id)
        );
        
        const allAttemptsArrays = await Promise.all(allAttemptsPromises);
        
        // Flatten array of arrays and sort by timestamp (most recent first)
        let allAttempts = [];
        allAttemptsArrays.forEach(attempts => {
          if (attempts && attempts.length > 0) {
            allAttempts = [...allAttempts, ...attempts];
          }
        });
        
        // Sort by timestamp (newer first)
        allAttempts.sort((a, b) => {
          const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
          const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
          return dateB - dateA;
        });
        
        return allAttempts;
      } catch (err) {
        console.error('Failed to fetch recent attempts:', err);
        return [];
      }
    };
    
    // Calculate average retention based on recent attempts
    const calculateAvgRetention = async () => {
      try {
        const recentAttempts = await fetchRecentAttempts();
        if (!recentAttempts || recentAttempts.length === 0) {
          avgRetention.value = 0;
          return;
        }
        
        // Calculate average retention from recent attempts
        const sum = recentAttempts.reduce((acc, attempt) => 
          acc + attempt.matchPercentage, 0);
        
        avgRetention.value = Math.round(sum / recentAttempts.length);
        
        // Update retention history if we have enough data
        if (recentAttempts.length >= 7) {
          retentionHistory.value = recentAttempts
            .slice(0, 7)
            .map(attempt => attempt.matchPercentage);
        }
      } catch (err) {
        console.error('Failed to calculate average retention:', err);
        // Keep current value
      }
    };

    // Generate due reviews based on materials with scheduled reviews
    const generateDueReviews = async () => {
      try {
        // Get all materials
        const userMaterials = await StudyService.getStudyMaterials();
        if (!userMaterials || userMaterials.length === 0) {
          dueReviews.value = [];
          return;
        }
        
        // Check which materials have upcoming reviews
        const reviewPromises = userMaterials.map(async material => {
          const nextReview = await StudyService.getNextReviewDate(material.id);
          if (!nextReview) return null;
          
          // Get the latest attempt for retention info
          const attempts = await StudyService.getStudyAttempts(material.id);
          let retentionPercentage = 0;
          if (attempts && attempts.length > 0) {
            retentionPercentage = attempts[0].matchPercentage;
          }
          
          // Calculate if it's overdue
          const now = new Date();
          const reviewDate = new Date(nextReview);
          const isOverdue = reviewDate < now;
          
          // Format the due label
          let dueLabel = "";
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          
          if (reviewDate < today) {
            dueLabel = "Past Due";
          } else if (reviewDate < tomorrow) {
            dueLabel = "Due Today";
          } else {
            const nextDay = new Date(today);
            nextDay.setDate(today.getDate() + 1);
            const dayAfter = new Date(today);
            dayAfter.setDate(today.getDate() + 2);
            
            if (reviewDate < dayAfter) {
              dueLabel = "Due Tomorrow";
            } else {
              dueLabel = `Due on ${reviewDate.toLocaleDateString()}`;
            }
          }
          
          // Format last reviewed label
          let lastReviewedLabel = "Never reviewed";
          if (attempts && attempts.length > 0) {
            const lastReviewDate = attempts[0].timestamp?.toDate ? 
              attempts[0].timestamp.toDate() : new Date(attempts[0].timestamp);
            
            // Check if it was today
            if (lastReviewDate.toDateString() === now.toDateString()) {
              lastReviewedLabel = "Today";
            } else {
              lastReviewedLabel = lastReviewDate.toLocaleDateString();
            }
          }
          
          return {
            id: material.id,
            materialId: material.id,
            title: material.title,
            nextReview: reviewDate,
            isOverdue,
            dueLabel,
            retentionPercentage,
            lastReviewedLabel
          };
        });
        
        const reviews = (await Promise.all(reviewPromises))
          .filter(review => review !== null)
          // Sort by date (overdue first, then by chronological order)
          .sort((a, b) => {
            if (a.isOverdue && !b.isOverdue) return -1;
            if (!a.isOverdue && b.isOverdue) return 1;
            return a.nextReview - b.nextReview;
          });
        
        dueReviews.value = reviews;
      } catch (err) {
        console.error('Failed to generate due reviews:', err);
        dueReviews.value = [];
      }
    };
    
    // Fetch materials from service
    const fetchMaterials = async () => {
      try {
        loading.value = true;
        const user = store.getters['auth/user'];
        
        if (!user) {
          throw new Error("User not authenticated");
        }
        
        // Fetch materials from Firebase
        const fetchedMaterials = await StudyService.getStudyMaterials(user.uid);
        materials.value = fetchedMaterials;
        filteredMaterials.value = fetchedMaterials;
        totalMaterials.value = fetchedMaterials.length;
        
        // Update material categories counts based on actual material categories
        if (fetchedMaterials.length > 0) {
          // First extract real categories from materials
        materialCategories.value = extractRealCategories(fetchedMaterials);
        }
        
        // Load actual study sessions from the service
        try {
          const sessions = await StudyService.getMonthlyStudySessions();
          studySessions.value = sessions;
        } catch (err) {
          console.error('Failed to load study sessions:', err);
          // Keep current value or set to a reasonable default
          studySessions.value = studySessions.value || 0;
        }
        
        return fetchedMaterials;
      } catch (error) {
        console.error("Error fetching materials:", error);
        return [];
      } finally {
        loading.value = false;
      }
    };
    
    const handleSelectMaterial = (material) => {
      currentMaterial.value = material;
      currentMode.value = 'study';
    };
    
    const handleMaterialSaved = async (material) => {
      if (material && material.id) {
        // Ensure we have the complete material object
        currentMaterial.value = material;
        
        // Refetch materials to update the list
        await fetchMaterials();
        
        // Switch to study mode
        currentMode.value = 'study';
      } else {
        console.error('Invalid material data received:', material);
      }
    };
    
    const handleMaterialEdited = async (updatedMaterial) => {
      // Find and update the material in the local array
      const index = materials.value.findIndex(m => m.id === updatedMaterial.id);
      if (index !== -1) {
        materials.value[index] = updatedMaterial;
        
        // Also update in filtered materials if present
        const filteredIndex = filteredMaterials.value.findIndex(m => m.id === updatedMaterial.id);
        if (filteredIndex !== -1) {
          filteredMaterials.value[filteredIndex] = updatedMaterial;
        }
      }
      
      // Optionally refetch all materials to ensure consistency
      await fetchMaterials();
    };
    
    const handleMaterialDeleted = async (materialId) => {
      // Remove the material from the local arrays
      materials.value = materials.value.filter(m => m.id !== materialId);
      filteredMaterials.value = filteredMaterials.value.filter(m => m.id !== materialId);
      
      // Update the total count
      totalMaterials.value = materials.value.length;
      
      // Update material categories
      updateMaterialCategories();
    };
    
    // This duplicate implementation has been removed
    
    const handleStudyAgain = () => {
      // The BlurtingForm component will handle the reset internally
      console.log("Study Again clicked for:", currentMaterial.value.title);
    };
    
    // Update material categories based on current materials
    const updateMaterialCategories = () => {
      // Reset counts
      materialCategories.value.forEach(category => {
        category.count = 0;
      });
      
      // Distribute materials among categories for demo
      materials.value.forEach((material, index) => {
        const categoryIndex = index % materialCategories.value.length;
        materialCategories.value[categoryIndex].count++;
      });
    };
    
    // Watch for search query changes
    watch(searchQuery, () => {
      filterMaterials();
    });
    
    // Inside the setup() function, add these new refs:
    const studySessionGoal = ref(20); // Default goal is 20 sessions per month
    const showGoalModal = ref(false);
    const newGoalValue = ref(20);
    const error = ref(''); // Added error ref that was missing
    
    // Add new methods
    const loadStudySessionGoal = async () => {
      try {
        const goal = await StudyService.getStudySessionGoal();
        studySessionGoal.value = goal;
      } catch (err) {
        console.error("Error loading study session goal:", err);
        // Keep the default value
      }
    };
    
    const updateStudySessionGoal = async () => {
      try {
        if (newGoalValue.value < 1) {
          newGoalValue.value = 1;
        }
        
        await StudyService.setStudySessionGoal(newGoalValue.value);
        studySessionGoal.value = newGoalValue.value;
        showGoalModal.value = false;
      } catch (err) {
        console.error("Error updating study session goal:", err);
        error.value = "Failed to update your study goal.";
      }
    };
    
    const loadStudySessions = async () => {
      try {
        const sessions = await StudyService.getMonthlyStudySessions();
        studySessions.value = sessions;
      } catch (err) {
        console.error("Error loading study sessions:", err);
        // Keep the default or previous value
      }
    };
    
    // Update the onMounted hook to include the new fetch:
    // Close filter menu when clicking outside
    const closeFilterMenu = (event) => {
      if (showFilterMenu.value && !event.target.closest('.filter-menu') && !event.target.closest('.filter-toggle-btn')) {
        showFilterMenu.value = false;
      }
    };
    
    onMounted(async () => {
      // Check authentication
      const user = store.getters['auth/user'];
      if (!user) {
        router.push('/login');
        return;
      }
      
      try {
        loading.value = true;
        
        // Load all data in parallel
        await Promise.all([
          fetchMaterials(),
          loadStudySessionGoal(),
          loadStudySessions(),
          calculateStreak(),
          calculateAvgRetention(),
          generateDueReviews()
        ]);
        
        // Add event listener to close filter menu when clicking outside
        document.addEventListener('click', closeFilterMenu);
      } catch (err) {
        console.error("Error initializing dashboard:", err);
      } finally {
        loading.value = false;
      }
    });
    
    // Remove event listener when component is unmounted
    onBeforeUnmount(() => {
      document.removeEventListener('click', closeFilterMenu);
    });
    
    return {
      currentMode,
      currentMaterial,
      loading,
      materials,
      filteredMaterials,
      materialsLoading,
      searchQuery,

      filters,
      hasDueReviews,
      dueReviews,
      reviewsDueToday,
      studySessions,
      streak,
      avgRetention,
      totalMaterials,
      retentionHistory,
      materialCategories,
      handleSelectMaterial,
      handleMaterialSaved,
      handleMaterialEdited,
      handleMaterialDeleted,
      handleCategoryDeleted,
      handleCategoryDeleteClick,
      handleStudyAgain,
      filterMaterials,
      applyFilters,
      resetFilters,
      showFilterMenu,
      activeCategory,
      calculateStreak,
      calculateAvgRetention,
      generateDueReviews,
      extractRealCategories,

      getStreakStatus,
      getDayLabel,
      getRetentionClass,
      reviewMaterial,
      viewAllDueReviews,
      studySessionGoal,
      showGoalModal,
      newGoalValue,
      error,
      updateStudySessionGoal,
      loadStudySessionGoal,
      loadStudySessions,
    };
  }
}
</script>

<style scoped>
.dashboard {
  padding-top: 5rem;
  min-height: 100vh;
  background-color: var(--neutral-50);
}

/* Dashboard Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-8);
  padding-top: var(--spacing-12);
}

.dashboard-title {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-2);
  color: var(--neutral-900);
}

.dashboard-subtitle {
  color: var(--neutral-600);
  margin-bottom: 0;
}

.header-actions .btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.icon {
  stroke-width: 2.5;
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

/* Dashboard Content */
.dashboard-content {
  margin-bottom: var(--spacing-16);
}

/* Improved Back Button */
.back-button-container {
  margin-bottom: var(--spacing-8);
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

/* Enhanced Stats Section */
.stats-section {
  margin-bottom: var(--spacing-8);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-6);
}

.stat-card {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  border: 1px solid var(--neutral-200);
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
  border-color: var(--neutral-300);
}

.stat-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-4);
}

.stat-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-md);
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

.stat-title {
  font-weight: var(--font-weight-medium);
  color: var(--neutral-700);
  font-size: var(--font-size-md);
}

.stat-content {
  position: relative;
}

.stat-value-container {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: var(--spacing-3);
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: 0;
  color: var(--neutral-900);
}

.stat-change {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-full);
}

.stat-change.positive {
  color: #10b981;
  background-color: rgba(16, 185, 129, 0.1);
}

.stat-change.negative {
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
}

.stat-change.neutral {
  color: #f59e0b;
  background-color: rgba(245, 158, 11, 0.1);
}

.stat-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.75rem;
  background-color: rgba(99, 102, 241, 0.1);
  color: var(--primary-color);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

/* Streak Calendar */
.streak-calendar {
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-2);
}

.calendar-day {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background-color: var(--neutral-200);
  color: var(--neutral-500);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-normal);
}

.calendar-day.active {
  background-color: var(--secondary-color);
  color: white;
}

/* Progress Bar */
.stat-progress {
  margin-top: var(--spacing-3);
}

.progress-container {
  height: 6px;
  background-color: var(--neutral-200);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: var(--primary-gradient);
  border-radius: var(--radius-full);
}

.progress-label {
  font-size: var(--font-size-xs);
  color: var(--neutral-600);
  margin-top: var(--spacing-1);
}

/* Retention Chart */
.retention-chart {
  margin-top: var(--spacing-3);
  height: 50px;
  position: relative;
}

.chart-bar-container {
  height: 100%;
  position: relative;
}

.chart-bar {
  position: absolute;
  bottom: 0;
  width: 6px;
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
}

.chart-bar.excellent {
  background-color: rgba(16, 185, 129, 0.7);
}

.chart-bar.good {
  background-color: rgba(6, 182, 212, 0.7);
}

.chart-bar.fair {
  background-color: rgba(245, 158, 11, 0.7);
}

.chart-bar.poor {
  background-color: rgba(239, 68, 68, 0.7);
}

/* Materials Distribution */
.materials-distribution {
  margin-top: var(--spacing-3);
}

.distribution-item {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-2);
}

.distribution-color {
  width: 10px;
  height: 10px;
  border-radius: var(--radius-sm);
  margin-right: var(--spacing-2);
}

.distribution-label {
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--neutral-700);
}

.distribution-value {
  font-weight: var(--font-weight-medium);
  color: var(--neutral-900);
}

/* Reviews Section */
.reviews-section {
  margin-bottom: var(--spacing-12);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: var(--spacing-6);
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

.section-title {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-2);
  color: var(--neutral-900);
}

.section-subtitle {
  color: var(--neutral-600);
  margin-bottom: 0;
  font-size: var(--font-size-md);
}

.due-reviews {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-6);
}

.review-card {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  border: 1px solid var(--neutral-200);
}

.review-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-light);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
}

.review-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: rgba(99, 102, 241, 0.1);
  color: var(--primary-color);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.review-badge.urgent {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.review-meta {
  font-size: var(--font-size-xs);
  color: var(--neutral-500);
}

.review-title {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-4);
  color: var(--neutral-900);
}

.review-progress {
  margin-bottom: var(--spacing-4);
}

.progress {
  height: 0.5rem;
  background-color: var(--neutral-200);
  border-radius: var(--radius-full);
  margin-bottom: var(--spacing-2);
  overflow: hidden;
}

.progress-text {
  font-size: var(--font-size-xs);
  color: var(--neutral-600);
}

.review-actions {
  display: flex;
  justify-content: flex-end;
}

/* Materials Section */
.materials-section {
  margin-bottom: var(--spacing-12);
}

.materials-filter {
  display: flex;
  gap: var(--spacing-4);
}

.search-box {
  position: relative;
  width: 250px;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: var(--neutral-500);
}

.search-input {
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: 1px solid var(--neutral-300);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  transition: all var(--transition-normal);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

.filter-dropdown {
  position: relative;
}





/* Responsive Styles */
@media (max-width: 992px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-4);
  }
  
  .materials-filter {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-3);
  }
  
  .search-box {
    width: 100%;
  }
  
  .filter-dropdown {
    width: 100%;
  }
  
  .filter-button {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-4);
  }
  
  .header-actions .btn {
    width: 100%;
    justify-content: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }
  
  .due-reviews {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }
}

/* New CSS rules */
.edit-goal {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  background-color: var(--neutral-100);
  color: var(--neutral-600);
  font-size: var(--font-size-xs);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.edit-goal:hover {
  background-color: var(--neutral-200);
  color: var(--primary-color);
}

/* Modal Styles */
.modal-backdrop {
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

.modal-container {
  background-color: white;
  border-radius: var(--radius-lg);
  width: 400px;
  max-width: 90%;
  box-shadow: var(--shadow-xl);
  animation: fadeIn 0.3s ease-out;
}

.modal-header {
  padding: var(--spacing-4) var(--spacing-6);
  border-bottom: 1px solid var(--neutral-200);
}

.modal-header h3 {
  margin: 0;
  font-weight: var(--font-weight-semibold);
}

.modal-body {
  padding: var(--spacing-6);
}

.modal-body p {
  color: var(--neutral-600);
  margin-bottom: var(--spacing-4);
}

.form-group {
  margin-bottom: var(--spacing-4);
}

.form-label {
  display: block;
  margin-bottom: var(--spacing-2);
  color: var(--neutral-700);
  font-weight: var(--font-weight-medium);
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--neutral-300);
  border-radius: var(--radius-md);
  font-size: var(--font-size-md);
  transition: all var(--transition-normal);
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

.modal-footer {
  padding: var(--spacing-4) var(--spacing-6);
  border-top: 1px solid var(--neutral-200);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-3);
}

.modal-footer .btn {
  min-width: 100px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.goal-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.goal-label {
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
  background-color: var(--neutral-100);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-full);
}

.goal-edit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--neutral-500);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.goal-edit-btn:hover {
  color: var(--primary-color);
  background-color: var(--neutral-100);
}

.goal-complete {
  background: linear-gradient(90deg, var(--primary-color) 0%, #10b981 100%);
}

.goal-complete-badge {
  display: inline-block;
  margin-left: var(--spacing-2);
  color: #10b981;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-xs);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.7; }
  50% { opacity: 1; }
  100% { opacity: 0.7; }
}

/* Filter styles */
.materials-filter {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  position: relative;
}

.search-box {
  position: relative;
  width: 250px;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: var(--neutral-500);
}

.search-input {
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: 1px solid var(--neutral-300);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  transition: all var(--transition-normal);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
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

.filter-section {
  margin-bottom: var(--spacing-4);
}

.filter-section-title {
  margin-bottom: var(--spacing-2);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-700);
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-2);
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--neutral-700);
}

.filter-checkbox input {
  cursor: pointer;
}

/* Delete category button */
.delete-category-btn {
  background: none;
  border: none;
  color: var(--neutral-500);
  cursor: pointer;
  padding: var(--spacing-1);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.delete-category-btn:hover {
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
  transform: scale(1.1);
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

.category-filter-list {
  max-height: 150px;
  overflow-y: auto;
  padding-right: var(--spacing-2);
  margin-bottom: var(--spacing-2);
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

/* Enhanced review section styles */
.reviews-header-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.review-stats {
  display: flex;
  gap: var(--spacing-3);
}

.review-stat-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: 0.3rem 0.75rem;
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.review-card {
  transition: all var(--transition-normal);
  position: relative;
}

.review-card.is-overdue {
  border-left: 4px solid #ef4444;
}

.review-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.progress-bar.excellent {
  background: linear-gradient(90deg, #10b981, #0ea5e9);
}

.progress-bar.good {
  background: linear-gradient(90deg, #0ea5e9, #6366f1);
}

.progress-bar.fair {
  background: linear-gradient(90deg, #f59e0b, #f97316);
}

.progress-bar.poor {
  background: linear-gradient(90deg, #f97316, #ef4444);
}

.progress-bar.very-poor {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.review-actions .btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.view-all-container {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-6);
}

.view-all-btn {
  position: relative;
  overflow: hidden;
  min-width: 200px;
  justify-content: center;
}

.view-all-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}
</style>