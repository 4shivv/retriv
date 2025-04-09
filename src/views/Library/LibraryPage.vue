<template>
  <div class="library-page">
    <div class="container container-xl">
      <!-- Library Header -->
      <header class="library-header">
        <div class="header-content">
          <h1 class="library-title">Learning Library</h1>
          <p class="library-subtitle">Access all your learning materials in one place</p>
        </div>
      </header>

      <!-- Library Tabs -->
      <div class="library-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          class="tab-button"
          :class="{ active: activeTab === tab.id }"
          @click="setActiveTab(tab.id)"
        >
          <span class="tab-icon" v-html="tab.icon"></span>
          <span class="tab-label">{{ tab.label }}</span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner-large"></div>
        <p>Loading your library...</p>
      </div>

      <!-- Tab Content -->
      <div v-else class="tab-content">
        <!-- Folders Tab -->
        <div v-if="activeTab === 'folders'" class="folders-tab">
          <div class="tab-header">
            <h2 class="tab-title">Study Folders</h2>
            <button class="btn btn-primary btn-with-icon" @click="createFolder">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                <line x1="12" y1="11" x2="12" y2="17"></line>
                <line x1="9" y1="14" x2="15" y2="14"></line>
              </svg>
              <span>Create Folder</span>
            </button>
          </div>
          
          <!-- Folders Grid -->
          <div class="folders-grid">
            <div v-if="folders.length === 0" class="empty-state">
              <div class="empty-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3>No folders yet</h3>
              <p>Create your first folder to organize your study materials.</p>
              <button class="btn btn-primary" @click="createFolder">
                <span>Create Folder</span>
              </button>
            </div>
            
            <FolderGrid 
              v-else
              :folders="folders"
              @select-folder="handleSelectFolder"
              @create-folder="createFolder"
              @edit-folder="handleEditFolder"
              @delete-folder="handleDeleteFolder"
            />
          </div>
        </div>

        <!-- Blurt Cards Tab -->
        <div v-if="activeTab === 'feyncards'" class="feyncards-tab">
          <div class="tab-header">
            <h2 class="tab-title">Blurt Cards</h2>
            <button class="btn btn-primary btn-with-icon" @click="createFeynCard">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              <span>Create Blurt Card</span>
            </button>
          </div>
          
          <!-- FeynCards Grid -->
          <MaterialList 
            :materials="materials"
            :filtered-materials="filteredMaterials"
            :loading="materialsLoading"
            @select-material="handleSelectMaterial"
            @create-new="createFeynCard"
            @material-edited="handleMaterialEdited"
            @material-deleted="handleMaterialDeleted"
            @category-deleted="handleCategoryDeleted"
          />
        </div>

        <!-- Practice Tests Tab -->
        <div v-if="activeTab === 'practicetests'" class="practicetests-tab">
          <div class="tab-header">
            <h2 class="tab-title">Practice Tests</h2>
            <button class="btn btn-primary btn-with-icon" @click="openPracticeTestModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Create Test</span>
            </button>
          </div>
          
          <!-- Practice Tests List -->
          <PracticeTestList 
            :loading="practiceTestsLoading" 
            :practice-tests="practiceTests" 
            :view-all="true"
            @create-test="openPracticeTestModal"
            @delete-test="handleDeleteTest"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import MaterialList from '@/components/study/MaterialList.vue';
import PracticeTestList from '@/components/study/practicetest/PracticeTestList.vue';
import FolderGrid from '@/components/study/folders/FolderGrid.vue';
import StudyService from '@/services/study.service';

export default {
  name: 'LibraryPage',
  components: {
    MaterialList,
    PracticeTestList,
    FolderGrid
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    // State variables
    const activeTab = ref('folders'); // Default active tab
    const loading = ref(true);
    const folders = ref([]);
    const materials = ref([]);
    const filteredMaterials = ref([]);
    const materialsLoading = ref(false);
    const practiceTests = ref([]);
    const practiceTestsLoading = ref(false);

    // Tabs configuration
    const tabs = [
      {
        id: 'folders',
        label: 'Folders',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>'
      },
      {
        id: 'feyncards',
        label: 'Blurt Cards',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>'
      },
      {
        id: 'practicetests',
        label: 'Practice Tests',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>'
      }
    ];

    // Set active tab
    const setActiveTab = (tabId) => {
      activeTab.value = tabId;
      
      // Load data for the active tab if needed
      if (tabId === 'folders' && folders.value.length === 0) {
        fetchFolders();
      } else if (tabId === 'feyncards' && materials.value.length === 0) {
        fetchMaterials();
      } else if (tabId === 'practicetests' && practiceTests.value.length === 0) {
        fetchPracticeTests();
      }
    };

    // Fetch folders from localStorage (same source as sidebar)
    const fetchFolders = () => {
      try {
        const savedFolders = localStorage.getItem('user-folders');
        if (savedFolders) {
          folders.value = JSON.parse(savedFolders);
        }
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    };

    // Fetch materials from service
    const fetchMaterials = async () => {
      try {
        materialsLoading.value = true;
        const user = store.getters['auth/user'];
        
        if (!user) {
          throw new Error("User not authenticated");
        }
        
        // Fetch materials from Firebase
        const fetchedMaterials = await StudyService.getStudyMaterials(user.uid);
        materials.value = fetchedMaterials;
        filteredMaterials.value = fetchedMaterials;
        
        return fetchedMaterials;
      } catch (error) {
        console.error("Error fetching materials:", error);
        return [];
      } finally {
        materialsLoading.value = false;
      }
    };

    // Fetch practice tests from store
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

    // Create a new folder
    const createFolder = () => {
      // Use the same approach as the sidebar - dispatch a custom event
      // to trigger the sidebar's folder creation modal
      window.dispatchEvent(new CustomEvent('open-create-folder-modal'));
    };

    // Handle folder selection
    const handleSelectFolder = (folder) => {
      // Navigate to the folder view
      router.push(`/folder/${folder.id}`);
    };

    // Handle folder editing
    const handleEditFolder = (folder) => {
      // In a real implementation, you would open a modal or navigate to an edit folder page
      console.log('Editing folder:', folder);
    };

    // Handle folder deletion
    const handleDeleteFolder = (folderId) => {
      // In a real implementation, you would delete the folder via a service
      console.log('Deleting folder:', folderId);
      
      // Remove the folder from the local array
      folders.value = folders.value.filter(folder => folder.id !== folderId);
    };

    // Create a new FeynCard
    const createFeynCard = () => {
      // Navigate to create page
      router.push('/study/create');
    };

    // Handle material selection
    const handleSelectMaterial = (material) => {
      // Navigate to the material view
      router.push(`/study/material/${material.id}`);
    };

    // Handle material editing
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

    // Handle material deletion
    const handleMaterialDeleted = async (materialId) => {
      // Remove the material from the local arrays
      materials.value = materials.value.filter(m => m.id !== materialId);
      filteredMaterials.value = filteredMaterials.value.filter(m => m.id !== materialId);
    };

    // Handle category deletion
    const handleCategoryDeleted = async (categoryName) => {
      // In a real implementation, you would update materials in this category
      console.log('Category deleted:', categoryName);
      
      // Refresh the materials
      await fetchMaterials();
    };

    // Open practice test modal
    const openPracticeTestModal = () => {
      store.dispatch('modals/openPracticeTestModal');
    };

    // Handle practice test deletion
    const handleDeleteTest = (testId) => {
      store.dispatch('practiceTests/deleteTest', testId);
      
      // Refresh the list
      fetchPracticeTests();
    };

    // Event listener setup - we'll register these in onMounted and remove when component unmounts
    // Add event listener to refresh folders when a new folder is created
    const handleFolderCreated = () => {
      fetchFolders();
    };

    // Add event listener for folder deletion events
    const handleFolderDeleted = () => {
      fetchFolders();
    };

    // Initialize data when component is mounted
    onMounted(async () => {
      try {
        loading.value = true;
        
        // Check authentication
        const user = store.getters['auth/user'];
        if (!user) {
          router.push('/login');
          return;
        }
        
        // Load data for the active tab
        if (activeTab.value === 'folders') {
          await fetchFolders();
        } else if (activeTab.value === 'feyncards') {
          await fetchMaterials();
        } else if (activeTab.value === 'practicetests') {
          fetchPracticeTests();
        }
        
        // Add event listeners
        window.addEventListener('folder-created', handleFolderCreated);
        window.addEventListener('folder-deleted', handleFolderDeleted);
      } catch (error) {
        console.error('Error initializing library page:', error);
      } finally {
        loading.value = false;
      }
    });

    return {
      // State
      activeTab,
      loading,
      tabs,
      folders,
      materials,
      filteredMaterials,
      materialsLoading,
      practiceTests,
      practiceTestsLoading,
      
      // Methods
      setActiveTab,
      createFolder,
      handleSelectFolder,
      handleEditFolder,
      handleDeleteFolder,
      createFeynCard,
      handleSelectMaterial,
      handleMaterialEdited,
      handleMaterialDeleted,
      handleCategoryDeleted,
      openPracticeTestModal,
      handleDeleteTest
    };
  }
};
</script>

<style scoped>
.library-page {
  padding-top: 1rem;
  min-height: 100vh;
  background-color: var(--neutral-50);
}

/* Library Header */
.library-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
  padding-top: var(--spacing-12);
}

.library-title {
  font-size: var(--font-size-3xl);
  color: var(--neutral-900);
  margin-bottom: var(--spacing-2);
}

.library-subtitle {
  color: var(--neutral-600);
  font-size: var(--font-size-lg);
}

/* Library Tabs */
.library-tabs {
  display: flex;
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-2);
  margin-bottom: var(--spacing-8);
  box-shadow: var(--shadow-md);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
}

.library-tabs::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.tab-button {
  display: flex;
  align-items: center;
  padding: var(--spacing-3) var(--spacing-4);
  border: none;
  background: transparent;
  color: var(--neutral-600);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
  flex: 1;
  justify-content: center;
  white-space: nowrap;
}

.tab-button:hover {
  background-color: var(--neutral-100);
  color: var(--neutral-900);
}

.tab-button.active {
  background-color: var(--primary-color);
  color: white;
}

.tab-icon {
  margin-right: var(--spacing-2);
  display: flex;
  align-items: center;
}

.tab-label {
  font-size: var(--font-size-md);
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

/* Tab Content */
.tab-content {
  margin-bottom: var(--spacing-16);
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-6);
}

.tab-title {
  font-size: var(--font-size-2xl);
  color: var(--neutral-900);
}

/* Empty State */
.empty-state {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-8);
  box-shadow: var(--shadow-sm);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 250px;
}

.empty-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--neutral-100);
  color: var(--neutral-500);
  border-radius: 50%;
  margin-bottom: var(--spacing-4);
}

.empty-state h3 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-2);
  color: var(--neutral-900);
}

.empty-state p {
  color: var(--neutral-600);
  margin-bottom: var(--spacing-6);
}

/* Folders Grid */
.folders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-5);
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
  padding: 0.75rem 1.5rem;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-with-icon {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

/* Responsive Styles */
@media (max-width: 768px) {
  .library-tabs {
    flex-wrap: nowrap;
    justify-content: flex-start;
    padding: var(--spacing-1);
  }
  
  .tab-button {
    flex: 0 0 auto;
    padding: var(--spacing-2) var(--spacing-3);
  }
  
  .tab-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-4);
  }
  
  .tab-header .btn {
    width: 100%;
  }
}
</style>
