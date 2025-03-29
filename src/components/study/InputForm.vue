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
          <div class="category-input-group">
            <select
              id="category"
              v-model="selectedCategoryOption"
              class="form-control category-select"
              @change="handleCategorySelect"
            >
              <option value="" disabled>Select a category</option>
              <option value="Programming">Programming</option>
              <option value="Languages">Languages</option>
              <option value="Science">Science</option>
              <option value="Math">Math</option>
              <option value="History">History</option>
              <option value="Art">Art</option>
              <option value="custom">+ Add Custom Category</option>
              <option v-for="cat in userCustomCategories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
            
            <input
              v-if="showCustomCategoryInput"
              type="text"
              v-model="customCategory"
              class="form-control custom-category-input"
              placeholder="Enter custom category"
              @blur="handleCustomCategoryBlur"
            />
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
import { ref, computed, onMounted } from 'vue';
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
    
    const router = useRouter();
    
    const category = computed(() => {
      if (selectedCategoryOption.value === 'custom') {
        return customCategory.value;
      }
      return selectedCategoryOption.value;
    });

    const handleCategorySelect = () => {
      if (selectedCategoryOption.value === 'custom') {
        showCustomCategoryInput.value = true;
        setTimeout(() => {
          document.querySelector('.custom-category-input')?.focus();
        }, 0);
      } else {
        showCustomCategoryInput.value = false;
      }
    };

    const handleCustomCategoryBlur = () => {
      if (customCategory.value.trim()) {
        if (!userCustomCategories.value.includes(customCategory.value.trim())) {
          userCustomCategories.value.push(customCategory.value.trim());
        }
      } else {
        selectedCategoryOption.value = '';
        showCustomCategoryInput.value = false;
      }
    };

    const loadUserCustomCategories = async () => {
      try {
        const materials = await StudyService.getStudyMaterials();
        const presetCategories = ['Programming', 'Languages', 'Science', 'Math', 'History', 'Art'];
        const customCats = new Set();
        
        materials.forEach(material => {
          if (material.category && !presetCategories.includes(material.category)) {
            customCats.add(material.category);
          }
        });
        
        userCustomCategories.value = Array.from(customCats);
      } catch (err) {
        console.error('Failed to load custom categories:', err);
      }
    };

    onMounted(() => {
      loadUserCustomCategories();
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
      handleFileUpload,
      handleSubmit,
      handleCategorySelect,
      handleCustomCategoryBlur
    };
  }
}
</script>

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
}

.category-input-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  width: 100%;
}

.custom-category-input {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-top: none;
  animation: fadeIn 0.3s;
}

/* Category Select Styling */
.category-select {
  width: 100%;
  max-width: 100%;
  text-overflow: ellipsis;
  padding-right: 2rem;
}

.category-select option {
  padding: 0.5rem;
  white-space: normal;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>