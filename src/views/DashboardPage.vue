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
                    <div class="stat-change positive" v-if="studySessions > 0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="18 15 12 9 6 15"></polyline>
                      </svg>
                      <span>3 this week</span>
                    </div>
                  </div>
                  <div class="stat-progress">
                    <div class="progress-container">
                      <div class="progress-bar" :style="{ width: `${(studySessions / 20) * 100}%` }"></div>
                    </div>
                    <div class="progress-label">{{ Math.floor((studySessions / 20) * 100) }}% of monthly goal</div>
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
              <p class="section-subtitle">Review these materials to maintain your retention</p>
            </div>

            <div class="due-reviews">
              <div class="review-card" v-for="(review, index) in dueReviews" :key="index">
                <div class="review-header">
                  <div class="review-badge" :class="{ urgent: review.isOverdue }">
                    {{ review.isOverdue ? 'Overdue' : review.dueLabel }}
                  </div>
                  <div class="review-meta">Last reviewed: {{ review.lastReviewedLabel }}</div>
                </div>
                <h3 class="review-title">{{ review.title }}</h3>
                <div class="review-progress">
                  <div class="progress">
                    <div class="progress-bar" :style="{ width: review.retentionPercentage + '%' }"></div>
                  </div>
                  <span class="progress-text">{{ review.retentionPercentage }}% retention</span>
                </div>
                <div class="review-actions">
                  <button class="btn btn-primary btn-sm" @click="reviewMaterial(review)">Review Now</button>
                </div>
              </div>
            </div>
          </section>

          <!-- Materials Library Section -->
          <section class="materials-section">
            <div class="section-header">
              <h2 class="section-title">Your Materials</h2>
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
                <div class="filter-dropdown">
                  <button class="filter-button" @click="toggleFilterMenu">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="filter-icon">
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                    <span>Filter</span>
                  </button>
                  <div class="filter-menu" v-if="showFilterMenu">
                    <div class="filter-option">
                      <label>
                        <input type="checkbox" v-model="filters.dueReview"> Show Due Reviews Only
                      </label>
                    </div>
                    <div class="filter-option">
                      <label>
                        <input type="checkbox" v-model="filters.recentlyAdded"> Recently Added
                      </label>
                    </div>
                    <button class="btn btn-sm btn-outline" @click="applyFilters">Apply</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Now using the MaterialList component here -->
            <MaterialList 
              :materials="filteredMaterials"
              :loading="materialsLoading"
              @select-material="handleSelectMaterial"
              @create-new="currentMode = 'create'"
              @material-edited="handleMaterialEdited"
              @material-deleted="handleMaterialDeleted"
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
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
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
    
    // Fake review data for the UI - would be generated from real data in a full implementation
    const dueReviews = ref([
      {
        id: 'review1',
        title: 'Neural Networks Fundamentals',
        isOverdue: false,
        dueLabel: 'Due Today',
        lastReviewedLabel: '3 days ago',
        retentionPercentage: 75,
        materialId: 'material1'
      },
      {
        id: 'review2',
        title: 'French Vocabulary: Food & Dining',
        isOverdue: true,
        dueLabel: 'Overdue',
        lastReviewedLabel: '7 days ago',
        retentionPercentage: 68,
        materialId: 'material2'
      },
      {
        id: 'review3',
        title: 'JavaScript Promises & Async/Await',
        isOverdue: false,
        dueLabel: 'Due Tomorrow',
        lastReviewedLabel: '2 days ago',
        retentionPercentage: 82,
        materialId: 'material3'
      }
    ]);
    
    // Stats for the dashboard
    const studySessions = ref(12);
    const streak = ref(7);
    const avgRetention = ref(85);
    const totalMaterials = ref(0);
    const retentionHistory = ref([78, 83, 79, 85, 82, 87, 85]);
    
    // Material categories for the chart
    const materialCategories = ref([
      { name: 'Programming', count: 3, color: '#6366F1' },
      { name: 'Languages', count: 2, color: '#EC4899' },
      { name: 'Science', count: 2, color: '#10B981' },
      { name: 'Other', count: 1, color: '#F59E0B' }
    ]);
    
    const router = useRouter();
    const store = useStore();
    
    // Check if the user has due reviews
    const hasDueReviews = computed(() => {
      return dueReviews.value.length > 0;
    });
    
    // Handle search and filtering
    const filterMaterials = () => {
      if (!searchQuery.value && !filters.value.dueReview && !filters.value.recentlyAdded) {
        filteredMaterials.value = materials.value;
        return;
      }
      
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
    
    // Apply filters when they change
    const applyFilters = () => {
      filterMaterials();
      showFilterMenu.value = false;
    };
    
    // Toggle filter menu visibility
    const toggleFilterMenu = () => {
      showFilterMenu.value = !showFilterMenu.value;
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
        
        // Update material categories counts based on real data
        // This is a simplified demo - in a real app, you'd categorize based on actual content
        if (fetchedMaterials.length > 0) {
          // Reset counts
          materialCategories.value.forEach(category => {
            category.count = 0;
          });
          
          // Distribute materials among categories for demo
          fetchedMaterials.forEach((material, index) => {
            const categoryIndex = index % materialCategories.value.length;
            materialCategories.value[categoryIndex].count++;
          });
        }
        
        // Update study sessions based on real data
        if (fetchedMaterials.length > 0) {
          // In a real app, you'd count actual study sessions
          studySessions.value = Math.max(3, fetchedMaterials.length * 2);
        } else {
          studySessions.value = 0;
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
    
    onMounted(async () => {
      // Check authentication
      const user = store.getters['auth/user'];
      if (!user) {
        router.push('/login');
        return;
      }
      
      try {
        // Fetch materials when component mounts
        await fetchMaterials();
      } catch (err) {
        console.error("Error initializing dashboard:", err);
      }
      
      // Click outside to close filter menu
      document.addEventListener('click', (e) => {
        const filterDropdown = document.querySelector('.filter-dropdown');
        if (showFilterMenu.value && filterDropdown && !filterDropdown.contains(e.target)) {
          showFilterMenu.value = false;
        }
      });
    });
    
    return {
      currentMode,
      currentMaterial,
      loading,
      materials,
      filteredMaterials,
      materialsLoading,
      searchQuery,
      showFilterMenu,
      filters,
      hasDueReviews,
      dueReviews,
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
      handleStudyAgain,
      filterMaterials,
      toggleFilterMenu,
      applyFilters,
      getStreakStatus,
      getDayLabel,
      getRetentionClass,
      reviewMaterial
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

.filter-button {
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
}

.filter-button:hover {
  background-color: var(--neutral-100);
  border-color: var(--neutral-400);
}

.filter-menu {
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  background-color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-3);
  z-index: var(--z-dropdown);
  width: 200px;
  border: 1px solid var(--neutral-200);
}

.filter-option {
  margin-bottom: var(--spacing-3);
}

.filter-option label {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.filter-menu .btn {
  width: 100%;
  margin-top: var(--spacing-2);
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
</style>