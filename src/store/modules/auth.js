import { auth } from '@/services/firebase';

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
  initAuth({ commit }) {
    commit('SET_LOADING', true);
    
    // Listen for auth state changes
    auth.onAuthStateChanged(user => {
      if (user) {
        // User is signed in
        commit('SET_USER', {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        });
      } else {
        // User is signed out
        commit('SET_USER', null);
      }
      
      commit('SET_LOADING', false);
    });
  },
  
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
  },
  
  clearUser({ commit }) {
    commit('SET_USER', null);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};