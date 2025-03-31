<template>
  <div class="feynman-technique">
    <div v-if="showForm">
      <feynman-form
        :material-id="materialId"
        :title="title"
        :content="content"
        @reset="$emit('reset')"
        @completed="handleCompletion"
      />
    </div>
    <div v-else>
      <feynman-view
        :material-id="materialId"
        :title="title"
        @start-feynman="showForm = true"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import FeynmanForm from './FeynmanForm.vue';
import FeynmanView from './FeynmanView.vue';

export default {
  name: 'FeynmanTechnique',
  components: {
    FeynmanForm,
    FeynmanView
  },
  props: {
    materialId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    startMode: {
      type: String,
      default: 'view', // 'view' or 'form'
      validator: (value) => ['view', 'form'].includes(value)
    }
  },
  emits: ['reset', 'completed'],
  
  setup(props, { emit }) {
    const showForm = ref(props.startMode === 'form');
    
    const handleCompletion = (result) => {
      showForm.value = false;
      emit('completed', result);
    };
    
    return {
      showForm,
      handleCompletion
    };
  }
};
</script>

<style scoped>
.feynman-technique {
  width: 100%;
}
</style>