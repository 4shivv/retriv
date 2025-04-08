// src/store/modules/modals.js
import router from '@/router';

const state = {
  isPracticeTestModalOpen: false,
  isPasteTextModalOpen: false,
  isUploadFileModalOpen: false,
  isCreateSimilarTestModalOpen: false
};

const mutations = {
  OPEN_PRACTICE_TEST_MODAL(state) {
    state.isPracticeTestModalOpen = true;
  },
  CLOSE_PRACTICE_TEST_MODAL(state) {
    state.isPracticeTestModalOpen = false;
  },
  OPEN_PASTE_TEXT_MODAL(state) {
    state.isPasteTextModalOpen = true;
  },
  CLOSE_PASTE_TEXT_MODAL(state) {
    state.isPasteTextModalOpen = false;
  },
  OPEN_UPLOAD_FILE_MODAL(state) {
    state.isUploadFileModalOpen = true;
  },
  CLOSE_UPLOAD_FILE_MODAL(state) {
    state.isUploadFileModalOpen = false;
  },
  OPEN_CREATE_SIMILAR_TEST_MODAL(state) {
    state.isCreateSimilarTestModalOpen = true;
  },
  CLOSE_CREATE_SIMILAR_TEST_MODAL(state) {
    state.isCreateSimilarTestModalOpen = false;
  },
  // Close all modals at once if needed
  CLOSE_ALL_MODALS(state) {
    state.isPracticeTestModalOpen = false;
    state.isPasteTextModalOpen = false;
    state.isUploadFileModalOpen = false;
    state.isCreateSimilarTestModalOpen = false;
  }
};

const actions = {
  openPracticeTestModal({ commit }) {
    commit('OPEN_PRACTICE_TEST_MODAL');
  },
  closePracticeTestModal({ commit }) {
    commit('CLOSE_PRACTICE_TEST_MODAL');
  },
  openPasteTextModal({ commit }) {
    commit('CLOSE_ALL_MODALS');
    // Navigate to paste text page instead
    router.push('/study/paste-text');
  },
  closePasteTextModal({ commit }) {
    commit('CLOSE_PASTE_TEXT_MODAL');
  },
  openUploadFileModal({ commit }) {
    commit('CLOSE_ALL_MODALS');
    // Navigate to upload file page instead
    router.push('/study/upload-file');
  },
  closeUploadFileModal({ commit }) {
    commit('CLOSE_UPLOAD_FILE_MODAL');
  },
  openCreateSimilarTestModal({ commit }) {
    commit('CLOSE_ALL_MODALS');
    // Navigate to create similar test page instead
    router.push('/study/create-similar-test');
  },
  closeCreateSimilarTestModal({ commit }) {
    commit('CLOSE_CREATE_SIMILAR_TEST_MODAL');
  },
  closeAllModals({ commit }) {
    commit('CLOSE_ALL_MODALS');
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
