// Auth is now handled in main.js

const state = {
  user: null,
  loading: true
};

const getters = {
  user: state => state.user,
  isAuthenticated: state => !!state.user,
  loading: state => state.loading
};

const mutations = {
  SET_USER(state, user) {
    state.user = user;
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  }
};

const actions = {
  // No need for initAuth as it's handled in main.js
  
  setUser({ commit }, user) {
    if (user) {
      commit('SET_USER', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      });
    } else {
      commit('SET_USER', null);
    }
    // Set loading to false when user state is set
    commit('SET_LOADING', false);
  },
  
  clearUser({ commit }) {
    commit('SET_USER', null);
    // Set loading to false when user state is cleared
    commit('SET_LOADING', false);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};