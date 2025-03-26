/**
 * Simple text comparison service for the MVP
 * In a production app, this would likely use more sophisticated 
 * algorithms or AI services
 */

const ComparisonService = {
    /**
     * Compare original text with recalled text and generate comparison data
     * @param {string} originalText - The original study material
     * @param {string} recalledText - The user's recalled text
     * @returns {Object} Comparison results with percentage and heatmap data
     */
    compareTexts(originalText, recalledText) {
      // Simple word-by-word comparison for MVP
      const originalWords = this.preprocessText(originalText);
      const recalledWords = this.preprocessText(recalledText);
      
      // Create a mapping for quick lookup
      const originalWordsMap = new Map();
      originalWords.forEach((word, index) => {
        if (!originalWordsMap.has(word)) {
          originalWordsMap.set(word, []);
        }
        originalWordsMap.get(word).push(index);
      });
      
      // Track which words were matched
      const matchedOriginal = new Array(originalWords.length).fill(false);
      const matchedRecalled = new Array(recalledWords.length).fill(false);
      
      // First pass: exact matches
      recalledWords.forEach((word, recalledIndex) => {
        if (originalWordsMap.has(word)) {
          // Find the first unmatched occurrence in original text
          const originalIndices = originalWordsMap.get(word);
          for (const originalIndex of originalIndices) {
            if (!matchedOriginal[originalIndex]) {
              matchedOriginal[originalIndex] = true;
              matchedRecalled[recalledIndex] = true;
              break;
            }
          }
        }
      });
      
      // Calculate match percentage
      const matchedCount = matchedOriginal.filter(Boolean).length;
      const matchPercentage = Math.round((matchedCount / originalWords.length) * 100);
      
      // Generate heatmap data
      const heatmapData = {
        original: originalWords.map((word, index) => ({
          word,
          matched: matchedOriginal[index]
        })),
        recalled: recalledWords.map((word, index) => ({
          word,
          matched: matchedRecalled[index]
        }))
      };
      
      return {
        matchPercentage,
        heatmapData
      };
    },
    
    // Helper function to preprocess text for comparison
    preprocessText(text) {
      return text
        .toLowerCase()
        .replace(/[^\w\s]|_/g, '') // Remove punctuation
        .split(/\s+/) // Split by whitespace
        .filter(word => word.length > 0); // Remove empty strings
    }
  };
  
  export default ComparisonService;