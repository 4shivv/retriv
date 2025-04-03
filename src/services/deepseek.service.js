/**
 * Deepseek AI Service
 * 
 * This service integrates with Deepseek AI API to generate study materials
 * from user-provided content.
 */

import { auth } from './firebase';

// API configuration
const API_BASE_URL = 'https://api.deepseek.com';

// Get API key from environment variables
// In Vue.js, environment variables are accessed via process.env
const API_KEY = process.env.VUE_APP_DEEPSEEK_API_KEY;

// Logging for debugging
console.log('DeepSeek Service Initialized');
console.log('API Key exists:', !!API_KEY);
console.log('API Key first few chars:', API_KEY ? `${API_KEY.substring(0, 5)}...` : 'Not found');

// Handle case where API key might not be loaded correctly
if (!API_KEY) {
  console.error('DeepSeek API key is missing or not properly loaded from environment variables!');
  console.error('Make sure VUE_APP_DEEPSEEK_API_KEY is set in your .env file and the application is properly loading environment variables.');
}


const DeepseekService = {
  /**
   * Evaluate a Feynman Technique explanation against the original source content
   * @param {string} sourceContent - The original source content
   * @param {string} explanation - The user's explanation
   * @returns {Object} Evaluation results including feedback and score
   */
  async evaluateFeynmanExplanation(sourceContent, explanation) {
    // First check if the user is authenticated
    if (!auth.currentUser) {
      throw new Error("You must be logged in to use Feynman technique features");
    }
    
    try {
      // Prepare the system prompt for Feynman technique evaluation
      const systemPrompt = "You are an expert tutor and educational coach who specializes in the Feynman Technique, which involves explaining complex topics in simple terms to deepen understanding.";
      
      // Prepare the user prompt for the evaluation
      const userPrompt = `I'm practicing the Feynman Technique. Below is the ORIGINAL CONTENT I'm learning, followed by MY EXPLANATION where I tried to explain it in my own simple words.

ORIGINAL CONTENT:
${sourceContent}

MY EXPLANATION:
${explanation}

Please evaluate my explanation using the Feynman Technique principles. Provide constructive feedback on:

1. Strengths of my explanation
2. Gaps or misunderstandings in my explanation
3. Suggestions for improvement

Also, give me a numerical score (0-100) representing my understanding level based on my explanation.

Format your response as a structured JSON with the following fields:
- understandingScore: a number between 0-100
- feedback: an object containing arrays for 'strengths', 'gaps', and 'suggestions'

For example:
{
  "understandingScore": 75,
  "feedback": {
    "strengths": ["Clear explanation of X", "Good use of analogy for Y"],
    "gaps": ["Misunderstood concept Z", "Missed important point A"],
    "suggestions": ["Try using analogy B", "Focus more on concept C"]
  }
}`;
      
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
        console.error('DeepSeek API request failed with status:', response.status);
        
        try {
          const errorData = await response.json();
          console.error('API error details:', errorData);
          throw new Error(`API error (${response.status}): ${errorData.error?.message || JSON.stringify(errorData) || 'Unknown error'}`);
        } catch (parseError) {
          // If we can't parse the error as JSON, use the response text
          const errorText = await response.text();
          console.error('Error response text:', errorText);
          throw new Error(`API error (${response.status}): ${errorText || 'Unknown error'}`);
        }
      }
      
      const responseData = await response.json();
      const generatedContent = responseData.choices[0]?.message?.content;
      
      if (!generatedContent) {
        throw new Error('No evaluation generated from AI');
      }
      
      // Parse the JSON response
      try {
        // Extract JSON from response if wrapped in code blocks
        let jsonContent = generatedContent;
        const jsonMatch = generatedContent.match(/```(?:json)?\s*([\s\S]+?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          jsonContent = jsonMatch[1];
        }
        
        // Clean up any markdown code block markers
        jsonContent = jsonContent.replace(/^```(?:json)?/m, '').replace(/```$/m, '').trim();
        
        // Parse the JSON
        const evaluation = JSON.parse(jsonContent);
        
        // Ensure the structure is as expected
        if (!evaluation.understandingScore || !evaluation.feedback) {
          throw new Error('Evaluation structure is not as expected');
        }
        
        return evaluation;
      } catch (parseError) {
        console.error('Error parsing AI evaluation:', parseError);
        
        // Fallback with default structure if JSON parsing fails
        return {
          understandingScore: 50,
          feedback: {
            strengths: ["You've made an attempt at explaining the concept"],
            gaps: ["There might be some gaps in understanding the full concept"],
            suggestions: ["Try breaking down the concept into simpler terms", "Use analogies to explain complex ideas"]
          }
        };
      }
    } catch (error) {
      console.error('Error evaluating Feynman explanation:', error);
      throw new Error(`Failed to evaluate explanation: ${error.message}`);
    }
  },

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
        console.error('DeepSeek API request failed with status:', response.status);
        
        try {
          const errorData = await response.json();
          console.error('API error details:', errorData);
          throw new Error(`API error (${response.status}): ${errorData.error?.message || JSON.stringify(errorData) || 'Unknown error'}`);
        } catch (parseError) {
          // If we can't parse the error as JSON, use the response text
          const errorText = await response.text();
          console.error('Error response text:', errorText);
          throw new Error(`API error (${response.status}): ${errorText || 'Unknown error'}`);
        }
      }
      
      const responseData = await response.json();
      const generatedContent = responseData.choices[0]?.message?.content;
      
      if (!generatedContent) {
        throw new Error('No content generated from AI');
      }
      
      // Parse the JSON response
      try {
        // First, see if we need to extract the JSON part if the AI wrapped it in backticks
        let jsonContent = generatedContent;
        const jsonMatch = generatedContent.match(/```(?:json)?\s*([\s\S]+?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          jsonContent = jsonMatch[1];
        }
        
        // Clean up any markdown code block markers that might be present
        jsonContent = jsonContent.replace(/^```(?:json)?/m, '').replace(/```$/m, '').trim();
        
        // Additionally, clean up any extra JSON markers at the beginning or end
        jsonContent = jsonContent.replace(/^\s*\[\s*/, '[').replace(/\s*\]\s*$/, ']');
        
        // Handle case where content might still have a markdown code block within the JSON
        jsonContent = jsonContent.replace(/\\```/g, '');
        
        // Fixed: Handle nested JSON arrays - check if there's another JSON array inside
        jsonContent = jsonContent.replace(/"```json\s*\[/g, '[')
          .replace(/\]\s*```"/g, ']')
          .replace(/\\n/g, ' ')
          .replace(/\\"|\\\\/g, '');
        
        const materialCards = JSON.parse(jsonContent);
        
        // Validate the format
        if (!Array.isArray(materialCards)) {
          throw new Error('Generated content is not in the expected array format');
        }
        
        // Make sure we process and clean the content field of each material card
        const cleanedMaterialCards = materialCards.map(card => {
          // Fix: Check if content is a nested JSON string and parse it
          let cleanContent = card.content;
          
          // If content is a string that looks like a JSON array, try to parse it
          if (typeof cleanContent === 'string' && 
              (cleanContent.trim().startsWith('[') || cleanContent.trim().startsWith('```json ['))) {
            try {
              // Clean up JSON formatting in content
              let contentToProcess = cleanContent
                .replace(/```json\s*/g, '')
                .replace(/```/g, '')
                .trim();
                
              // Parse the nested JSON
              const parsed = JSON.parse(contentToProcess);
              
              // If we successfully parsed and it's an array, use the first item's content
              if (Array.isArray(parsed) && parsed.length > 0) {
                cleanContent = parsed[0].content || '';
              }
            } catch (e) {
              // If parsing fails, just clean up markdown formatting
              cleanContent = cleanContent.replace(/```(?:json)?/g, '').replace(/```/g, '');
            }
          } else if (typeof cleanContent === 'string') {
            // Just clean markdown formatting
            cleanContent = cleanContent.replace(/```(?:json)?/g, '').replace(/```/g, '');
          }
          
          return {
            title: card.title || 'Untitled Card',
            content: cleanContent || ''
          };
        });
        
        return cleanedMaterialCards;
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
  /**
   * Generate Study Assistant response to student questions
   * @param {Object} params - Parameters for generating a response
   * @param {string} params.sourceContent - The original study material content
   * @param {string} params.title - Title of the study material
   * @param {string} params.userQuestion - The student's question
   * @param {Array} [params.previousExchanges=[]] - Previous chat exchanges for context
   * @returns {Object} Generated response
   */
  async generateStudyAssistantResponse({
    sourceContent,
    title,
    userQuestion,
    previousExchanges = []
  }) {
    // First check if the user is authenticated
    if (!auth.currentUser) {
      throw new Error("You must be logged in to use the Study Assistant");
    }
    
    try {
      // Prepare messages array for the chat API
      const systemMessage = {
        role: 'system',
        content: `You are an expert study assistant helping a student understand the material "${title}".

Your role is to:
1. Answer questions specifically about the source material
2. Explain difficult concepts in clear, simple terms
3. Provide examples to illustrate abstract ideas
4. Clarify misunderstandings
5. Help the student make connections between concepts

Base your responses on the source material, but add explanations and examples to help understanding.`
      };
      
      // Create the initial message that provides context
      const contextMessage = {
        role: 'user',
        content: `Here is the source material the student is studying:\n\n${sourceContent}`
      };
      
      // Format previous exchanges for API (if any)
      const previousMessages = [];
      if (previousExchanges.length > 0) {
        previousExchanges.forEach(exchange => {
          if (!exchange.isLoading) {
            previousMessages.push({
              role: exchange.type === 'user' ? 'user' : 'assistant',
              content: exchange.content
            });
          }
        });
      }
      
      // Add the current user question
      const currentQuestionMessage = {
        role: 'user',
        content: userQuestion
      };
      
      // Construct the complete messages array for the API request
      const messages = [
        systemMessage,
        contextMessage,
        ...previousMessages,
        currentQuestionMessage
      ];
      
      // Prepare the API request body
      const requestBody = {
        model: 'deepseek-chat',
        messages: messages,
        max_tokens: 2048, // Set a reasonable max token limit
        temperature: 0.7, // Slightly lower temperature for more focused responses
        stream: false
      };
      
      console.log('Making DeepSeek API request:', {
        url: `${API_BASE_URL}/chat/completions`,
        model: requestBody.model,
        messageCount: messages.length
      });
      
      if (!API_KEY) {
        console.error('DeepSeek API key is missing!');
        throw new Error('API key is not configured properly. Please check your environment variables.');
      }
      
      // Call the Deepseek API
      const response = await fetch(`${API_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify(requestBody)
      });
      
      // Parse response
      if (!response.ok) {
        console.error('DeepSeek API request failed with status:', response.status);
        
        try {
          const errorData = await response.json();
          console.error('API error details:', errorData);
          throw new Error(`API error (${response.status}): ${errorData.error?.message || JSON.stringify(errorData) || 'Unknown error'}`);
        } catch (parseError) {
          // If we can't parse the error as JSON, use the response text
          const errorText = await response.text();
          console.error('Error response text:', errorText);
          throw new Error(`API error (${response.status}): ${errorText || 'Unknown error'}`);
        }
      }
      
      let responseData;
      try {
        responseData = await response.json();
        console.log('DeepSeek API response structure:', {
          id: responseData.id,
          model: responseData.model,
          choices: responseData.choices ? responseData.choices.length : 0
        });
      } catch (parseError) {
        console.error('Failed to parse API response as JSON:', parseError);
        const responseText = await response.text();
        console.error('Response text:', responseText.substring(0, 200) + '...');
        throw new Error('Failed to parse API response');
      }
      
      // Get the generated content from the API response
      const generatedContent = responseData.choices?.[0]?.message?.content;
      
      if (!generatedContent) {
        console.error('No content in API response:', responseData);
        throw new Error('No response generated from AI');
      }
      
      // Return the response in the expected format
      return {
        answer: generatedContent
      };
    } catch (error) {
      console.error('Error generating study assistant response:', error);
      throw new Error(`Failed to generate response: ${error.message}`);
    }
  },
  
  _extractMaterialsFromText(text) {
    const materials = [];
    
    // First, check if there's a nested JSON array structure
    const nestedJsonRegex = /```json\s*\[\s*\{\s*"title".*?\}\s*\]\s*```|\[\s*\{\s*"title".*?\}\s*\]/g;
    const nestedJsonMatches = text.match(nestedJsonRegex);
    
    if (nestedJsonMatches && nestedJsonMatches.length > 0) {
      // Process each nested JSON match
      for (const match of nestedJsonMatches) {
        try {
          // Clean up the JSON string
          const cleanedJson = match
            .replace(/```json\s*/g, '')
            .replace(/```/g, '')
            .replace(/\\n/g, ' ')
            .replace(/\\"|\\\\/g, '')
            .trim();
            
          // Parse the JSON
          const parsedItems = JSON.parse(cleanedJson);
          
          if (Array.isArray(parsedItems)) {
            // Process each item in the array
            parsedItems.forEach(item => {
              if (item.title && item.content) {
                // Handle nested JSON in content
                let processedContent = item.content;
                
                if (typeof processedContent === 'string' && 
                    (processedContent.startsWith('[') || processedContent.includes('```json ['))) {
                  try {
                    const contentJson = processedContent
                      .replace(/```json\s*/g, '')
                      .replace(/```/g, '')
                      .trim();
                    const parsedContent = JSON.parse(contentJson);
                    
                    if (Array.isArray(parsedContent) && parsedContent.length > 0) {
                      processedContent = parsedContent[0].content || '';
                    }
                  } catch (e) {
                    // If parsing fails, use as is
                  }
                }
                
                materials.push({
                  title: item.title,
                  content: processedContent
                });
              }
            });
          }
        } catch (e) {
          console.error('Error parsing nested JSON:', e);
        }
      }
      
      if (materials.length > 0) {
        return materials;
      }
    }
    
    // Check for individual JSON objects if nested parsing failed
    const jsonObjects = text.match(/\{\s*"title"\s*:\s*"([^"]+)"\s*,\s*"content"\s*:\s*"([^"]+)"\s*\}/g);
    if (jsonObjects && jsonObjects.length > 0) {
      // Extract each JSON object and add it to materials
      jsonObjects.forEach(obj => {
        try {
          // Replace escaped quotes that might cause parsing issues
          const fixedObj = obj.replace(/\\\\/g, '\\');
          const material = JSON.parse(fixedObj);
          materials.push(material);
        } catch (e) {
          // If parsing fails, try to extract title and content with regex
          const titleMatch = obj.match(/"title"\s*:\s*"([^"]+)"/i);
          const contentMatch = obj.match(/"content"\s*:\s*"([^"]+)"/i);
          if (titleMatch && contentMatch) {
            materials.push({
              title: titleMatch[1],
              content: contentMatch[1]
            });
          }
        }
      });
      if (materials.length > 0) {
        return materials;
      }
    }
    
    // Try to find sections that look like separate materials
    // Look for headings or numbered sections
    const sections = text.split(/\n\s*(?:#{1,3}|\d+\.)\s+/);
    
    if (sections.length <= 1) {
      // If no clear sections, try splitting by blank lines
      const paragraphs = text.split(/\n\s*\n/);
      
      paragraphs.forEach(paragraph => {
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
    sections.forEach((section, i) => {
      if (i === 0 && section.trim().length === 0) return; // Skip empty first section
      
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