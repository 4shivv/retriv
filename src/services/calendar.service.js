/**
 * Google Calendar Integration Service
 * 
 * This service provides methods to integrate review schedules
 * with Google Calendar using the Google Calendar API.
 */

import { auth } from './firebase';

const API_KEY = process.env.VUE_APP_GOOGLE_API_KEY;
const CLIENT_ID = process.env.VUE_APP_GOOGLE_CLIENT_ID;
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

// Ensure gapi is available globally
const getGapi = () => {
  if (typeof window !== 'undefined' && window.gapi) {
    return window.gapi;
  }
  return null;
};

const CalendarService = {
  /**
   * Load the Google API client and authenticate
   */
  async initializeGoogleApi() {
    return new Promise((resolve, reject) => {
      // Load the Google API client script
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        const gapi = getGapi();
        if (!gapi) {
          reject(new Error('Failed to load Google API client'));
          return;
        }
        
        gapi.load('client:auth2', async () => {
          try {
            await gapi.client.init({
              apiKey: API_KEY,
              clientId: CLIENT_ID,
              discoveryDocs: [DISCOVERY_DOC],
              scope: SCOPES,
            });
            
            resolve(true);
          } catch (error) {
            console.error('Error initializing Google API client', error);
            reject(error);
          }
        });
      };
      script.onerror = (error) => {
        console.error('Error loading Google API client script', error);
        reject(error);
      };
      document.body.appendChild(script);
    });
  },
  
  /**
   * Check if the user is authenticated with Google
   */
  isAuthenticated() {
    const gapi = getGapi();
    if (!gapi || !gapi.auth2) {
      return false;
    }
    return gapi.auth2.getAuthInstance()?.isSignedIn.get() || false;
  },
  
  /**
   * Sign in with Google
   */
  async signIn() {
    const gapi = getGapi();
    if (!gapi || !gapi.auth2) {
      await this.initializeGoogleApi();
    }
    
    try {
      const gapi = getGapi();
      if (!gapi || !gapi.auth2) {
        throw new Error('Google API not initialized properly');
      }
      
      const authInstance = gapi.auth2.getAuthInstance();
      await authInstance.signIn();
      return true;
    } catch (error) {
      console.error('Error signing in with Google', error);
      throw new Error(`Failed to sign in with Google: ${error.message}`);
    }
  },
  
  /**
   * Add review schedules to Google Calendar
   * @param {Array} materials - Array of study materials with their review schedules
   */
  async addReviewsToCalendar(materials) {
    // First check if the user is authenticated
    if (!auth.currentUser) {
      throw new Error("You must be logged in to add reviews to calendar");
    }
    
    // Check if the user is authenticated with Google
    if (!this.isAuthenticated()) {
      await this.signIn();
    }
    
    try {
      const events = [];
      const addedMaterials = [];
      
      // Process each material
      for (const material of materials) {
        // Get the review schedule for this material
        if (!material.reviewSchedule || material.reviewSchedule.length === 0) {
          continue;
        }
        
        // Format each review date as a calendar event
        const materialEvents = material.reviewSchedule.map(reviewDate => {
          const date = new Date(reviewDate);
          const endDate = new Date(date);
          endDate.setMinutes(endDate.getMinutes() + 30); // 30 minute review session
          
          return {
            summary: `Retriv: Review "${material.title}"`,
            description: `Review your study material: ${material.title}`,
            start: {
              dateTime: date.toISOString(),
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            end: {
              dateTime: endDate.toISOString(),
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            reminders: {
              useDefault: false,
              overrides: [
                { method: 'popup', minutes: 30 },
                { method: 'email', minutes: 60 }
              ]
            },
            colorId: '6' // Blue
          };
        });
        
        events.push(...materialEvents);
        addedMaterials.push(material.title);
      }
      
      // No events to add
      if (events.length === 0) {
        return { 
          success: false, 
          message: "No review schedules found to add to calendar" 
        };
      }
      
      // Create batch request for multiple events
      const gapi = getGapi();
      if (!gapi || !gapi.client) {
        throw new Error('Google API not initialized properly');
      }
      
      const batch = gapi.client.newBatch();
      
      events.forEach((event, index) => {
        batch.add(
          gapi.client.calendar.events.insert({
            calendarId: 'primary',
            resource: event
          }),
          { id: `event-${index}` }
        );
      });
      
      const response = await batch.execute();
      
      // Check if any events were added
      const batchKeys = Object.keys(response);
      const addedEvents = batchKeys.filter(key => response[key].status === 200).length;
      
      return {
        success: addedEvents > 0,
        message: `Added ${addedEvents} review sessions to your Google Calendar for ${addedMaterials.length} materials.`,
        addedMaterials,
        addedEvents
      };
    } catch (error) {
      console.error('Error adding reviews to calendar', error);
      throw new Error(`Failed to add reviews to calendar: ${error.message}`);
    }
  },
  
  /**
   * Format a single material's review schedule to add to Google Calendar
   * @param {Object} material - The study material with review schedule
   */
  async addMaterialReviewsToCalendar(material) {
    return this.addReviewsToCalendar([material]);
  },
  
  /**
   * Add all due reviews to Google Calendar
   * @param {Array} dueReviews - Array of due reviews
   */
  async addDueReviewsToCalendar(dueReviews) {
    // First check if the user is authenticated
    if (!auth.currentUser) {
      throw new Error("You must be logged in to add reviews to calendar");
    }
    
    // Check if the user is authenticated with Google
    if (!this.isAuthenticated()) {
      await this.signIn();
    }
    
    try {
      const events = [];
      const addedReviews = [];
      
      // Process each due review
      for (const review of dueReviews) {
        if (!review.nextReview) {
          continue;
        }
        
        const date = new Date(review.nextReview);
        const endDate = new Date(date);
        endDate.setMinutes(endDate.getMinutes() + 30); // 30 minute review session
        
        events.push({
          summary: `Retriv: Review "${review.title}"`,
          description: `Review your study material: ${review.title}`,
          start: {
            dateTime: date.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          end: {
            dateTime: endDate.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'popup', minutes: 30 },
              { method: 'email', minutes: 60 }
            ]
          },
          colorId: review.isOverdue ? '11' : '6' // Red for overdue, blue for others
        });
        
        addedReviews.push(review.title);
      }
      
      // No events to add
      if (events.length === 0) {
        return { 
          success: false, 
          message: "No due reviews found to add to calendar" 
        };
      }
      
      // Create batch request for multiple events
      const gapi = getGapi();
      if (!gapi || !gapi.client) {
        throw new Error('Google API not initialized properly');
      }
      
      const batch = gapi.client.newBatch();
      
      events.forEach((event, index) => {
        batch.add(
          gapi.client.calendar.events.insert({
            calendarId: 'primary',
            resource: event
          }),
          { id: `event-${index}` }
        );
      });
      
      const response = await batch.execute();
      
      // Check if any events were added
      const batchKeys = Object.keys(response);
      const addedEvents = batchKeys.filter(key => response[key].status === 200).length;
      
      return {
        success: addedEvents > 0,
        message: `Added ${addedEvents} review sessions to your Google Calendar.`,
        addedReviews,
        addedEvents
      };
    } catch (error) {
      console.error('Error adding due reviews to calendar', error);
      throw new Error(`Failed to add due reviews to calendar: ${error.message}`);
    }
  }
};

export default CalendarService;