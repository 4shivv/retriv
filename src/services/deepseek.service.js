// src/services/deepseek.service.js

class DeepseekService {
  constructor() {
    // API key configuration from environment variables
    this.apiKey = process.env.VUE_APP_DEEPSEEK_API_KEY;
    this.baseUrl = 'https://api.deepseek.com';
    this.isAvailable = !!this.apiKey;
    this.modelName = process.env.VUE_APP_DEEPSEEK_MODEL || 'deepseek-chat';
    
    // Offline mode state
    this.offlineMode = false;
    
    // Enhanced cache for recent comparisons to reduce API calls
    this.cache = new Map();
    this.cacheMaxSize = 20; // Increased from 10 to 20 entries
    
    // Performance optimization: add request queue to prevent overwhelming API
    this.requestQueue = [];
    this.isProcessingQueue = false;
    this.maxConcurrentRequests = 2;
    this.activeRequests = 0;
    
    // Add timeout configuration to prevent hanging requests
    this.requestTimeout = 10000; // 10 seconds timeout
    
    // Check if network is available
    this._checkNetworkStatus();
    window.addEventListener('online', () => this._setOnlineMode());
    window.addEventListener('offline', () => this._setOfflineMode());
  }

  /**
   * Check if the Deepseek service is available
   * @returns {Boolean} True if the API key is configured, service is available, and not in offline mode
   */
  checkAvailability() {
    return this.isAvailable && !this.offlineMode;
  }
  
  /**
   * Force offline mode on or off
   * @param {Boolean} enabled - True to enable offline mode, false to disable
   */
  setOfflineMode(enabled) {
    this.offlineMode = enabled;
    if (enabled) {
      console.log('Deepseek service: Offline mode enabled');
    } else {
      console.log('Deepseek service: Offline mode disabled');
      this._checkNetworkStatus(); // Re-check network status
    }
  }
  
  /**
   * Internal function to check network status
   * @private
   */
  _checkNetworkStatus() {
    if (!navigator.onLine) {
      this._setOfflineMode();
    } else {
      this._setOnlineMode();
    }
  }
  
  /**
   * Set service to offline mode
   * @private
   */
  _setOfflineMode() {
    console.log('Deepseek service: Network offline, switching to offline mode');
    this.offlineMode = true;
  }
  
  /**
   * Set service to online mode
   * @private
   */
  _setOnlineMode() {
    console.log('Deepseek service: Network online, resuming normal operation');
    this.offlineMode = false;
  }

  /**
   * Generate a cache key for comparison texts
   * @param {String} originalText - The original text
   * @param {String} recalledText - The recalled text
   * @returns {String} Cache key
   */
  _getCacheKey(originalText, recalledText) {
    // Use the first 100 chars of each text as the cache key to avoid memory issues
    const origPrefix = originalText.substring(0, 100);
    const recallPrefix = recalledText.substring(0, 100);
    return `${origPrefix}|||${recallPrefix}`;
  }

  /**
   * Compare two texts using Deepseek AI's language understanding
   * @param {String} originalText - The original text to compare against
   * @param {String} recalledText - The user's recalled text
   * @returns {Promise<Object>} Comparison result with matchPercentage and heatmapData
   */
  async compareTexts(originalText, recalledText) {
    // If in offline mode, throw an error to trigger fallback
    if (this.offlineMode) {
      throw new Error('Deepseek AI service is in offline mode');
    }
    
    if (!this.isAvailable) {
      throw new Error('Deepseek AI service is not available');
    }

    // Check cache first
    const cacheKey = this._getCacheKey(originalText, recalledText);
    if (this.cache.has(cacheKey)) {
      console.log('Using cached comparison result');
      return this.cache.get(cacheKey);
    }
    
    // Add to request queue with promise
    return new Promise((resolve, reject) => {
      const request = {
        originalText,
        recalledText,
        resolve,
        reject
      };
      
      this.requestQueue.push(request);
      this._processQueue(); // Start processing the queue
    });
  }
  
  /**
   * Process the request queue
   * @private
   */
  async _processQueue() {
    // If already processing or no requests, exit
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }
    
    this.isProcessingQueue = true;
    
    try {
      // Process queue items while there are items and we haven't hit concurrency limit
      while (this.requestQueue.length > 0 && this.activeRequests < this.maxConcurrentRequests) {
        // Get the next request
        const request = this.requestQueue.shift();
        this.activeRequests++;
        
        // Process the request with a timeout
        try {
          const result = await Promise.race([
            this._processComparisonRequest(request.originalText, request.recalledText),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Deepseek API request timed out')), this.requestTimeout)
            )
          ]);
          
          request.resolve(result);
        } catch (error) {
          console.error('Error processing comparison request:', error);
          request.reject(error);
        } finally {
          this.activeRequests--;
        }
      }
    } finally {
      this.isProcessingQueue = false;
      
      // If there are still items in the queue, continue processing
      if (this.requestQueue.length > 0) {
        setTimeout(() => this._processQueue(), 100); // Small delay between batches
      }
    }
  }
  
  /**
   * Process a single comparison request
   * @param {String} originalText - The original text
   * @param {String} recalledText - The recalled text
   * @returns {Promise<Object>} Processed comparison result
   * @private
   */
  async _processComparisonRequest(originalText, recalledText) {
    try {
      // Format the prompt for text comparison with an improved system message
      const messages = [
        {
          role: "system",
          content: `You are an expert in memory retention, educational assessment, and cognitive science specializing in analyzing recall accuracy. 

Your task is to perform a detailed analysis of how well a student has recalled a piece of text, focusing on:
1. Overall semantic recall accuracy (not just exact word matches)
2. Identification of key concepts and important ideas
3. Recognition of synonyms, paraphrases, and conceptually equivalent statements
4. Analysis of recall patterns (what was remembered vs. forgotten)

For each word in the original text, assess:
- Whether it was matched in the recall (exactly or semantically)
- Its importance to the overall meaning (scale 0.0-1.0)
- Whether it represents a key concept

For each word in the recalled text, determine:
- Whether it matches something in the original
- Whether it's a meaningful paraphrase or synonym

Return a JSON response with the following structure:
{
  "similarity_score": <float between 0 and 1 representing overall recall accuracy>,
  "analysis": {
    "original_text": [
      {
        "word": "<word>",
        "matched": <boolean>,
        "importance": <float between 0-1>,
        "is_key_concept": <boolean>
      }
    ],
    "recalled_text": [
      {
        "word": "<word>",
        "matched": <boolean>,
        "is_paraphrase": <boolean>
      }
    ],
    "missed_concepts": ["concept1", "concept2"]
  },
  "feedback": "<constructive, personalized feedback on recall performance>",
  "strengths": ["strength1", "strength2"],
  "areas_for_improvement": ["area1", "area2"]
}`
        },
        {
          role: "user",
          content: `Original text: "${originalText}"\n\nRecalled text: "${recalledText}"\n\nPerform a detailed analysis of the recall accuracy, identifying matched words, key concepts, and providing constructive feedback focused on memory improvement techniques.`
        }
      ];

      console.log('Sending request to DeepSeek API...');
      
      // Make the API request
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: messages,
          stream: false,
          temperature: 0.1, // Low temperature for more deterministic results
          max_tokens: 2048  // Ensure enough tokens for the analysis
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Deepseek API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('DeepSeek API response received');
      
      // Extract the content from the response
      const contentString = data.choices[0].message.content;
      
      // Parse the JSON from the response
      let analysisData;
      try {
        // Extract JSON from the response (may be wrapped in markdown code blocks)
        const jsonMatch = contentString.match(/```json\n([\s\S]*?)\n```/) || 
                        contentString.match(/```\n([\s\S]*?)\n```/) ||
                        contentString.match(/{[\s\S]*?}/);
                        
        const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : contentString;
        analysisData = JSON.parse(jsonString);
        console.log('Successfully parsed DeepSeek response');
      } catch (parseError) {
        console.error('Error parsing Deepseek response:', parseError);
        console.error('Response content:', contentString);
        throw new Error('Failed to parse Deepseek response');
      }
      
      // Transform the API response to match our application's expected format
      const result = this._transformApiResponse(analysisData, originalText, recalledText);
      
      // Save to cache
      const cacheKey = this._getCacheKey(originalText, recalledText);
      this.cache.set(cacheKey, result);
      
      // Manage cache size
      if (this.cache.size > this.cacheMaxSize) {
        // Remove oldest entry (using FIFO)
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }
      
      // Store in localStorage for offline access
      try {
        this._storeResponseInLocalStorage(cacheKey, result);
      } catch (e) {
        console.warn('Failed to store response in localStorage:', e);
      }
      
      return result;
    } catch (error) {
      console.error('Deepseek comparison failed:', error);
      throw error;
    }
  }
  
  /**
   * Store API response in localStorage for offline access
   * @param {String} key - Cache key
   * @param {Object} result - Response data
   * @private
   */
  _storeResponseInLocalStorage(key, result) {
    try {
      // Create a simplified version to reduce storage size
      const storageData = {
        matchPercentage: result.matchPercentage,
        feedback: result.feedback,
        timestamp: Date.now()
      };
      
      // Store in localStorage with a prefix
      localStorage.setItem(`deepseek_cache_${key.substring(0, 40)}`, JSON.stringify(storageData));
    } catch (e) {
      console.warn('Error storing response in localStorage:', e);
    }
  }
  
  /**
   * Try to get a response from localStorage if we're offline
   * @param {String} originalText - The original text
   * @param {String} recalledText - The recalled text
   * @returns {Object|null} Cached response or null if not found
   */
  getOfflineResponse(originalText, recalledText) {
    try {
      const key = this._getCacheKey(originalText, recalledText);
      const storageKey = `deepseek_cache_${key.substring(0, 40)}`;
      const storedData = localStorage.getItem(storageKey);
      
      if (!storedData) return null;
      
      // Parse the stored data
      const parsedData = JSON.parse(storedData);
      
      // Check if it's too old (48 hours)
      const twoHoursAgo = Date.now() - (48 * 60 * 60 * 1000);
      if (parsedData.timestamp < twoHoursAgo) {
        // Data is too old, remove it
        localStorage.removeItem(storageKey);
        return null;
      }
      
      // Return a simplified version of what the API would return
      return {
        matchPercentage: parsedData.matchPercentage,
        feedback: parsedData.feedback,
        heatmapData: {
          original: this._generateSimplifiedHeatmapData(originalText, parsedData.matchPercentage),
          recalled: this._generateSimplifiedHeatmapData(recalledText, parsedData.matchPercentage)
        }
      };
    } catch (e) {
      console.warn('Error getting offline response:', e);
      return null;
    }
  }
  
  /**
   * Generate simplified heatmap data for offline mode
   * @param {String} text - The text to process
   * @param {Number} matchPercentage - The overall match percentage
   * @returns {Array} Simplified heatmap data
   * @private
   */
  _generateSimplifiedHeatmapData(text, matchPercentage) {
    // Split text into words
    const words = text.split(/\s+/);
    
    // Calculate how many words to mark as matched based on match percentage
    const matchedCount = Math.round((words.length * matchPercentage) / 100);
    
    // Create heatmap data array
    return words.map((word, index) => {
      // Mark words from start to matchedCount as matched
      // This isn't accurate but provides reasonable visual feedback in offline mode
      const matched = index < matchedCount;
      
      // Mark some words as key concepts (every 5th word for simplicity)
      const isKeyConcept = index % 5 === 0 && word.length > 3;
      
      // Calculate importance based on word length (longer words tend to be more important)
      // Again, not accurate but provides reasonable feedback
      const importance = Math.min(1.0, 0.5 + (word.length * 0.05));
      
      return {
        word,
        matched,
        importance: matched ? importance : null,
        isKeyConcept
      };
    });
  }

  /**
   * Transform the Deepseek API response into our application's expected format
   * @param {Object} apiResponse - The parsed API response
   * @param {String} originalText - The original text
   * @param {String} recalledText - The recalled text
   * @returns {Object} Transformed data matching our application format
   */
  _transformApiResponse(apiResponse, originalText, recalledText) {
    // Extract the overall match percentage
    const matchPercentage = Math.round(apiResponse.similarity_score * 100);
    
    // Extract or transform heatmap data
    const heatmapData = {
      original: this._processHeatmapWords(apiResponse.analysis?.original_text, originalText),
      recalled: this._processHeatmapWords(apiResponse.analysis?.recalled_text, recalledText)
    };
    
    // Format the feedback into sections for better display
    let formattedFeedback = '';
    
    if (apiResponse.feedback) {
      formattedFeedback = apiResponse.feedback;
    }
    
    // Format feedback in markdown sections if we have structured feedback
    if (
      (apiResponse.strengths && apiResponse.strengths.length > 0) || 
      (apiResponse.areas_for_improvement && apiResponse.areas_for_improvement.length > 0) ||
      (apiResponse.analysis?.missed_concepts && apiResponse.analysis.missed_concepts.length > 0)
    ) {
      // Add feedback sections using markdown-style headers
      
      if (apiResponse.strengths && apiResponse.strengths.length > 0) {
        formattedFeedback += "\n\n## Strengths\n";
        apiResponse.strengths.forEach(strength => {
          formattedFeedback += `- ${strength}\n`; 
        });
      }
      
      if (apiResponse.areas_for_improvement && apiResponse.areas_for_improvement.length > 0) {
        formattedFeedback += "\n\n## Areas to Improve\n";
        apiResponse.areas_for_improvement.forEach(area => {
          formattedFeedback += `- ${area}\n`;
        });
      }
      
      if (apiResponse.analysis?.missed_concepts && apiResponse.analysis.missed_concepts.length > 0) {
        formattedFeedback += "\n\n## Key Concepts to Review\n";
        apiResponse.analysis.missed_concepts.forEach(concept => {
          formattedFeedback += `- *${concept}*\n`; // Emphasize with asterisks for concept highlighting
        });
      }
    }
    
    return {
      matchPercentage,
      heatmapData,
      feedback: formattedFeedback.trim()
    };
  }
  
  /**
   * Process heatmap word data from the API response
   * @param {Array} wordAnalysis - Array of word analysis from the API
   * @param {String} text - The full text being analyzed as fallback
   * @returns {Array} Processed word data for our heatmap
   */
  _processHeatmapWords(wordAnalysis, text) {
    if (!wordAnalysis || !Array.isArray(wordAnalysis)) {
      // Fallback: Split the text into words and mark all as unmatched
      return text.split(/\s+/).map(word => ({
        word,
        matched: false
      }));
    }
    
    return wordAnalysis.map(item => ({
      word: item.word,
      matched: item.matched,
      partialMatch: item.is_paraphrase || false,
      importance: item.importance || null,
      isKeyConcept: item.is_key_concept || false,
      similarWords: item.similar_words || [],
      confidence: item.confidence || null
    }));
  }
  
  /**
   * Clear the cache
   */
  clearCache() {
    this.cache.clear();
    
    // Also clear localStorage cache
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('deepseek_cache_')) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log(`Cleared ${keysToRemove.length} cached responses from localStorage`);
    } catch (e) {
      console.warn('Error clearing localStorage cache:', e);
    }
  }
}

export default new DeepseekService();