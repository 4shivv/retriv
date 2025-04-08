<template>
  <div>
    <!-- Practice Test Modal -->
    <PracticeTestModal 
      :visible="isPracticeTestModalOpen" 
      @close="closePracticeTestModal"
      @select-option="handlePracticeTestOption"
    />
    
    <!-- Paste Text Modal -->
    <PasteTextModal 
      :visible="isPasteTextModalOpen" 
      @close="closePasteTextModal"
      @submit="handlePasteTextSubmit"
    />
    
    <!-- Upload File Modal -->
    <UploadFileModal 
      :visible="isUploadFileModalOpen" 
      @close="closeUploadFileModal"
      @submit="handleFileUploadSubmit"
    />
    
    <!-- Create Similar Test Modal -->
    <CreateSimilarTestModal 
      :visible="isCreateSimilarTestModalOpen" 
      @close="closeCreateSimilarTestModal"
      @submit="handleCreateSimilarSubmit"
    />
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import PracticeTestModal from '@/components/modals/PracticeTestModal.vue';
import PasteTextModal from '@/components/modals/PasteTextModal.vue';
import UploadFileModal from '@/components/modals/UploadFileModal.vue';
import CreateSimilarTestModal from '@/components/modals/CreateSimilarTestModal.vue';

export default {
  name: 'GlobalModals',
  components: {
    PracticeTestModal,
    PasteTextModal,
    UploadFileModal,
    CreateSimilarTestModal
  },
  setup() {
    const store = useStore();

    // Computed properties for modal visibility from global state
    const isPracticeTestModalOpen = computed(() => store.state.modals.isPracticeTestModalOpen);
    const isPasteTextModalOpen = computed(() => store.state.modals.isPasteTextModalOpen);
    const isUploadFileModalOpen = computed(() => store.state.modals.isUploadFileModalOpen);
    const isCreateSimilarTestModalOpen = computed(() => store.state.modals.isCreateSimilarTestModalOpen);

    // Modal close methods
    const closePracticeTestModal = () => {
      store.dispatch('modals/closePracticeTestModal');
    };
    
    const closePasteTextModal = () => {
      store.dispatch('modals/closePasteTextModal');
    };
    
    const closeUploadFileModal = () => {
      store.dispatch('modals/closeUploadFileModal');
    };
    
    const closeCreateSimilarTestModal = () => {
      store.dispatch('modals/closeCreateSimilarTestModal');
    };

    // Modal option handlers
    const handlePracticeTestOption = (option) => {
      closePracticeTestModal();
      
      // Navigate to the appropriate page based on the selected option
      switch(option) {
        case 'paste':
          store.dispatch('modals/openPasteTextModal');
          break;
        case 'upload':
          store.dispatch('modals/openUploadFileModal');
          break;
        case 'ai':
          store.dispatch('modals/openCreateSimilarTestModal');
          break;
      }
    };

    // Modal submit handlers
    const handlePasteTextSubmit = (data) => {
      console.log('Paste text submitted:', data);
      
      // Save the data to the store or perform API actions
      store.dispatch('practiceTests/createFromPastedText', data);
      
      // Close the modal
      closePasteTextModal();
    };
    
    const handleFileUploadSubmit = (data) => {
      console.log('File upload submitted:', data);
      
      // Save the data to the store or perform API actions
      store.dispatch('practiceTests/createFromFileUpload', data);
      
      // Close the modal
      closeUploadFileModal();
    };
    
    const handleCreateSimilarSubmit = (data) => {
      console.log('Create similar test submitted:', data);
      
      // Save the data to the store or perform API actions
      store.dispatch('practiceTests/createSimilarTest', data);
      
      // Close the modal
      closeCreateSimilarTestModal();
    };

    return {
      // Modal visibility state
      isPracticeTestModalOpen,
      isPasteTextModalOpen,
      isUploadFileModalOpen,
      isCreateSimilarTestModalOpen,
      
      // Modal close methods
      closePracticeTestModal,
      closePasteTextModal,
      closeUploadFileModal,
      closeCreateSimilarTestModal,
      
      // Modal option handlers
      handlePracticeTestOption,
      
      // Modal submit handlers
      handlePasteTextSubmit,
      handleFileUploadSubmit,
      handleCreateSimilarSubmit
    };
  }
};
</script>
