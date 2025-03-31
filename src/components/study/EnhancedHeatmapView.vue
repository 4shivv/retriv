<template>
  <div class="enhanced-heatmap">
    <div class="heatmap-controls" v-if="isDeepseekEnabled">
      <div class="controls-title">Advanced Analysis</div>
      <div class="toggle-group">
        <label class="toggle-option">
          <input type="checkbox" v-model="showPartialMatches"> 
          <span>Partial Matches</span>
        </label>
        <label class="toggle-option">
          <input type="checkbox" v-model="showImportance"> 
          <span>Content Importance</span>
        </label>
        <label class="toggle-option">
          <input type="checkbox" v-model="highlightKeyConcepts"> 
          <span>Key Concepts</span>
        </label>
      </div>
    </div>
    
    <h5>{{ title }}</h5>
    <div class="heatmap-container" :class="{ 'advanced': isDeepseekEnabled }">
      <p>
        <template v-for="(item, index) in heatmapData" :key="index">
          <span 
            class="heatmap-text" 
            :class="getWordClass(item)"
            :title="getWordTooltip(item)"
          >
            {{ item.word }}
          </span>
        </template>
      </p>
    </div>
    
    <div class="heatmap-legend">
      <div class="legend-item">
        <span class="legend-color matched"></span>
        <span>Remembered</span>
      </div>
      <div class="legend-item" v-if="isDeepseekEnabled && showPartialMatches">
        <span class="legend-color partial-match"></span>
        <span>Partial Match</span>
      </div>
      <div class="legend-item">
        <span class="legend-color unmatched"></span>
        <span>Missed</span>
      </div>
      <div class="legend-item" v-if="isDeepseekEnabled && highlightKeyConcepts">
        <span class="legend-color key-concept"></span>
        <span>Key Concept</span>
      </div>
    </div>
    
    <div class="ai-feedback" v-if="feedback && isDeepseekEnabled">
      <div class="feedback-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        <span>AI Feedback</span>
      </div>
      <div class="feedback-content" v-html="formattedFeedback"></div>
      
      <div class="feedback-sections" v-if="hasFeedbackSections">
        <div class="feedback-section" v-for="(section, index) in feedbackSections" :key="index">
          <div class="section-header">
            <svg v-if="section.type === 'strength'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <svg v-if="section.type === 'area-for-improvement'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <svg v-if="section.type === 'suggestion'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>{{ section.title }}</span>
          </div>
          <div class="section-content" v-html="formatSectionContent(section.content)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import DeepseekService from '@/services/deepseek.service';

export default {
  name: 'EnhancedHeatmapView',
  props: {
    heatmapData: {
      type: Array,
      required: true
    },
    feedback: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: 'Comparison Heatmap'
    }
  },
  
  setup(props) {
    const showPartialMatches = ref(true);
    const showImportance = ref(false);
    const highlightKeyConcepts = ref(true);
    
    const isDeepseekEnabled = computed(() => {
      return DeepseekService.checkAvailability();
    });
    
    const hasAdvancedData = computed(() => {
      if (!props.heatmapData || props.heatmapData.length === 0) return false;
      
      // Check if any word has the partialMatch property
      return props.heatmapData.some(item => 
        Object.prototype.hasOwnProperty.call(item, 'partialMatch') || 
        Object.prototype.hasOwnProperty.call(item, 'importance') ||
        (Object.prototype.hasOwnProperty.call(item, 'similarWords') && item.similarWords.length > 0) ||
        Object.prototype.hasOwnProperty.call(item, 'isKeyConcept')
      );
    });
    
    const getWordClass = (item) => {
      const classes = [];
      
      if (item.matched) {
        classes.push('heatmap-matched');
      } else if (item.partialMatch && showPartialMatches.value) {
        classes.push('heatmap-partial-match');
      } else {
        classes.push('heatmap-unmatched');
      }
      
      // Add importance class if available and enabled
      if (showImportance.value && item.importance) {
        if (item.importance >= 0.8) {
          classes.push('high-importance');
        } else if (item.importance >= 0.5) {
          classes.push('medium-importance');
        }
      }
      
      // Add key concept highlighting if enabled
      if (highlightKeyConcepts.value && item.isKeyConcept) {
        classes.push('key-concept');
      }
      
      return classes;
    };
    
    const getWordTooltip = (item) => {
      if (!isDeepseekEnabled.value) return '';
      
      let tooltip = '';
      
      if (item.matched) {
        tooltip = 'Correctly remembered';
      } else if (item.partialMatch) {
        tooltip = 'Partially matched';
        
        // Add similar words if available
        if (item.similarWords && item.similarWords.length > 0) {
          tooltip += `\nSimilar words used: ${item.similarWords.join(', ')}`;
        }
      } else {
        tooltip = 'Not remembered';
      }
      
      // Add confidence if available
      if (item.confidence) {
        tooltip += `\nMatch confidence: ${Math.round(item.confidence * 100)}%`;
      }
      
      // Add importance if available
      if (item.importance) {
        tooltip += `\nContent importance: ${Math.round(item.importance * 100)}%`;
      }
      
      // Add key concept indicator if available
      if (item.isKeyConcept) {
        tooltip += '\nKey concept for understanding';
      }
      
      return tooltip;
    };
    
    // Process feedback to detect sections and format content
    const hasFeedbackSections = computed(() => {
      return props.feedback && props.feedback.includes('##');
    });
    
    const feedbackSections = computed(() => {
      if (!props.feedback) return [];
      
      // If feedback has markdown-style sections
      if (props.feedback.includes('##')) {
        const sections = [];
        const parts = props.feedback.split('##').filter(part => part.trim() !== '');
        
        parts.forEach(part => {
          const lines = part.trim().split('\n');
          const title = lines[0].trim();
          const content = lines.slice(1).join('\n').trim();
          
          let type = 'general';
          if (title.toLowerCase().includes('strength') || title.toLowerCase().includes('good')) {
            type = 'strength';
          } else if (title.toLowerCase().includes('improve') || title.toLowerCase().includes('work on')) {
            type = 'area-for-improvement';
          } else if (title.toLowerCase().includes('suggest') || title.toLowerCase().includes('try')) {
            type = 'suggestion';
          }
          
          sections.push({
            title,
            content,
            type
          });
        });
        
        return sections;
      }
      
      // If no sections detected, return the whole feedback as one section
      return [{
        title: 'Feedback',
        content: props.feedback,
        type: 'general'
      }];
    });
    
    const formattedFeedback = computed(() => {
      if (!props.feedback || hasFeedbackSections.value) return '';
      return formatSectionContent(props.feedback);
    });
    
    const formatSectionContent = (content) => {
      if (!content) return '';
      
      // Format key concepts
      let formatted = content;
      
      // Replace *key concept* with highlighted span
      formatted = formatted.replace(/\*(.*?)\*/g, '<span class="highlighted-concept">$1</span>');
      
      // Replace bullet points
      formatted = formatted.replace(/^- (.*)$/gm, '<span class="feedback-bullet">•</span> $1');
      
      return formatted;
    };
    
    return {
      showPartialMatches,
      showImportance,
      highlightKeyConcepts,
      isDeepseekEnabled,
      hasAdvancedData,
      getWordClass,
      getWordTooltip,
      hasFeedbackSections,
      feedbackSections,
      formattedFeedback,
      formatSectionContent
    };
  }
}
</script>

<style scoped>
.enhanced-heatmap {
  margin-bottom: var(--spacing-6);
}

.heatmap-controls {
  margin-bottom: var(--spacing-4);
  background-color: var(--neutral-100);
  padding: var(--spacing-3);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--primary-color);
}

.controls-title {
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-2);
  font-size: var(--font-size-sm);
  color: var(--neutral-700);
}

.toggle-group {
  display: flex;
  gap: var(--spacing-4);
}

.toggle-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-xs);
  cursor: pointer;
}

.heatmap-container {
  background-color: var(--neutral-50);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-4);
  line-height: 1.8;
}

.heatmap-container.advanced {
  border-left: 3px solid var(--primary-color);
}

.heatmap-text {
  position: relative;
  margin-right: 3px;
  padding: 2px 4px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.heatmap-matched {
  background-color: rgba(16, 185, 129, 0.15);
  position: relative;
}

.heatmap-matched::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #10b981;
}

.heatmap-partial-match {
  background-color: rgba(245, 158, 11, 0.15);
  position: relative;
}

.heatmap-partial-match::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #f59e0b;
}

.heatmap-unmatched {
  background-color: rgba(239, 68, 68, 0.1);
  position: relative;
}

.heatmap-unmatched::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #ef4444;
}

/* Word importance styling */
.high-importance {
  font-weight: var(--font-weight-bold);
  border: 1px dashed var(--primary-color);
}

.medium-importance {
  font-weight: var(--font-weight-medium);
}

.key-concept {
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.3);
  border-radius: var(--radius-sm);
  padding: 0 4px;
  margin: 0 2px;
  position: relative;
}

.key-concept::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #8b5cf6;
}

.heatmap-legend {
  display: flex;
  gap: var(--spacing-6);
  justify-content: center;
  margin-bottom: var(--spacing-4);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-xs);
  color: var(--neutral-600);
}

.legend-color {
  width: 16px;
  height: 3px;
  border-radius: 1px;
}

.legend-color.matched {
  background-color: rgba(16, 185, 129, 0.15);
  border-bottom: 2px solid #10b981;
}

.legend-color.partial-match {
  background-color: rgba(245, 158, 11, 0.15);
  border-bottom: 2px solid #f59e0b;
}

.legend-color.unmatched {
  background-color: rgba(239, 68, 68, 0.1);
  border-bottom: 2px solid #ef4444;
}

.legend-color.key-concept {
  background-color: rgba(139, 92, 246, 0.3);
  border-bottom: 2px solid #8b5cf6;
}

.ai-feedback {
  background-color: var(--neutral-50);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  margin-top: var(--spacing-4);
  border-left: 3px solid #8b5cf6;
}

.feedback-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-2);
  font-weight: var(--font-weight-medium);
  color: #8b5cf6;
  font-size: var(--font-size-sm);
}

.feedback-content {
  font-size: var(--font-size-sm);
  line-height: 1.6;
  color: var(--neutral-700);
}

.feedback-sections {
  margin-top: var(--spacing-4);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.feedback-section {
  border-radius: var(--radius-md);
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  background-color: var(--neutral-100);
}

.section-header svg {
  flex-shrink: 0;
}

.feedback-section:has(.section-header:has(svg[stroke="#10b981"])) .section-header {
  color: #10b981;
  background-color: rgba(16, 185, 129, 0.1);
}

.feedback-section:has(.section-header:has(svg[stroke="#f59e0b"])) .section-header {
  color: #f59e0b;
  background-color: rgba(245, 158, 11, 0.1);
}

.section-content {
  padding: var(--spacing-3);
  background-color: var(--neutral-50);
  font-size: var(--font-size-sm);
  line-height: 1.6;
}

.highlighted-concept {
  background-color: rgba(139, 92, 246, 0.15);
  padding: 0 4px;
  border-radius: var(--radius-sm);
  border-bottom: 2px solid #8b5cf6;
  font-weight: var(--font-weight-medium);
}

.feedback-bullet {
  display: inline-block;
  width: 16px;
  color: #8b5cf6;
  font-weight: bold;
}
</style>