// src/store/modules/modals.js
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
    commit('OPEN_PASTE_TEXT_MODAL');
  },
  closePasteTextModal({ commit }) {
    commit('CLOSE_PASTE_TEXT_MODAL');
  },
  openUploadFileModal({ commit }) {
    commit('OPEN_UPLOAD_FILE_MODAL');
  },
  closeUploadFileModal({ commit }) {
    commit('CLOSE_UPLOAD_FILE_MODAL');
  },
  openCreateSimilarTestModal({ commit }) {
    commit('OPEN_CREATE_SIMILAR_TEST_MODAL');
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
