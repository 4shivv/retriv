// src/store/modules/practiceTests.js
const state = {
  tests: []
};

const mutations = {
  ADD_TEST(state, test) {
    state.tests.unshift(test);
  },
  UPDATE_TEST(state, updatedTest) {
    const index = state.tests.findIndex(test => test.id === updatedTest.id);
    if (index !== -1) {
      state.tests.splice(index, 1, updatedTest);
    }
  },
  DELETE_TEST(state, testId) {
    state.tests = state.tests.filter(test => test.id !== testId);
  }
};

const actions = {
  createFromPastedText({ commit }, data) {
    const newTest = {
      id: Date.now().toString(),
      title: data.title,
      questionCount: (data.content.match(/Question/g) || []).length || 5,
      difficulty: data.difficulty,
      createdAt: new Date()
    };
    
    commit('ADD_TEST', newTest);
    return newTest;
  },
  
  createFromFileUpload({ commit }, data) {
    const newTest = {
      id: Date.now().toString(),
      title: data.title,
      questionCount: 10, // Placeholder - would be determined by file processing
      difficulty: data.difficulty,
      createdAt: new Date()
    };
    
    commit('ADD_TEST', newTest);
    return newTest;
  },
  
  createSimilarTest({ commit }, data) {
    const newTest = {
      id: Date.now().toString(),
      title: data.title,
      questionCount: data.questionCount,
      difficulty: data.difficulty,
      createdAt: new Date()
    };
    
    commit('ADD_TEST', newTest);
    return newTest;
  },
  
  updateTest({ commit }, test) {
    commit('UPDATE_TEST', test);
  },
  
  deleteTest({ commit }, testId) {
    commit('DELETE_TEST', testId);
  }
};

const getters = {
  allTests: state => state.tests,
  testById: state => id => state.tests.find(test => test.id === id)
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
