<template>
  <div class="dashboard">
    <div class="container container-xl">
      <!-- Dashboard Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <h1 class="dashboard-title">Active Recall Dashboard</h1>
        </div>
      </header>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner-large"></div>
        <p>Loading your dashboard...</p>
      </div>

      <!-- Dashboard Content -->
      <div v-else>
        <!-- Materials List Mode -->
        <div v-if="currentMode === 'list'" class="dashboard-content">
          <!-- Due Reviews Section -->
          <section v-if="hasDueReviews" class="reviews-section">
            <div class="section-header">
              <h2 class="section-title">Due for Review</h2>
              <div class="reviews-header-meta">
                <div class="review-stats-container">
                  <div class="review-stats" v-if="reviewsDueToday > 0 || reviewsOverdue > 0">
                    <div class="review-stat-badge" v-if="reviewsDueToday > 0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
                      </svg>
                      <span>{{ reviewsDueToday }} {{ reviewsDueToday === 1 ? 'review' : 'reviews' }} due today</span>
                    </div>
                    <div class="review-stat-badge urgent" v-if="reviewsOverdue > 0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      <span>{{ reviewsOverdue }} {{ reviewsOverdue === 1 ? 'review' : 'reviews' }} overdue</span>
                    </div>
                  </div>
                  <!-- Calendar integration removed -->
                </div>
              </div>
            </div>

            <div class="due-reviews">
              <div class="review-card" v-for="(review, index) in dueReviews" :key="index" :class="{ 'is-overdue': review.isOverdue }">
                <div class="review-header">
                  <div class="review-badge" :class="{ urgent: review.isOverdue }">
                    {{ review.isOverdue ? 'Overdue' : review.dueLabel }}
                  </div>
                  <div class="sr-phase-badge" v-if="review.currentPhase && review.totalReviews">
                    Phase {{ review.currentPhase }}/{{ review.totalReviews }}
                  </div>
                </div>
                <h3 class="review-title">{{ review.title }}</h3>
                
                <!-- Spaced Repetition Info -->
                <div class="sr-info" v-if="review.reviewSchedule && review.reviewSchedule.length > 0">
                  <div class="sr-timeline">
                    <div 
                      v-for="(date, i) in review.reviewSchedule.slice(0, 5)" 
                      :key="i"
                      class="sr-timeline-dot"
                      :class="{
                        'sr-completed': new Date(date) < new Date(), 
                        'sr-current': i === review.currentPhase - 1,
                        'sr-future': new Date(date) > new Date()
                      }"
                      :title="new Date(date).toLocaleDateString()"
                    ></div>
                    <div v-if="review.reviewSchedule.length > 5" class="sr-timeline-more">+{{ review.reviewSchedule.length - 5 }}</div>
                  </div>
                </div>
                
                <div class="review-meta">Last reviewed: {{ review.lastReviewedLabel }}</div>
                <div class="review-progress">
                  <div class="progress">
                    <div class="progress-bar" :style="{ width: review.retentionPercentage + '%' }" :class="getRetentionClass(review.retentionPercentage, review.isOverdue)"></div>
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


          
          <!-- Practice Tests Section -->
          <section class="practice-tests-section">
            <div class="section-header">
              <h2 class="section-title">Practice Tests</h2>
              <button @click="openPracticeTestModal" class="btn btn-primary btn-with-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>Create Test</span>
              </button>
            </div>
            
            <PracticeTestList 
              :loading="practiceTestsLoading" 
              :practice-tests="practiceTests.slice(0, 3)" 
              :view-all="false"
              @create-test="openPracticeTestModal"
              @delete-test="handleDeleteTest"
              @view-all="viewAllPracticeTests"
            />
          </section>
          
          <!-- Materials Library Section -->
          <section class="materials-section">
            <div class="section-header">
              <h2 class="section-title">Your Study Materials</h2>
              <div class="materials-filter">
                <button @click="openPracticeTestModal" class="btn btn-primary btn-with-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  <span>Create Practice Test</span>
                </button>
                
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

            <!-- Now using the MaterialList component here with the same behavior as in folder -->
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

          <!-- Navigate directly to the CreateStudyCardView instead -->
          <div class="create-options">
            <div class="create-option-card" @click="navigateToCreate('manual')">
              <div class="option-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </div>
              <h3>Create Study Card</h3>
              <p>Manually create your own study cards</p>
            </div>
            
            <div class="create-option-card" @click="navigateToCreate('ai')">
              <div class="option-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18.5 22q-1.05 0-1.775-.725T16 19.5q0-1.05.725-1.775T18.5 17q1.05 0 1.775.725T21 19.5q0 1.05-.725 1.775T18.5 22ZM18.5 7q-1.05 0-1.775-.725T16 4.5q0-1.05.725-1.775T18.5 2q1.05 0 1.775.725T21 4.5q0 1.05-.725 1.775T18.5 7ZM5.5 14.5q-1.05 0-1.775-.725T3 12q0-1.05.725-1.775T5.5 9.5q1.05 0 1.775.725T8 12q0 1.05-.725 1.775T5.5 14.5ZM18.5 12l-13 0M18.5 4.5l-13 7.5M18.5 19.5l-13-7.5"></path>
                </svg>
              </div>
              <h3>Create With AI</h3>
              <p>Let AI generate study cards for you</p>
            </div>
          </div>
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
            
            <!-- Study Method Switcher -->
            <div class="study-method-selector">
              <button 
                class="method-button" 
                :class="{ active: studyMethod === 'blurting' }" 
                @click="studyMethod = 'blurting'">
                Blurting
              </button>
              <button 
                class="method-button" 
                :class="{ active: studyMethod === 'feynman' }" 
                @click="studyMethod = 'feynman'">
                Feynman Technique
              </button>
            </div>
          </div>

          <BlurtingForm 
            v-if="studyMethod === 'blurting'"
            :material-id="currentMaterial.id"
            :title="currentMaterial.title"
            :content="currentMaterial.content"
            @reset="currentMode = 'list'"
            @study-again="handleStudyAgain"
          />
          
          <FeynmanTechnique 
            v-else-if="studyMethod === 'feynman'"
            :material-id="currentMaterial.id"
            :title="currentMaterial.title"
            :content="currentMaterial.content"
            start-mode="form"
            @reset="currentMode = 'list'"
            @completed="handleFeynmanCompleted"
          />
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
// InputForm has been removed and replaced with direct navigation
import BlurtingForm from '@/components/study/BlurtingForm.vue';
// Calendar integration removed
import FeynmanTechnique from '@/components/study/feynman/FeynmanTechnique.vue';
import PracticeTestList from '@/components/study/practicetest/PracticeTestList.vue';
import StudyService from '@/services/study.service';

export default {
  name: 'DashboardPage',
  components: {
    MaterialList,
    BlurtingForm,
    // Calendar integration removed
    FeynmanTechnique,
    PracticeTestList
  },
  
  setup() {
    const currentMode = ref('list'); // 'list', 'create', 'study', 'feynman'
    const studyMethod = ref('blurting'); // 'blurting' or 'feynman'
    const currentMaterial = ref(null);
    const loading = ref(true);
    const materials = ref([]);
    const filteredMaterials = ref([]);
    const materialsLoading = ref(false);
    const searchQuery = ref('');
    const showFilterMenu = ref(false);
    
    // Practice tests state
    const practiceTests = ref([]);
    const practiceTestsLoading = ref(false);
    
    const filters = ref({
      dueReview: false,
      recentlyAdded: false
    });
    
    // State for category filtering
    const activeCategory = ref([]);
    
    // State variables for dashboard
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
      
      // Count materials with Due Today label or that are overdue
      return dueReviews.value.filter(review => 
        review.dueLabel === 'Due Today' || review.isOverdue
      ).length;
    });
    
    // View all practice tests
    const viewAllPracticeTests = () => {
      router.push('/study/practice-test');
    };
    
    // Delete a practice test
    const handleDeleteTest = (testId) => {
      store.dispatch('practiceTests/deleteTest', testId);
      
      // Refresh the list
      fetchPracticeTests();
    };
    
    // Fetch practice tests from the store
    const fetchPracticeTests = () => {
      practiceTestsLoading.value = true;
      
      try {
        // Get practice tests from Vuex store
        practiceTests.value = store.getters['practiceTests/allTests'];
        
        // Sort tests by creation date (newest first)
        practiceTests.value.sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
          const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
          return dateB - dateA;
        });
      } catch (error) {
        console.error('Error fetching practice tests:', error);
      } finally {
        practiceTestsLoading.value = false;
      }
    };

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
        // Handle error without using the undefined 'error' variable
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
        // Filter to find materials that are due for review based on their scheduled review dates
        // First get the list of all materials that are in the dueReviews array
        const dueReviewIds = dueReviews.value.map(review => review.materialId);
        filtered = filtered.filter(material => dueReviewIds.includes(material.id));
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
    
    // Get color class based on retention percentage
    const getRetentionClass = (value, isOverdue = false) => {
      // If the item is overdue, prioritize that visual indicator
      if (isOverdue) return 'overdue';
      
      // Otherwise use retention-based classes
      if (value >= 90) return 'excellent';
      if (value >= 80) return 'good';
      if (value >= 70) return 'fair';
      return 'poor';
    };
    
    // Review a material
    const reviewMaterial = (review) => {
      // Navigate directly to the material card view page
      router.push(`/study/material/${review.materialId}`);
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
          // Get the most recent attempt with a review schedule
          const attempts = await StudyService.getStudyAttempts(material.id);
          if (!attempts || attempts.length === 0) return null;
          
          // Find the first attempt with a valid review schedule
          const attemptWithSchedule = attempts.find(
            attempt => attempt.reviewSchedule && 
                     attempt.reviewSchedule.length > 0 && 
                     !attempt.isDeprecatedSchedule
          );
          
          if (!attemptWithSchedule) return null;
          
          // Get the full review schedule
          let reviewSchedule = [];
          if (attemptWithSchedule.reviewSchedule) {
            reviewSchedule = attemptWithSchedule.reviewSchedule.map(
              date => typeof date === 'string' ? new Date(date) : date.toDate()
            );
          }
          
          // Filter out invalid dates
          reviewSchedule = reviewSchedule.filter(date => !isNaN(date.getTime()));
          if (reviewSchedule.length === 0) return null;
          
          // Sort the schedule by date (ascending)
          reviewSchedule.sort((a, b) => a - b);
          
          // Get the latest retention score directly
          const retentionPercentage = await StudyService.getLatestRetentionScore(material.id);
          
          // Find the next review date (first future date in the schedule)
          const now = new Date();
          const nextReview = reviewSchedule.find(date => date > now) || reviewSchedule[0];
          const reviewDate = new Date(nextReview);
          
          // Get upcoming review dates after this one (max 3)
          const upcomingReviews = reviewSchedule
            .filter(date => date > reviewDate)
            .slice(0, 3)
            .map(date => new Date(date));
          
          // Get the total number of reviews in the schedule
          const totalReviews = reviewSchedule.length;
          
          // Calculate spaced repetition phase
          const completedReviews = reviewSchedule.filter(date => date < now).length;
          const currentPhase = completedReviews + 1;
          
          // Calculate if it's overdue or due today
          const isOverdue = reviewDate < now;
          
          // Format the due label based on upcoming review schedule
          let dueLabel = "";
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          
          // Calculate days until review is due
          const daysUntilDue = Math.ceil((reviewDate - today) / (1000 * 60 * 60 * 24));
          
          if (isOverdue) {
            // Calculate days overdue
            const daysOverdue = Math.ceil((today - reviewDate) / (1000 * 60 * 60 * 24));
            dueLabel = daysOverdue === 1 ? "1 Day Overdue" : `${daysOverdue} Days Overdue`;
          } else {
            // Check if it's due today
            if (reviewDate.getDate() === today.getDate() && 
                reviewDate.getMonth() === today.getMonth() && 
                reviewDate.getFullYear() === today.getFullYear()) {
              dueLabel = "Due Today";
            } else if (reviewDate.getDate() === tomorrow.getDate() && 
                       reviewDate.getMonth() === tomorrow.getMonth() && 
                       reviewDate.getFullYear() === tomorrow.getFullYear()) {
              dueLabel = "Due Tomorrow";
            } else if (daysUntilDue <= 7) {
              dueLabel = `Due in ${daysUntilDue} Days`;
            } else {
              dueLabel = `Due on ${reviewDate.toLocaleDateString()}`;
            }
          }
          
          // Format last reviewed label
          let lastReviewedLabel = "Never reviewed";
          if (attempts && attempts.length > 0) {
            const lastReviewDate = attempts[0].timestamp?.toDate ? 
              attempts[0].timestamp.toDate() : new Date(attempts[0].timestamp);
            
            // Check if the last reviewed date is valid
            if (!isNaN(lastReviewDate.getTime())) {
              // Calculate days since last review
              const daysSinceReview = Math.floor((now - lastReviewDate) / (1000 * 60 * 60 * 24));
              
              // Check if it was today
              if (lastReviewDate.toDateString() === now.toDateString()) {
                lastReviewedLabel = "Today";
              } else if (daysSinceReview === 1) {
                lastReviewedLabel = "Yesterday";
              } else if (daysSinceReview < 7) {
                lastReviewedLabel = `${daysSinceReview} days ago`;
              } else {
                lastReviewedLabel = lastReviewDate.toLocaleDateString();
              }
            } else {
              console.error('Invalid last review date for material:', material.id);
              lastReviewedLabel = "Date error";
            }
          }
          
          // Calculate urgency score for better sorting
          let urgencyScore = 0;
          if (isOverdue) {
            // Overdue items get higher urgency based on how many days overdue
            const daysOverdue = Math.ceil((today - reviewDate) / (1000 * 60 * 60 * 24));
            urgencyScore = 1000 + daysOverdue; // Start at 1000 so all overdue are prioritized
          } else {
            // Non-overdue get urgency based on how soon they're due
            // Lower value = sooner due = higher urgency (for sorting)
            urgencyScore = -daysUntilDue;
          }
          
          return {
            id: material.id,
            materialId: material.id,
            title: material.title,
            nextReview: reviewDate,
            isOverdue,
            dueLabel,
            retentionPercentage,
            lastReviewedLabel,
            urgencyScore,
            upcomingReviews,
            currentPhase,
            totalReviews,
            reviewSchedule
          };
        });
        
        const reviews = (await Promise.all(reviewPromises))
          .filter(review => review !== null)
          // Sort by urgency score (descending), which combines overdue status and days until due
          .sort((a, b) => b.urgencyScore - a.urgencyScore);
        
        dueReviews.value = reviews;
        console.log('Generated due reviews:', dueReviews.value.length);
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
        
        // Generate due reviews data
        await generateDueReviews();
        
        // Update material categories counts based on actual material categories
        if (fetchedMaterials.length > 0) {
          // First extract real categories from materials
          materialCategories.value = extractRealCategories(fetchedMaterials);
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
    
    // Navigate to the appropriate create view based on type
    const navigateToCreate = (type) => {
      if (type === 'manual') {
        router.push('/study/create');
      } else if (type === 'ai') {
        router.push('/study/create-with-ai');
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
      
      // Also remove from the dueReviews array if present
      dueReviews.value = dueReviews.value.filter(review => review.materialId !== materialId);
      
      // Update material categories
      updateMaterialCategories();
    };
    
    const handleStudyAgain = () => {
      // The BlurtingForm component will handle the reset internally
      console.log("Study Again clicked for:", currentMaterial.value.title);
    };
    
    const handleFeynmanCompleted = (result) => {
      console.log("Feynman technique completed with results:", result);
      // Refresh materials to update any stats
      fetchMaterials();
    };
    
    // Practice Test Modal function
    const openPracticeTestModal = () => {
      store.dispatch('modals/openPracticeTestModal');
    };
    

    

    
    // Update material categories based on current materials
    const updateMaterialCategories = () => {
      materialCategories.value = extractRealCategories(materials.value);
    };
    
    // Watch for search query changes
    watch(searchQuery, () => {
      filterMaterials();
    });
    
    // Close filter menu when clicking outside
    const closeFilterMenu = (event) => {
      if (showFilterMenu.value && !event.target.closest('.filter-menu') && !event.target.closest('.filter-toggle-btn')) {
        showFilterMenu.value = false;
      }
    };
    
    // Handle search from navbar
    const handleNavbarSearch = (event) => {
      searchQuery.value = event.detail.query;
      filterMaterials();
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
        
        // Load materials first (this will also call generateDueReviews internally)
        await fetchMaterials();
        
        // Fetch practice tests
        fetchPracticeTests();
        
        // Check if there's a query parameter to create a new material
        const route = router.currentRoute.value;
        if (route.query.action === 'create') {
          currentMode.value = 'create';
        }
        
        // Add event listener to close filter menu when clicking outside
        document.addEventListener('click', closeFilterMenu);
        
        // Add event listener for navbar search
        window.addEventListener('navbar-search', handleNavbarSearch);
      } catch (err) {
        console.error("Error initializing dashboard:", err);
      } finally {
        loading.value = false;
      }
    });
    
    // Remove event listeners when component is unmounted
    onBeforeUnmount(() => {
      document.removeEventListener('click', closeFilterMenu);
      window.removeEventListener('navbar-search', handleNavbarSearch);
    });
    
    // Calculate the count of overdue materials
    const reviewsOverdue = computed(() => {
      if (!dueReviews.value || dueReviews.value.length === 0) return 0;
      
      // Count materials that are overdue
      return dueReviews.value.filter(review => review.isOverdue).length;
    });

    return {
      // State
      currentMode,
      currentMaterial,
      studyMethod,
      loading,
      materials,
      filteredMaterials,
      materialsLoading,
      searchQuery,
      filters,
      hasDueReviews,
      dueReviews,
      reviewsDueToday,
      reviewsOverdue,
      materialCategories,
      showFilterMenu,
      activeCategory,
      practiceTests,
      practiceTestsLoading,
      viewAllPracticeTests,
      handleDeleteTest,
      
      // Methods
      handleSelectMaterial,
      handleMaterialSaved,
      handleMaterialEdited,
      handleMaterialDeleted,
      handleCategoryDeleted,
      handleCategoryDeleteClick,
      handleStudyAgain,
      handleFeynmanCompleted,
      filterMaterials,
      applyFilters,
      resetFilters,
      getRetentionClass,
      reviewMaterial,
      viewAllDueReviews,
      navigateToCreate,
      openPracticeTestModal,
    };
  }
}
</script>

<style scoped>
.dashboard {
  padding-top: 1rem;
  min-height: 100vh;
  background-color: var(--neutral-50);
}

@media (max-width: 768px) {
  .dashboard {
    padding-top: 5rem; /* Provide space for mobile toggle button */
  }
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
  color: var(--neutral-900);
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-8);
}

/* Study Method Selector */
.study-method-selector {
  display: flex;
  gap: var(--spacing-2);
  background-color: var(--neutral-100);
  padding: 0.25rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.method-button {
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius-md);
  border: none;
  background-color: transparent;
  color: var(--neutral-600);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.method-button.active {
  background-color: white;
  color: var(--primary-color);
  box-shadow: var(--shadow-sm);
}

.method-button:hover:not(.active) {
  background-color: var(--neutral-200);
  color: var(--neutral-800);
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

.due-reviews {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-5);
}

.review-card {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-5);
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
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.8; }
  50% { opacity: 1; }
  100% { opacity: 0.8; }
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

.progress-bar {
  height: 100%;
  background: var(--primary-gradient);
  border-radius: var(--radius-full);
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

.progress-bar.overdue {
  background: linear-gradient(90deg, #dc2626, #991b1b);
  animation: pulse-progress 2s infinite;
}

@keyframes pulse-progress {
  0% { opacity: 0.7; }
  50% { opacity: 1; }
  100% { opacity: 0.7; }
}

.progress-text {
  font-size: var(--font-size-xs);
  color: var(--neutral-600);
}

.review-actions {
  display: flex;
  justify-content: flex-end;
}

.review-card.is-overdue {
  border-left: 4px solid #ef4444;
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

/* Section Actions - general purpose styles */
.section-actions {
  display: flex;
  gap: var(--spacing-2);
}

.btn-with-icon {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

/* Practice Tests Section */
.practice-tests-section {
  margin-bottom: var(--spacing-12);
}

/* Materials Section */
.materials-section {
  margin-bottom: var(--spacing-12);
}

.materials-filter {
  display: flex;
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
  justify-content: flex-end;
  align-items: center;
  width: 100%;
}

.review-stats-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-4);
  align-items: center;
}

.review-stats {
  display: flex;
  gap: var(--spacing-3);
}

/* Spaced Repetition UI */
.sr-phase-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: rgba(99, 102, 241, 0.1);
  color: var(--primary-color);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.sr-info {
  margin-bottom: var(--spacing-3);
}

.sr-timeline {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-2);
}

.sr-timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--neutral-300);
  position: relative;
}

.sr-timeline-dot:not(:last-child):after {
  content: "";
  position: absolute;
  height: 2px;
  width: var(--spacing-4);
  background-color: var(--neutral-300);
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
}

.sr-timeline-dot.sr-completed {
  background-color: var(--primary-color);
}

.sr-timeline-dot.sr-completed:after {
  background-color: var(--primary-color);
}

.sr-timeline-dot.sr-current {
  background-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3);
  transform: scale(1.2);
}

.sr-timeline-dot.sr-future {
  background-color: var(--neutral-300);
}

.sr-timeline-more {
  font-size: var(--font-size-xs);
  color: var(--neutral-500);
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

/* Button styles */
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

.btn-sm {
  font-size: var(--font-size-sm);
  padding: 0.35rem 0.75rem;
}

/* Create Options */
.create-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-6);
  margin-top: var(--spacing-8);
}

.create-option-card {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-8);
  box-shadow: var(--shadow-md);
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  border: 1px solid var(--neutral-200);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.create-option-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color);
}

.create-option-card .option-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-light);
  color: var(--primary-color);
  border-radius: 50%;
  margin-bottom: var(--spacing-4);
}

.create-option-card h3 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-3);
  color: var(--neutral-900);
}

.create-option-card p {
  color: var(--neutral-600);
  margin-bottom: 0;
}

/* Responsive styles */
@media (max-width: 992px) {
  .materials-filter {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-3);
  }
  
  .search-box {
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
  
  .due-reviews {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .materials-filter {
    width: 100%;
  }
}
</style>
