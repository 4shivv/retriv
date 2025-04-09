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
    // Create a test with questions automatically generated from the content
    // Based on the source content, difficulty matches source inherently
    const newTest = {
      id: Date.now().toString(),
      title: data.title,
      questionCount: estimateQuestionCount(data.content),
      createdAt: new Date(),
      type: 'openEndedShortAnswer',
      sourceType: 'pastedText'
    };
    
    commit('ADD_TEST', newTest);
    return newTest;
  },
  
  createFromFileUpload({ commit }, data) {
    // Create a test with questions automatically generated from the file content
    // Based on the source content, difficulty matches source inherently
    const newTest = {
      id: Date.now().toString(),
      title: data.title,
      questionCount: estimateQuestionCount(data.fileContent || ''),
      createdAt: new Date(),
      type: 'openEndedShortAnswer',
      sourceType: 'uploadedFile'
    };
    
    commit('ADD_TEST', newTest);
    return newTest;
  },
  
  createSimilarTest({ commit }, data) {
    // For similar tests, determine question count from source
    const questionCount = data.estimatedQuestionCount || 5;
    
    const newTest = {
      id: Date.now().toString(),
      title: data.title,
      questionCount: questionCount,
      createdAt: new Date(),
      type: 'openEndedShortAnswer',
      sourceType: data.sourceType
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

// Helper function to estimate how many questions to generate based on content length
const estimateQuestionCount = (content) => {
  if (!content) return 5; // Default
  
  // Basic estimate based on length of content
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  
  if (wordCount < 200) return 5;
  if (wordCount < 500) return 8;
  if (wordCount < 1000) return 12;
  if (wordCount < 2000) return 15;
  return 20; // For very long content
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
