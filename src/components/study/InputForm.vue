<template>
  <div class="study-input-form card">
    <div class="card-header">
      <h3>Create Study Material</h3>
    </div>
    
    <div class="card-body">
      <div v-if="error" class="alert alert-danger">
        <div class="alert-content">
          <div class="alert-text">{{ error }}</div>
        </div>
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="title" class="form-label">Title</label>
          <input
            type="text"
            id="title"
            v-model="title"
            class="form-control"
            placeholder="Enter a title for this material"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="category" class="form-label">Category</label>
          <div class="category-dropdown-container">
            <!-- Custom Dropdown Trigger -->
            <div class="category-dropdown-trigger" @click="toggleCategoryDropdown" :class="{ 'active': showCategoryDropdown }">
              <div class="selected-category">
                <div v-if="selectedCategoryOption" class="category-tag" :class="getCategoryColorClass(selectedCategoryOption)">
                  <span>{{ selectedCategoryOption === 'custom' ? customCategory : selectedCategoryOption }}</span>
                </div>
                <span v-else class="placeholder-text">Select a category</span>
              </div>
              <div class="dropdown-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>

            <!-- Dropdown Content -->
            <div v-if="showCategoryDropdown" class="category-dropdown-content">
              <div class="category-search">
                <input 
                  type="text" 
                  v-model="categorySearchTerm" 
                  class="form-control" 
                  placeholder="Search or add new category"
                  @input="handleCategorySearch"
                  @keydown.enter="handleCategorySearchEnter"
                  ref="categorySearchInput"
                />
              </div>
              
              <div class="category-groups">
                <!-- Frequently Used Categories -->
                <div class="category-group" v-if="filteredFrequentCategories.length > 0">
                  <div class="category-group-label">Frequently Used</div>
                  <div class="category-options">
                    <div 
                      v-for="cat in filteredFrequentCategories" 
                      :key="cat" 
                      class="category-option" 
                      @click="selectCategory(cat)"
                      :class="[getCategoryColorClass(cat), { 'active': selectedCategoryOption === cat }]"
                    >
                      <span class="category-name">{{ cat }}</span>
                      <span class="category-select-icon" v-if="selectedCategoryOption === cat">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Default Categories -->
                <div class="category-group" v-if="filteredDefaultCategories.length > 0">
                  <div class="category-group-label">Default Categories</div>
                  <div class="category-options">
                    <div 
                      v-for="cat in filteredDefaultCategories" 
                      :key="cat" 
                      class="category-option" 
                      @click="selectCategory(cat)"
                      :class="[getCategoryColorClass(cat), { 'active': selectedCategoryOption === cat }]"
                    >
                      <span class="category-name">{{ cat }}</span>
                      <div class="category-option-actions">
                        <span class="category-select-icon" v-if="selectedCategoryOption === cat">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                        <button 
                          class="category-delete-button" 
                          @click.stop="deleteCategoryPrompt(cat)"
                          title="Delete category"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Custom Categories -->
                <div class="category-group" v-if="filteredCustomCategories.length > 0">
                  <div class="category-group-label">Your Categories</div>
                  <div class="category-options">
                    <div 
                      v-for="cat in filteredCustomCategories" 
                      :key="cat" 
                      class="category-option" 
                      @click="selectCategory(cat)"
                      :class="[getCategoryColorClass(cat), { 'active': selectedCategoryOption === cat }]"
                    >
                      <span class="category-name">{{ cat }}</span>
                      <div class="category-option-actions">
                        <span class="category-select-icon" v-if="selectedCategoryOption === cat">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                        <button 
                          class="category-delete-button" 
                          @click.stop="deleteCategoryPrompt(cat)"
                          title="Delete category"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Create New Category Option -->
                <div class="category-group" v-if="showCreateNewCategory">
                  <div class="category-group-label">Create New</div>
                  <div class="category-options">
                    <div 
                      class="category-option category-option-new" 
                      @click="createNewCategory"
                    >
                      <span class="category-name">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="category-new-icon">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Create "{{ categorySearchTerm }}"
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Custom Category Input -->
            <div v-if="showCustomCategoryInput" class="custom-category-input-container">
              <input
                type="text"
                v-model="customCategory"
                class="form-control custom-category-input"
                placeholder="Enter custom category name"
                @blur="handleCustomCategoryBlur"
                @keydown.enter="handleCustomCategoryConfirm"
                ref="customCategoryInput"
              />
              <div class="custom-category-actions">
                <button type="button" class="btn-icon btn-sm btn-ghost" @click="cancelCustomCategory">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
                <button type="button" class="btn-icon btn-sm btn-primary" @click="handleCustomCategoryConfirm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="content" class="form-label">Content</label>
          <textarea
            id="content"
            v-model="content"
            class="form-control"
            rows="10"
            placeholder="Paste or type the content you want to study"
            required
          ></textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Or upload a file</label>
          <div class="file-upload-container">
            <input
              type="file"
              id="file-upload"
              @change="handleFileUpload"
              class="file-input"
              accept=".txt,.md,.doc,.docx"
              :disabled="loading"
            />
            <label for="file-upload" class="file-upload-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span>Choose file</span>
            </label>
            <span v-if="fileName" class="file-name">{{ fileName }}</span>
          </div>
          <p class="form-text">
            Supported file types: .txt, .md, .doc, .docx
          </p>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-primary btn-lg" :disabled="loading">
            <span v-if="loading" class="loading-spinner"></span>
            <span v-else>Save Material</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import StudyService from '@/services/study.service';
import { auth } from '@/services/firebase';

export default {
  name: 'InputForm',
  emits: ['material-saved'],
  
  setup(props, { emit }) {
    const title = ref('');
    const content = ref('');
    const selectedCategoryOption = ref('');
    const customCategory = ref('');
    const showCustomCategoryInput = ref(false);
    const userCustomCategories = ref([]);
    const error = ref('');
    const loading = ref(false);
    const fileName = ref('');
    const showCategoryDropdown = ref(false);
    const categorySearchTerm = ref('');
    const categorySearchInput = ref(null);
    const customCategoryInput = ref(null);
    
    // Predefined categories
    // Original system categories (used as reference for deletions)
    const systemCategories = [
      'Programming',
      'Languages',
      'Science',
      'Math',
      'History',
      'Art'
    ];
    
    // Track deleted categories
    const deletedCategories = ref([]);
    
    // Computed property for defaultCategories (system categories minus deleted ones)
    const defaultCategories = computed(() => {
      return systemCategories.filter(cat => !deletedCategories.value.includes(cat));
    });
    
    // Track frequently used categories
    const frequentCategories = ref([]);
    
    const router = useRouter();
    
    const category = computed(() => {
      if (selectedCategoryOption.value === 'custom') {
        return customCategory.value;
      }
      return selectedCategoryOption.value;
    });
    
    // Filtered categories based on search term
    const filteredDefaultCategories = computed(() => {
      if (!categorySearchTerm.value) return defaultCategories.value;
      return defaultCategories.value.filter(cat => 
        cat.toLowerCase().includes(categorySearchTerm.value.toLowerCase())
      );
    });
    
    const filteredCustomCategories = computed(() => {
      if (!categorySearchTerm.value) return userCustomCategories.value;
      return userCustomCategories.value.filter(cat => 
        cat.toLowerCase().includes(categorySearchTerm.value.toLowerCase())
      );
    });
    
    const filteredFrequentCategories = computed(() => {
      if (!categorySearchTerm.value) return frequentCategories.value;
      return frequentCategories.value.filter(cat => 
        cat.toLowerCase().includes(categorySearchTerm.value.toLowerCase())
      );
    });
    
    const showCreateNewCategory = computed(() => {
      // Show create option if search term is not empty and doesn't exist in any category lists
      if (!categorySearchTerm.value) return false;
      
      const searchTermExists = 
        defaultCategories.value.some(cat => cat.toLowerCase() === categorySearchTerm.value.toLowerCase()) ||
        userCustomCategories.value.some(cat => cat.toLowerCase() === categorySearchTerm.value.toLowerCase()) ||
        frequentCategories.value.some(cat => cat.toLowerCase() === categorySearchTerm.value.toLowerCase());
      
      return !searchTermExists && categorySearchTerm.value.trim().length > 0;
    });
    
    // Toggle dropdown visibility
    const toggleCategoryDropdown = () => {
      if (showCustomCategoryInput.value) return;
      
      showCategoryDropdown.value = !showCategoryDropdown.value;
      
      if (showCategoryDropdown.value) {
        categorySearchTerm.value = '';
        nextTick(() => {
          categorySearchInput.value?.focus();
        });
      }
    };
    
    // Handle category selection
    const selectCategory = (category) => {
      selectedCategoryOption.value = category;
      showCategoryDropdown.value = false;
      
      // Add to frequent categories if not already there
      if (!frequentCategories.value.includes(category) && 
          category !== 'custom') {
        // Keep only top 5 frequent categories
        if (frequentCategories.value.length >= 5) {
          frequentCategories.value.pop();
        }
        frequentCategories.value.unshift(category);
        // Save to localStorage
        localStorage.setItem('frequentCategories', JSON.stringify(frequentCategories.value));
      }
    };
    
    // Create a new category from search term
    const createNewCategory = () => {
      if (!categorySearchTerm.value.trim()) return;
      
      customCategory.value = categorySearchTerm.value.trim();
      if (!userCustomCategories.value.includes(customCategory.value)) {
        userCustomCategories.value.push(customCategory.value);
      }
      
      selectedCategoryOption.value = customCategory.value;
      showCategoryDropdown.value = false;
      categorySearchTerm.value = '';
      
      // Add to frequent categories
      if (!frequentCategories.value.includes(customCategory.value)) {
        if (frequentCategories.value.length >= 5) {
          frequentCategories.value.pop();
        }
        frequentCategories.value.unshift(customCategory.value);
        localStorage.setItem('frequentCategories', JSON.stringify(frequentCategories.value));
      }
    };
    
    // Handle category search input
    const handleCategorySearch = () => {
      // Reset options visibility when search changes
    };
    
    // Handle enter key in search
    const handleCategorySearchEnter = () => {
      if (showCreateNewCategory.value) {
        createNewCategory();
      } else {
        // If there's only one match in the filtered lists, select it
        const allFilteredCategories = [
          ...filteredDefaultCategories.value,
          ...filteredCustomCategories.value,
          ...filteredFrequentCategories.value
        ];
        
        if (allFilteredCategories.length === 1) {
          selectCategory(allFilteredCategories[0]);
        }
      }
    };
    
    // Get color class based on category name
    const getCategoryColorClass = (categoryName) => {
      if (!categoryName) return '';
      
      // Simple hash function to determine color
      let hash = 0;
      for (let i = 0; i < categoryName.length; i++) {
        hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
      }
      
      // Map hash to one of the predefined color classes
      const colorClasses = [
        'category-blue',
        'category-green',
        'category-purple',
        'category-orange',
        'category-pink',
        'category-teal'
      ];
      
      const index = Math.abs(hash) % colorClasses.length;
      return colorClasses[index];
    };
    
    const handleCategorySelect = () => {
      if (selectedCategoryOption.value === 'custom') {
        showCustomCategoryInput.value = true;
        showCategoryDropdown.value = false;
        nextTick(() => {
          customCategoryInput.value?.focus();
        });
      } else {
        showCustomCategoryInput.value = false;
      }
    };
    
    const cancelCustomCategory = () => {
      showCustomCategoryInput.value = false;
      customCategory.value = '';
      selectedCategoryOption.value = '';
    };
    
    const handleCustomCategoryConfirm = () => {
      if (customCategory.value.trim()) {
        if (!userCustomCategories.value.includes(customCategory.value.trim())) {
          userCustomCategories.value.push(customCategory.value.trim());
        }
        selectedCategoryOption.value = customCategory.value.trim();
        showCustomCategoryInput.value = false;
        
        // Add to frequent categories
        if (!frequentCategories.value.includes(customCategory.value.trim())) {
          if (frequentCategories.value.length >= 5) {
            frequentCategories.value.pop();
          }
          frequentCategories.value.unshift(customCategory.value.trim());
          localStorage.setItem('frequentCategories', JSON.stringify(frequentCategories.value));
        }
      }
    };

    const handleCustomCategoryBlur = () => {
      // Only close if clicked outside the custom category input container
      if (!customCategory.value.trim()) {
        cancelCustomCategory();
      }
    };

    const loadUserCustomCategories = async () => {
      try {
        const materials = await StudyService.getStudyMaterials();
        const customCats = new Set();
        
        materials.forEach(material => {
          if (material.category && !systemCategories.includes(material.category)) {
            customCats.add(material.category);
          }
        });
        
        userCustomCategories.value = Array.from(customCats);
      } catch (err) {
        console.error('Failed to load custom categories:', err);
      }
    };
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      const dropdownContainer = document.querySelector('.category-dropdown-container');
      if (dropdownContainer && !dropdownContainer.contains(event.target)) {
        showCategoryDropdown.value = false;
      }
    };
    
    // Load frequent categories from localStorage
    const loadFrequentCategories = () => {
      const saved = localStorage.getItem('frequentCategories');
      if (saved) {
        try {
          frequentCategories.value = JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse frequent categories:', e);
          frequentCategories.value = [];
        }
      }
    };
    
    // Load deleted categories from localStorage
    const loadDeletedCategories = () => {
      const saved = localStorage.getItem('deletedCategories');
      if (saved) {
        try {
          deletedCategories.value = JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse deleted categories:', e);
          deletedCategories.value = [];
        }
      }
    };
    
    // Delete a category (show confirmation first)
    const deleteCategoryPrompt = (category) => {
      if (confirm(`Are you sure you want to delete the "${category}" category? This cannot be undone.`)) {
        deleteCategory(category);
      }
    };
    
    // Actually delete the category
    const deleteCategory = (category) => {
      // If it's a default category, add to deleted list
      if (systemCategories.includes(category)) {
        if (!deletedCategories.value.includes(category)) {
          deletedCategories.value.push(category);
          localStorage.setItem('deletedCategories', JSON.stringify(deletedCategories.value));
        }
      } 
      // If it's a custom category, remove from custom list
      else if (userCustomCategories.value.includes(category)) {
        userCustomCategories.value = userCustomCategories.value.filter(cat => cat !== category);
      }
      
      // Remove from frequent categories if present
      if (frequentCategories.value.includes(category)) {
        frequentCategories.value = frequentCategories.value.filter(cat => cat !== category);
        localStorage.setItem('frequentCategories', JSON.stringify(frequentCategories.value));
      }
      
      // If the deleted category is currently selected, reset selection
      if (selectedCategoryOption.value === category) {
        selectedCategoryOption.value = '';
      }
    };

    onMounted(() => {
      loadUserCustomCategories();
      loadFrequentCategories();
      loadDeletedCategories();
      document.addEventListener('click', handleClickOutside);
    });
    
    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      fileName.value = file.name;
      
      // For MVP, we'll just read text files
      // In a real app, you'd need more sophisticated file handling
      const reader = new FileReader();
      
      reader.onload = (e) => {
        content.value = e.target.result;
        
        // Set title from filename if title is empty
        if (!title.value) {
          title.value = file.name.split('.')[0];
        }
      };
      
      reader.onerror = () => {
        error.value = 'Failed to read the file. Please try again.';
      };
      
      reader.readAsText(file);
    };
    
    const handleSubmit = async () => {
      try {
        loading.value = true;
        error.value = '';
        
        // Check if user is authenticated
        if (!auth.currentUser) {
          console.error("No authenticated user");
          error.value = "You must be logged in to save materials";
          router.push('/login');
          return;
        }
        
        console.log("Current user:", auth.currentUser.uid);
        
        // Ensure we have content before saving
        if (!content.value.trim()) {
          error.value = 'Please enter or upload content to study';
          return;
        }
        
        // The userId parameter isn't actually used, as StudyService uses auth.currentUser.uid
        const materialId = await StudyService.saveStudyMaterial(
          auth.currentUser.uid,
          title.value,
          content.value,
          category.value // Add category parameter
        );
        
        console.log("Material saved with ID:", materialId);
        
        // Ensure we have materialId before emitting
        if (materialId) {
          // Emit with more complete material object
          const materialObj = { 
            id: materialId,
            title: title.value,
            content: content.value,
            category: category.value, // Add category to the material object
            createdAt: new Date(),
            userId: auth.currentUser.uid
          };
          
          console.log("Emitting material:", materialObj);
          emit('material-saved', materialObj);
          
          // Clear form
          title.value = '';
          content.value = '';
          selectedCategoryOption.value = '';
          customCategory.value = '';
          showCustomCategoryInput.value = false;
          fileName.value = '';
        } else {
          error.value = 'Failed to save material. Please try again.';
        }
        
      } catch (err) {
        console.error('Error in handleSubmit:', err);
        error.value = err.message || 'Failed to save study material';
      } finally {
        loading.value = false;
      }
    };
    
    return {
      title,
      content,
      category,
      selectedCategoryOption,
      customCategory,
      showCustomCategoryInput,
      userCustomCategories,
      error,
      loading,
      fileName,
      // New refs
      showCategoryDropdown,
      categorySearchTerm,
      categorySearchInput,
      customCategoryInput,
      filteredDefaultCategories,
      filteredCustomCategories,
      filteredFrequentCategories,
      showCreateNewCategory,
      // Methods
      handleFileUpload,
      handleSubmit,
      handleCategorySelect,
      handleCustomCategoryBlur,
      toggleCategoryDropdown,
      selectCategory,
      createNewCategory,
      handleCategorySearch,
      handleCategorySearchEnter,
      getCategoryColorClass,
      cancelCustomCategory,
      handleCustomCategoryConfirm,
      deleteCategoryPrompt,
      deleteCategory
    };
  }
}
</script>

<style>
/* Global style to prevent option text truncation */
#category option {
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: clip !important;
  min-width: 350px !important;
  padding: 8px !important;
  width: auto !important;
}
</style>

<style scoped>
.study-input-form {
  margin-bottom: var(--spacing-8);
}

.card-header {
  display: flex;
  align-items: center;
}

.card-header h3 {
  margin-bottom: 0;
  font-weight: var(--font-weight-semibold);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--spacing-8);
}

/* File Upload Styling */
.file-upload-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-2);
}

.file-input {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.file-upload-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: 0.5rem 1rem;
  background-color: var(--neutral-100);
  border: 1px dashed var(--neutral-400);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-size: var(--font-size-sm);
  color: var(--neutral-700);
}

.file-upload-label:hover {
  background-color: var(--neutral-200);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.file-name {
  font-size: var(--font-size-sm);
  color: var(--neutral-700);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.loading-spinner {
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Modern Category Dropdown Styling */
.category-dropdown-container {
  position: relative;
  width: 100%;
}

.category-dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: white;
  border: 2px solid var(--neutral-300);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.category-dropdown-trigger:hover {
  border-color: var(--neutral-400);
}

.category-dropdown-trigger.active {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.selected-category {
  display: flex;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.placeholder-text {
  color: var(--neutral-500);
}

.dropdown-icon {
  margin-left: auto;
  color: var(--neutral-600);
  transition: transform var(--transition-normal);
}

.category-dropdown-trigger.active .dropdown-icon {
  transform: rotate(180deg);
}

/* Category Tag Styling */
.category-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: white;
  background-color: var(--primary-color);
}

/* Category color variants */
.category-blue {
  background-color: #3b82f6;
}

.category-green {
  background-color: #10b981;
}

.category-purple {
  background-color: #8b5cf6;
}

.category-orange {
  background-color: #f59e0b;
}

.category-pink {
  background-color: #ec4899;
}

.category-teal {
  background-color: #14b8a6;
}

/* Dropdown Content Styling */
.category-dropdown-content {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  background-color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-dropdown);
  border: 1px solid var(--neutral-200);
  max-height: 350px;
  overflow-y: auto;
  animation: dropdownFadeIn 0.2s ease-out;
}

@keyframes dropdownFadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.category-search {
  padding: var(--spacing-3);
  border-bottom: 1px solid var(--neutral-200);
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
}

.category-groups {
  padding: var(--spacing-2);
}

.category-group {
  margin-bottom: var(--spacing-3);
}

.category-group:last-child {
  margin-bottom: 0;
}

.category-group-label {
  padding: 0 var(--spacing-3);
  margin-bottom: var(--spacing-2);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.category-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.category-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--neutral-800);
}

.category-option:hover {
  background-color: var(--neutral-100);
}

.category-option.active {
  background-color: var(--primary-color);
  color: white;
}

/* Make category color classes more subtle when not active */
.category-option.category-blue:not(.active) {
  border-left: 3px solid #3b82f6;
  background-color: rgba(59, 130, 246, 0.08);
}

.category-option.category-green:not(.active) {
  border-left: 3px solid #10b981;
  background-color: rgba(16, 185, 129, 0.08);
}

.category-option.category-purple:not(.active) {
  border-left: 3px solid #8b5cf6;
  background-color: rgba(139, 92, 246, 0.08);
}

.category-option.category-orange:not(.active) {
  border-left: 3px solid #f59e0b;
  background-color: rgba(245, 158, 11, 0.08);
}

.category-option.category-pink:not(.active) {
  border-left: 3px solid #ec4899;
  background-color: rgba(236, 72, 153, 0.08);
}

.category-option.category-teal:not(.active) {
  border-left: 3px solid #14b8a6;
  background-color: rgba(20, 184, 166, 0.08);
}

.category-name {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.category-option-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

.category-select-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-delete-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: transparent;
  border: none;
  color: var(--neutral-500);
  opacity: 0;
  cursor: pointer;
  transition: all var(--transition-fast);
  border-radius: var(--radius-full);
}

.category-option:hover .category-delete-button {
  opacity: 1;
}

.category-delete-button:hover {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.category-option-new {
  color: var(--primary-color);
  background-color: rgba(99, 102, 241, 0.08);
}

.category-option-new:hover {
  background-color: rgba(99, 102, 241, 0.15);
}

.category-new-icon {
  margin-right: var(--spacing-2);
}

/* Custom Category Input Container */
.custom-category-input-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-top: var(--spacing-2);
  animation: fadeIn 0.3s;
}

.custom-category-input {
  flex: 1;
}

.custom-category-actions {
  display: flex;
  gap: var(--spacing-2);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive styles */
@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions .btn {
    width: 100%;
  }
  
  .file-upload-container {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .file-name {
    max-width: 100%;
  }
  
  .category-dropdown-content {
    max-height: 280px;
  }
}
</style>