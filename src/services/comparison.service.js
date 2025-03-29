/**
 * Advanced text comparison service for blurting-based learning
 * Uses semantic similarity and lexical analysis to provide better comparison
 * and feedback between original and recalled text
 */

const ComparisonService = {
    /**
     * Compare original text with recalled text and generate comparison data
     * @param {string} originalText - The original study material
     * @param {string} recalledText - The user's recalled text
     * @returns {Object} Comparison results with percentage and heatmap data
     */
    compareTexts(originalText, recalledText) {
      // Advanced comparison with multi-pass algorithm for better similarity detection
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
      const matchStrength = new Array(originalWords.length).fill(0); // Track match quality (0-1)
      
      // First pass: exact matches
      recalledWords.forEach((word, recalledIndex) => {
        if (originalWordsMap.has(word)) {
          // Find the best position match (closest to expected position)
          const originalIndices = originalWordsMap.get(word);
          let bestPositionIndex = -1;
          let smallestPositionDiff = Infinity;
          
          // Proportional position matching to handle different length texts
          const expectedPosition = Math.floor((recalledIndex / recalledWords.length) * originalWords.length);
          
          for (const originalIndex of originalIndices) {
            if (!matchedOriginal[originalIndex]) {
              const positionDiff = Math.abs(originalIndex - expectedPosition);
              if (positionDiff < smallestPositionDiff) {
                smallestPositionDiff = positionDiff;
                bestPositionIndex = originalIndex;
              }
            }
          }
          
          if (bestPositionIndex >= 0) {
            matchedOriginal[bestPositionIndex] = true;
            matchedRecalled[recalledIndex] = true;
            matchStrength[bestPositionIndex] = 1.0; // Perfect match
          }
        }
      });
      
      // Second pass: near matches (stemmed words, synonyms, etc.)
      recalledWords.forEach((word, recalledIndex) => {
        // Skip already matched words
        if (matchedRecalled[recalledIndex]) return;
        
        let bestMatchIndex = -1;
        let bestMatchScore = 0.6; // Threshold for considering a near match
        
        // Check all unmatched original words for similarity
        originalWords.forEach((originalWord, originalIndex) => {
          if (matchedOriginal[originalIndex]) return;
          
          // Apply multiple similarity metrics
          let similarityScore = 0;
          
          // 1. Check for stemmed match (e.g., "running" vs "run")
          if (this.getStemmedWord(word) === this.getStemmedWord(originalWord)) {
            similarityScore = Math.max(similarityScore, 0.9); // 90% match for stemmed words
          }
          
          // 2. Check for edit distance (Levenshtein) for typos
          const normalizedEditDistance = this.getLevenshteinSimilarity(word, originalWord);
          similarityScore = Math.max(similarityScore, normalizedEditDistance);
          
          // Update best match if we found a better one
          if (similarityScore > bestMatchScore) {
            bestMatchScore = similarityScore;
            bestMatchIndex = originalIndex;
          }
        });
        
        // If we found a good near match
        if (bestMatchIndex >= 0) {
          matchedOriginal[bestMatchIndex] = true;
          matchedRecalled[recalledIndex] = true;
          matchStrength[bestMatchIndex] = bestMatchScore; // Partial credit for near matches
        }
      });
      
      // Third pass: concepts and key topics matching
      // Extract key concepts and check if they're covered anywhere in the recalled text
      const keyTopics = this.extractKeyTopics(originalWords);
      let conceptMatchCount = 0;
      
      keyTopics.forEach(topic => {
        if (recalledWords.includes(topic) || 
            recalledWords.some(word => this.getStemmedWord(word) === this.getStemmedWord(topic))) {
          conceptMatchCount++;
        }
      });
      
      // Calculate topic coverage percentage
      const topicCoverageScore = keyTopics.length > 0 ? 
        (conceptMatchCount / keyTopics.length) : 0;
      
      // Calculate enhanced match percentage that considers:  
      // 1. Exact word matches with position awareness
      // 2. Near matches with partial credit
      // 3. Concept coverage
      
      // Base match score from individual word matches with strength factored in
      const weightedMatchSum = matchStrength.reduce((sum, strength) => sum + strength, 0);
      const baseMatchPercentage = (weightedMatchSum / originalWords.length) * 100;
      
      // Blend with concept coverage for final score
      const matchPercentage = Math.round(
        (baseMatchPercentage * 0.8) + // 80% weight to word-level matching
        (topicCoverageScore * 20)     // 20% weight to concept coverage
      );
      
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
        .filter(word => word.length > 0) // Remove empty strings
        .filter(word => !this.isStopWord(word)); // Remove common stop words
    },
    
    // Check if a word is a common stop word that doesn't add meaningful content
    isStopWord(word) {
      const stopWords = new Set([
        'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were',
        'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
        'to', 'at', 'in', 'on', 'by', 'for', 'with', 'about', 'of', 'from'
      ]);
      return stopWords.has(word);
    },
    
    // Get stemmed version of word (simple implementation)
    getStemmedWord(word) {
      // Very simple stemming rules (just an example, not comprehensive)
      return word
        .replace(/ing$/, '')
        .replace(/ed$/, '')
        .replace(/s$/, '');
    },
    
    // Calculate Levenshtein similarity between two words (0-1 scale)
    getLevenshteinSimilarity(word1, word2) {
      // Maximum edit operations needed to transform word1 to word2
      const maxDistance = Math.max(word1.length, word2.length);
      if (maxDistance === 0) return 1; // Both empty strings
      
      // Calculate edit distance matrix
      const matrix = [];
      
      // Initialize matrix
      for (let i = 0; i <= word1.length; i++) {
        matrix[i] = [i];
      }
      
      for (let j = 0; j <= word2.length; j++) {
        matrix[0][j] = j;
      }
      
      // Fill in the matrix
      for (let i = 1; i <= word1.length; i++) {
        for (let j = 1; j <= word2.length; j++) {
          const cost = word1[i-1] === word2[j-1] ? 0 : 1;
          matrix[i][j] = Math.min(
            matrix[i-1][j] + 1,      // Deletion
            matrix[i][j-1] + 1,      // Insertion
            matrix[i-1][j-1] + cost  // Substitution
          );
        }
      }
      
      // Get the edit distance
      const editDistance = matrix[word1.length][word2.length];
      
      // Convert to similarity score (1 = identical, 0 = completely different)
      return 1 - (editDistance / maxDistance);
    },
    
    // Extract key topics from text (simplified implementation)
    extractKeyTopics(words) {
      // In a real implementation, this would use NLP techniques
      // For this simplified version, we'll use word frequency and length
      const wordFrequency = {};
      
      // Count frequency of each word
      words.forEach(word => {
        if (word.length <= 2) return; // Skip very short words
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      });
      
      // Create array of [word, frequency] pairs
      const wordPairs = Object.entries(wordFrequency);
      
      // Sort by frequency (highest first)
      wordPairs.sort((a, b) => b[1] - a[1]);
      
      // Take top 25% of words as key topics (minimum 3, maximum 10)
      const topicCount = Math.min(10, Math.max(3, Math.floor(wordPairs.length * 0.25)));
      
      // Extract just the words
      return wordPairs.slice(0, topicCount).map(pair => pair[0]);
    }
  };
  
  export default ComparisonService;