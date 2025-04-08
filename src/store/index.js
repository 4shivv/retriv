import { createStore } from 'vuex';
import authModule from './modules/auth';
import modalsModule from './modules/modals';
import practiceTestsModule from './modules/practiceTests';

export default createStore({
  modules: {
    auth: authModule,
    modals: modalsModule,
    practiceTests: practiceTestsModule
  }
});