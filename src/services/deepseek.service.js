/**
 * Deepseek AI Service
 * 
 * This service integrates with Deepseek AI API to generate study materials
 * from user-provided content.
 */

import { auth } from './firebase';

// API configuration
const API_BASE_URL = 'https://api.deepseek.com';
const API_KEY = process.env.VUE_APP_DEEPSEEK_API_KEY;

const DeepseekService = {
  /**
   * Generate study materials from the provided content
   * @param {string} sourceContent - The source content provided by the user
   * @param {string} sourceType - Type of source: 'text', 'question', or 'file'
   * @returns {Array} Array of generated study materials
   */
  async generateStudyMaterials(sourceContent, sourceType = 'text') {
    // First check if the user is authenticated
    if (!auth.currentUser) {
      throw new Error("You must be logged in to generate AI study materials");
    }
    
    try {
      // Prepare the system prompt based on source type
      let systemPrompt = "You are an expert educational content generator.";
      let userPrompt = "";
      
      if (sourceType === 'text') {
        userPrompt = `A user has provided the following study material:\n\n${sourceContent}\n\nTask: Rewrite this material into clear, concise paragraphs that are easy to understand. For each distinct concept mentioned in the text, create a separate material card. Each card should include:\n\n- A concise focused paragraph (or paragraphs) focused on that concept.\n- Emphasis on the unique aspects of the concept that differentiate it from similar topics.\n- Please ensure that each material card is self-contained and suitable for a 'blurt' session for effective memorization. Do not include any extra commentary.\n\nFormat your response as a JSON array where each element is an object with "title" and "content" fields.`;
      } else if (sourceType === 'question') {
        userPrompt = `A user has asked the following question:\n\n${sourceContent}\n\nTask: Generate comprehensive study material that addresses this question. Break down the answer into clear, concise paragraphs covering distinct concepts. For each concept, create a separate material card. Each card should include:\n\n- A concise focused paragraph (or paragraphs) focused on that concept.\n- Emphasis on the unique aspects of the concept that differentiate it from similar topics.\n- Please ensure that each material card is self-contained and suitable for a 'blurt' session for effective memorization. Do not include any extra commentary.\n\nFormat your response as a JSON array where each element is an object with "title" and "content" fields.`;
      } else if (sourceType === 'file') {
        userPrompt = `A user has provided the following content from a file:\n\n${sourceContent}\n\nTask: Rewrite this material into clear, concise paragraphs that are easy to understand. For each distinct concept mentioned in the text, create a separate material card. Each card should include:\n\n- A concise focused paragraph (or paragraphs) focused on that concept.\n- Emphasis on the unique aspects of the concept that differentiate it from similar topics.\n- Please ensure that each material card is self-contained and suitable for a 'blurt' session for effective memorization. Do not include any extra commentary.\n\nFormat your response as a JSON array where each element is an object with "title" and "content" fields.`;
      }
      
      // Call the Deepseek API
      const response = await fetch(`${API_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          stream: false
        })
      });
      
      // Parse response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${errorData.error?.message || 'Unknown error'}`);
      }
      
      const responseData = await response.json();
      const generatedContent = responseData.choices[0]?.message?.content;
      
      if (!generatedContent) {
        throw new Error('No content generated from AI');
      }
      
      // Parse the JSON response
      try {
        const materialCards = JSON.parse(generatedContent);
        
        // Validate the format
        if (!Array.isArray(materialCards)) {
          throw new Error('Generated content is not in the expected array format');
        }
        
        return materialCards;
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        
        // If JSON parsing fails, try to extract materials using regex
        return this._extractMaterialsFromText(generatedContent);
      }
    } catch (error) {
      console.error('Error generating study materials:', error);
      throw new Error(`Failed to generate study materials: ${error.message}`);
    }
  },
  
  /**
   * Fallback method to extract materials from text if JSON parsing fails
   * @param {string} text - The generated text to extract materials from
   * @returns {Array} Extracted materials
   */
  _extractMaterialsFromText(text) {
    const materials = [];
    
    // Try to find sections that look like separate materials
    // Look for headings or numbered sections
    const sections = text.split(/\n\s*(?:#{1,3}|\d+\.)\s+/);
    
    if (sections.length <= 1) {
      // If no clear sections, try splitting by blank lines
      const paragraphs = text.split(/\n\s*\n/);
      
      paragraphs.forEach((paragraph, index) => {
        const trimmed = paragraph.trim();
        if (trimmed.length > 0) {
          // Extract the first sentence as a title
          const sentences = trimmed.split(/(?<=[.!?])\s+/);
          const title = sentences[0].replace(/[.!?]$/, '');
          const content = trimmed;
          
          materials.push({ 
            title: title.length > 50 ? title.substring(0, 50) + '...' : title, 
            content: content 
          });
        }
      });
      
      return materials;
    }
    
    // Process each section
    sections.forEach((section, index) => {
      if (index === 0 && section.trim().length === 0) return; // Skip empty first section
      
      const trimmed = section.trim();
      if (trimmed.length === 0) return;
      
      // Extract the first line as a title
      const lines = trimmed.split('\n');
      const title = lines[0].replace(/[.!?:]$/, '').trim();
      const content = trimmed;
      
      materials.push({ 
        title: title.length > 50 ? title.substring(0, 50) + '...' : title, 
        content: content 
      });
    });
    
    return materials;
  }
};

export default DeepseekService;