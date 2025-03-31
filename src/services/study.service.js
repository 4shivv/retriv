import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp,
  getDoc,
  deleteDoc,
  orderBy,
  limit,
  setDoc
} from 'firebase/firestore';
import { auth, db } from './firebase';

const StudyService = {
  async saveStudyMaterial(userId, title, content, category = 'Other', deadline = null) {
    // First check if the user is authenticated
    if (!auth.currentUser) {
      throw new Error("You must be logged in to save materials");
    }
    
    try {
      console.log("Saving material with:", {
        userId: auth.currentUser.uid,
        title,
        category,
        contentLength: content ? content.length : 0
      });
      
      // Always use the current authenticated user's ID, not the passed userId
      const docRef = await addDoc(collection(db, 'materials'), {
        userId: auth.currentUser.uid,
        title,
        content,
        category,
        deadline,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log("Material saved successfully with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error saving material:", error);
      throw new Error(`Failed to save material: ${error.message}`);
    }
  },
  
  async getStudyMaterials() {
    // First check if the user is authenticated
    if (!auth.currentUser) {
      throw new Error("You must be logged in to view materials");
    }
    
    try {
      // Always use the current authenticated user's ID
      const q = query(
        collection(db, 'materials'),
        where('userId', '==', auth.currentUser.uid)
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error fetching materials:", error);
      throw new Error(`Failed to fetch materials: ${error.message}`);
    }
  },
  
  async saveStudyAttempt(materialId, recalledText, matchPercentage) {
    // First check if the user is authenticated
    if (!auth.currentUser) {
      throw new Error("You must be logged in to save attempts");
    }
    
    try {
      const docRef = await addDoc(collection(db, 'attempts'), {
        materialId,
        userId: auth.currentUser.uid,
        recalledText,
        matchPercentage,
        timestamp: serverTimestamp()
      });
      
      // Add session tracking
      await this.incrementStudySessions();
      
      return docRef.id;
    } catch (error) {
      console.error("Error saving attempt:", error);
      throw new Error(`Failed to save attempt: ${error.message}`);
    }
  },
  
  async getStudyAttempts(materialId) {
    // First check if the user is authenticated
    if (!auth.currentUser) {
      throw new Error("You must be logged in to view attempts");
    }
    
    try {
      // Always use the current authenticated user's ID and order by timestamp descending (newest first)
      // Note: This query requires a composite index
      try {
        const q = query(
          collection(db, 'attempts'),
          where('materialId', '==', materialId),
          where('userId', '==', auth.currentUser.uid),
          orderBy('timestamp', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (indexError) {
        // If the index error occurs, try a simpler query without the orderBy
        console.warn("Index not found error, using fallback query:", indexError);
        
        const fallbackQuery = query(
          collection(db, 'attempts'),
          where('materialId', '==', materialId),
          where('userId', '==', auth.currentUser.uid)
        );
        
        const fallbackSnapshot = await getDocs(fallbackQuery);
        
        // Sort the results manually
        return fallbackSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .sort((a, b) => {
            // Sort by timestamp in descending order (newest first)
            if (!a.timestamp || !b.timestamp) return 0;
            const timeA = a.timestamp.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
            const timeB = b.timestamp.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
            return timeB - timeA;
          });
      }
    } catch (error) {
      console.error("Error fetching attempts:", error);
      throw new Error(`Failed to fetch attempts: ${error.message}`);
    }
  },

  async getNextReviewDate(materialId) {
    // First check if the user is authenticated
    if (!auth.currentUser) {
      throw new Error("You must be logged in to view review schedule");
    }
    
    try {
      // Try to get the latest attempt for this material with a review schedule
      try {
        // This query might need an index
        const q = query(
          collection(db, 'attempts'),
          where('materialId', '==', materialId),
          where('userId', '==', auth.currentUser.uid),
          orderBy('timestamp', 'desc'),
          limit(10) // Get multiple attempts in case some don't have review schedules
        );
        
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          return null; // No review scheduled
        }
        
        // Find the first document that has a reviewSchedule and is not deprecated
        for (const doc of querySnapshot.docs) {
          const attemptData = doc.data();
          if (attemptData.reviewSchedule && 
              attemptData.reviewSchedule.length > 0 && 
              !attemptData.isDeprecatedSchedule) {
            // Convert dates to Date objects
            const scheduleDates = attemptData.reviewSchedule.map(date => 
              typeof date === 'string' ? new Date(date) : date.toDate());
            
            // Get the current date
            const now = new Date();
            
            // Find the next review date (first date that's in the future)
            const nextReview = scheduleDates.find(date => date > now);
            
            return nextReview;
          }
        }
      } catch (indexError) {
        // If index error occurs, use a simpler approach
        console.warn("Index not found error in getNextReviewDate, using fallback query:", indexError);
        
        // Simpler query without orderBy
        const fallbackQuery = query(
          collection(db, 'attempts'),
          where('materialId', '==', materialId),
          where('userId', '==', auth.currentUser.uid)
        );
        
        const fallbackSnapshot = await getDocs(fallbackQuery);
        
        if (fallbackSnapshot.empty) {
          return null;
        }
        
        // Sort the documents manually
        const sortedDocs = fallbackSnapshot.docs
          .map(doc => doc.data())
          .sort((a, b) => {
            if (!a.timestamp || !b.timestamp) return 0;
            const timeA = a.timestamp.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
            const timeB = b.timestamp.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
            return timeB - timeA;
          });
        
        // Find the first document with a review schedule that's not deprecated
        for (const attemptData of sortedDocs) {
          if (attemptData.reviewSchedule && 
              attemptData.reviewSchedule.length > 0 &&
              !attemptData.isDeprecatedSchedule) {
            // Convert dates to Date objects
            const scheduleDates = attemptData.reviewSchedule.map(date => 
              typeof date === 'string' ? new Date(date) : date.toDate());
            
            // Get the current date
            const now = new Date();
            
            // Find the next review date (first date that's in the future)
            const nextReview = scheduleDates.find(date => date > now);
            
            return nextReview;
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error fetching next review date:", error);
      throw new Error(`Failed to fetch next review date: ${error.message}`);
    }
  },

  /**
   * Generate an enhanced scientifically-based spaced repetition schedule using advanced
   * memory research and algorithms.
   * 
   * This implementation creates optimized schedules at multiple time scales with fine-tuned intervals:
   * - Intrahour (30m-60m): For very difficult material or poor recall
   * - Intraday (2h-8h): For below average recall or new material
   * - Intraweek (1d-7d): For average recall and reinforcement
   * - Intramonth (1w-4w): For good recall and medium-term memory reinforcement
   * - Long-term (1m-6m): For excellent recall and long-term retention
   * 
   * Scientific Research References:
   * - Ebbinghaus Forgetting Curve (1885): Memory retention decreases exponentially over time
   * - SM-2 algorithm: Used by SuperMemo and Anki for spaced repetition
   * - Bjork & Bjork (2011): Desirable difficulties in learning improve long-term retention
   * - Karpicke & Roediger (2008): The critical importance of retrieval for learning
   * - Dunlosky et al. (2013): Improving Students' Learning With Effective Learning Techniques
   * - Cepeda et al. (2008): Optimal spacing intervals for long-term retention
   * - Kornell (2009): Optimising learning using flashcards: Spacing is more effective than cramming
   * 
   * Key principles implemented:
   * 1. Exponentially increasing intervals based on performance
   * 2. Adaptive scheduling based on personal recall history
   * 3. Time-of-day optimization for ideal retention
   * 4. Strategic review timing before predicted forgetting points
   * 5. Difficulty-based interval adjustments
   */
  async generateSpacedRepetitionSchedule(attemptId, matchPercentage, attemptCount = 0) {
    // First check if the user is authenticated
    if (!auth.currentUser) {
      throw new Error("You must be logged in to generate schedules");
    }
    
    try {
      // Get the attempt document to check if this is a re-attempt of the same material
      const attemptRef = doc(db, 'attempts', attemptId);
      const attemptDoc = await getDoc(attemptRef);
      
      if (!attemptDoc.exists()) {
        throw new Error("Attempt not found");
      }
      
      const attemptData = attemptDoc.data();
      const materialId = attemptData.materialId;
      
      // Check for existing attempts with review schedules for this material
      let existingAttemptIdWithSchedule = null;
      try {
        const previousAttemptsQuery = query(
          collection(db, 'attempts'),
          where('materialId', '==', materialId),
          where('userId', '==', auth.currentUser.uid),
          orderBy('timestamp', 'desc')
        );
        
        const previousAttemptsSnapshot = await getDocs(previousAttemptsQuery);
        
        // Find most recent attempt with a review schedule (excluding current attempt)
        for (const doc of previousAttemptsSnapshot.docs) {
          if (doc.id !== attemptId && doc.data().reviewSchedule && doc.data().reviewSchedule.length > 0) {
            existingAttemptIdWithSchedule = doc.id;
            console.log("Found existing review schedule in attempt:", existingAttemptIdWithSchedule);
            break;
          }
        }
      } catch (indexError) {
        console.warn("Index error when checking for existing schedules, continuing with new schedule", indexError);
      }
      
      // Get the material document to check if it has a deadline
      const materialRef = doc(db, 'materials', materialId);
      const materialDoc = await getDoc(materialRef);
      let deadline = null;
      
      if (materialDoc.exists()) {
        const materialData = materialDoc.data();
        deadline = materialData.deadline;
      }
      
      // Get previous attempts for this material to adjust intervals based on performance history
      let previousAttempts = [];
      
      try {
        // This query requires a composite index
        const previousAttemptsQuery = query(
          collection(db, 'attempts'),
          where('materialId', '==', materialId),
          where('userId', '==', auth.currentUser.uid),
          orderBy('timestamp', 'desc')
        );
        
        const previousAttemptsSnapshot = await getDocs(previousAttemptsQuery);
        previousAttempts = previousAttemptsSnapshot.docs.map(doc => doc.data());
      } catch (indexError) {
        console.warn("Index not found error in generateSpacedRepetitionSchedule, using fallback query:", indexError);
        
        // If the index error occurs, use a simpler query and sort manually
        const fallbackQuery = query(
          collection(db, 'attempts'),
          where('materialId', '==', materialId),
          where('userId', '==', auth.currentUser.uid)
        );
        
        const fallbackSnapshot = await getDocs(fallbackQuery);
        
        // Sort the results manually
        previousAttempts = fallbackSnapshot.docs
          .map(doc => doc.data())
          .sort((a, b) => {
            if (!a.timestamp || !b.timestamp) return 0;
            const timeA = a.timestamp.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
            const timeB = b.timestamp.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
            return timeB - timeA;
          });
      }
      
      // Determine the number of previous attempts (excluding the current one)
      // Use the provided attempt count if available, otherwise calculate from previous attempts
      const previousAttemptCount = attemptCount > 0 ? attemptCount : (previousAttempts.length > 0 ? previousAttempts.length - 1 : 0);
      
      // Calculate stability metrics based on performance history
      let stabilityFactor = this._calculateStabilityFactor(previousAttempts, matchPercentage);
      
      // Calculate EaseFactor - a number that reflects how easy the material is to remember
      // Starting with 2.5 (standard in SM-2 algorithm) and adjusting based on performance
      let easeFactor = 2.5;
      
      // If we have previous attempts, adjust the ease factor based on performance trend
      if (previousAttempts.length > 1) {
        // Get the last 3 attempts (or fewer if not available) not including the current one
        const recentAttempts = previousAttempts.slice(1, Math.min(4, previousAttempts.length));
        
        // Calculate average performance
        const sum = recentAttempts.reduce((acc, attempt) => acc + attempt.matchPercentage, 0);
        const avgPerformance = sum / recentAttempts.length;
        
        // Adjust easeFactor based on current performance compared to average
        const performanceDiff = matchPercentage - avgPerformance;
        easeFactor += (performanceDiff * 0.01); // Small adjustment based on performance difference
        
        // Ensure easeFactor stays within reasonable bounds (1.3 to 3.5 is standard for SM-2)
        easeFactor = Math.max(1.3, Math.min(3.5, easeFactor));
      }
      
      // The SM-2 algorithm formula for interval calculation:
      // If first attempt: interval = 1 day
      // If second attempt: interval = 6 days
      // Otherwise: interval = previous_interval * easeFactor
      
      // Initialize a base interval (in days)
      let baseInterval = 1; // Default to 1 day for first attempt
      
      if (previousAttemptCount === 1) {
        // Second attempt
        baseInterval = 6;
      } else if (previousAttemptCount > 1) {
        // Find the interval used for the previous review
        // (time between the two most recent previous attempts)
        if (previousAttempts.length >= 3) {
          const attempt1 = previousAttempts[1]; // Second most recent
          const attempt2 = previousAttempts[2]; // Third most recent
          
          if (attempt1.timestamp && attempt2.timestamp) {
            const date1 = attempt1.timestamp.toDate ? attempt1.timestamp.toDate() : new Date(attempt1.timestamp);
            const date2 = attempt2.timestamp.toDate ? attempt2.timestamp.toDate() : new Date(attempt2.timestamp);
            
            // Calculate days between these attempts
            const msBetween = Math.abs(date1 - date2);
            const daysBetween = msBetween / (1000 * 60 * 60 * 24);
            
            // Use this as the previous interval, multiplied by the ease factor
            baseInterval = Math.round(daysBetween * easeFactor);
          } else {
            // Fallback if timestamp conversion fails
            baseInterval = previousAttemptCount * 2; // Simple progression
          }
        } else {
          // Not enough previous attempts to calculate interval
          baseInterval = previousAttemptCount * 2; // Simple progression
        }
      }
      
      // Apply stability factor to the base interval
      baseInterval = Math.round(baseInterval * stabilityFactor);
      
      // Ensure minimum interval of 1 day (unless performance is very poor)
      baseInterval = matchPercentage >= 50 ? Math.max(1, baseInterval) : baseInterval;
      
      // Now create the actual schedule with multiple review points
      const now = new Date();
      let schedule = [];
      
      // Check if there's a deadline and adjust the schedule if needed
      if (deadline) {
        schedule = this._adjustScheduleForDeadline(now, schedule, deadline);
      }
      
      // Get the time of day for optimizing scheduling
      const currentHour = now.getHours();
      const isEvening = currentHour >= 18 || currentHour < 6;
      const isMorning = currentHour >= 6 && currentHour < 12;
      
      // Calculate optimal time of day for reviews based on research showing enhanced 
      // retention when reviews are spaced across different times
      const getOptimalReviewTime = (dateObj, preferredTimeOfDay = null) => {
        const date = new Date(dateObj);
        
        if (preferredTimeOfDay === 'morning') {
          // Set to morning (8:00 AM)
          date.setHours(8, 0, 0, 0);
        } else if (preferredTimeOfDay === 'afternoon') {
          // Set to afternoon (2:00 PM)
          date.setHours(14, 0, 0, 0);
        } else if (preferredTimeOfDay === 'evening') {
          // Set to evening (7:00 PM)
          date.setHours(19, 0, 0, 0);
        }
        
        return date;
      };
      
      // Create the first critical review exactly at the predicted forgetting point
      // based on Ebbinghaus forgetting curve
      
      // 1. INTRAHOUR - For very poor performance (matchPercentage < 50)
      if (matchPercentage < 50) {
        // More granular approach - add reviews at different short intervals
        // Research shows shorter intervals are critical for weak memory traces
        
        // First review at 30 minutes (critical for initial encoding)
        const review30min = new Date(now);
        review30min.setMinutes(now.getMinutes() + 30);
        schedule.push(review30min);
        
        // Second review at exact 60 minutes (catching forgetting curve drop-off)
        const review60min = new Date(now);
        review60min.setMinutes(now.getMinutes() + 60);
        schedule.push(review60min);
        
        // Add specific review for borderline poor recall at 90 minutes
        if (matchPercentage >= 30 && matchPercentage < 50) {
          const review90min = new Date(now);
          review90min.setMinutes(now.getMinutes() + 90);
          schedule.push(review90min);
        }
      }
      
      // 2. INTRADAY - For below average or intermediate performance
      // Precise timing based on predicted forgetting curve
      if (matchPercentage < 75 || previousAttemptCount < 3) {
        // Adaptive intraday scheduling based on performance bands
        let hoursToAdd = 0;
        
        if (matchPercentage < 60) {
          // Poor retention: review in 2-3 hours
          hoursToAdd = 2 + Math.floor((matchPercentage - 40) / 20);
        } else if (matchPercentage < 75) {
          // Below average: review in 4-6 hours
          hoursToAdd = 4 + Math.floor((matchPercentage - 60) / 15);
        } else {
          // Decent but still early learning: review in 6-8 hours
          hoursToAdd = 6 + Math.floor((matchPercentage - 75) / 25) * 2;
        }
        
        // Add variety by shifting review to a different time of day than current session
        const reviewSameDay = new Date(now);
        reviewSameDay.setHours(now.getHours() + hoursToAdd);
        
        // Research shows varying review contexts enhances retention
        const timeOfDay = isEvening ? 'morning' : (isMorning ? 'afternoon' : 'evening');
        schedule.push(getOptimalReviewTime(reviewSameDay, timeOfDay));
      }
      
      // 3. INTRAWEEK - Critical next-day and few-day reviews
      // Research shows next-day review is crucial for memory consolidation
      if (matchPercentage < 95 || previousAttemptCount < 4) {
        // Add a next-day review if this isn't excellent performance
        const reviewNextDay = new Date(now);
        reviewNextDay.setDate(now.getDate() + 1);
        
        // Schedule next-day review at the opposite time of day
        const nextDayTimeOfDay = isEvening ? 'morning' : 'evening';
        schedule.push(getOptimalReviewTime(reviewNextDay, nextDayTimeOfDay));
        
        // For intermediate performance, add a precise 3-day review
        // (research shows 2-4 day spacing is critical for medium-term retention)
        if (matchPercentage >= 65 && matchPercentage < 85) {
          const review3Day = new Date(now);
          review3Day.setDate(now.getDate() + 3);
          schedule.push(getOptimalReviewTime(review3Day, 'afternoon'));
        }
      }
      
      // 4. EXPANDED INTRAWEEK - Strategic reviews based on scientific intervals
      // Research by Cepeda et al. shows optimal spacing varies by retention interval
      if (baseInterval <= 10 || (matchPercentage >= 60 && matchPercentage < 90)) {
        // Calculate optimal intraweek timing based on performance
        let daysToAdd = 0;
        
        if (matchPercentage < 70) {
          // Lower performance: review in 4-5 days
          daysToAdd = 4;
        } else if (matchPercentage < 80) {
          // Medium performance: review in 5-6 days
          daysToAdd = 5;
        } else {
          // Better performance: review in 7 days
          daysToAdd = 7;
        }
        
        // Add variety by scheduling at a different time of day
        const reviewIntraweek = new Date(now);
        reviewIntraweek.setDate(now.getDate() + daysToAdd);
        schedule.push(getOptimalReviewTime(reviewIntraweek, 'afternoon'));
      }
      
      // 5. INTRAMONTH - Based on performance and scientific research
      if (matchPercentage >= 75) {
        // Schedule a 2-week review for good performers
        const review2Week = new Date(now);
        review2Week.setDate(now.getDate() + 14);
        schedule.push(getOptimalReviewTime(review2Week, 'morning'));
        
        // For very good performance, add more extended reviews
        if (matchPercentage >= 85) {
          // Main review based on calculated interval
          const mainReview = new Date(now);
          mainReview.setDate(now.getDate() + baseInterval);
          schedule.push(getOptimalReviewTime(mainReview));
          
          // For excellent performance, add longer-term retention reviews
          if (matchPercentage >= 90 && previousAttemptCount > 2) {
            // Research shows 1-month review is critical for long-term retention
            const extendedReview = new Date(now);
            extendedReview.setDate(now.getDate() + 30);
            schedule.push(getOptimalReviewTime(extendedReview, 'evening'));
            
            // For truly excellent performance, add a final consolidation review
            if (matchPercentage >= 95 && previousAttemptCount > 4) {
              // Research shows 10-20% extra interval provides optimal spacing
              const consolidationReview = new Date(now);
              consolidationReview.setDate(now.getDate() + Math.round(baseInterval * 1.8));
              schedule.push(getOptimalReviewTime(consolidationReview));
            }
          }
        }
      }
      
      // For subjects with multiple successful reviews, add increasing long-term intervals
      if (previousAttemptCount >= 5 && matchPercentage >= 85) {
        // Calculate long-term interval based on memory research
        const longTermInterval = Math.round(baseInterval * 2.5); // Significant expansion
        const longTermReview = new Date(now);
        longTermReview.setDate(now.getDate() + longTermInterval);
        schedule.push(getOptimalReviewTime(longTermReview, 'morning'));
      }
      
      // Deduplicate and sort the schedule (in case some entries are too close to each other)
      const dedupedSchedule = this._deduplicateSchedule(schedule);
      
      // Store the ease factor and stability metrics for future reference
      console.log("Updating document:", attemptId);
      console.log("With review schedule:", dedupedSchedule);
      console.log("Performance metrics - current:", matchPercentage, 
                 "easeFactor:", easeFactor, 
                 "stabilityFactor:", stabilityFactor,
                 "baseInterval:", baseInterval);
      
      // If there's an existing schedule, delete it before adding the new one
      if (existingAttemptIdWithSchedule) {
        console.log("Removing existing review schedule from attempt:", existingAttemptIdWithSchedule);
        await updateDoc(doc(db, 'attempts', existingAttemptIdWithSchedule), {
          reviewSchedule: [],
          isDeprecatedSchedule: true
        });
      }
      
      await updateDoc(doc(db, 'attempts', attemptId), {
        reviewSchedule: dedupedSchedule.map(date => date.toISOString()),
        easeFactor: easeFactor,
        stabilityFactor: stabilityFactor,
        baseInterval: baseInterval,
        attemptNumber: previousAttemptCount + 1
      });
      
      return dedupedSchedule;
    } catch (error) {
      console.error("Error generating schedule:", error);
      throw new Error(`Failed to generate schedule: ${error.message}`);
    }
  },
  
  /**
   * Generate a deadline-optimized schedule based on available days
   * @param {Date} now - Current date
   * @param {Number} availableDays - Days until the deadline
   * @returns {Array} Optimized schedule of review dates
   */
  _generateDeadlineBasedSchedule(now, availableDays) {
    const schedule = [];
    
    // Get the time of day for optimizing scheduling
    const currentHour = now.getHours();
    // Check if it's morning for time-of-day specific scheduling
    const isMorning = currentHour >= 6 && currentHour < 12;
    
    // Helper function to get optimal review time
    const getOptimalReviewTime = (dateObj, preferredTimeOfDay = null) => {
      const date = new Date(dateObj);
      
      if (preferredTimeOfDay === 'morning') {
        date.setHours(8, 0, 0, 0);
      } else if (preferredTimeOfDay === 'afternoon') {
        date.setHours(14, 0, 0, 0);
      } else if (preferredTimeOfDay === 'evening') {
        date.setHours(19, 0, 0, 0);
      }
      
      return date;
    };
    
    // Determine schedule type based on available time
    if (availableDays <= 1) {
      // ULTRA SHORT-TERM SCHEDULE (1 day or less)
      // Focus on intrahour intervals with more frequent reviews
      
      // 30 minute review (critical initial encoding)
      const review30min = new Date(now);
      review30min.setMinutes(now.getMinutes() + 30);
      schedule.push(review30min);
      
      // 1 hour review
      const review1hr = new Date(now);
      review1hr.setMinutes(now.getMinutes() + 60);
      schedule.push(review1hr);
      
      // 2 hour review
      const review2hr = new Date(now);
      review2hr.setHours(now.getHours() + 2);
      schedule.push(review2hr);
      
      // 4 hour review
      const review4hr = new Date(now);
      review4hr.setHours(now.getHours() + 4);
      schedule.push(review4hr);
      
      // 8 hour review or before sleep (if applicable)
      const review8hr = new Date(now);
      review8hr.setHours(now.getHours() + 8);
      
      // If it would be during normal sleeping hours, adjust to before sleep
      const reviewHour = review8hr.getHours();
      if (reviewHour >= 23 || reviewHour < 6) {
        // Set to 10 PM instead
        review8hr.setHours(22, 0, 0, 0);
      }
      
      schedule.push(review8hr);
      
      // Final review as close to deadline as possible
      const finalReview = new Date(now);
      finalReview.setHours(now.getHours() + (availableDays * 24) - 2); // 2 hours before deadline
      schedule.push(finalReview);
    }
    else if (availableDays <= 3) {
      // SHORT-TERM SCHEDULE (2-3 days)
      // Mix of intrahour, intraday, and next day reviews
      
      // First hour review
      const review1hr = new Date(now);
      review1hr.setMinutes(now.getMinutes() + 60);
      schedule.push(review1hr);
      
      // 3 hour review
      const review3hr = new Date(now);
      review3hr.setHours(now.getHours() + 3);
      schedule.push(review3hr);
      
      // Evening/morning review (opposite of current time)
      const sameDay = new Date(now);
      if (isMorning) {
        sameDay.setHours(19, 0, 0, 0); // Evening
      } else {
        // Set to evening but not too late
        sameDay.setHours(21, 0, 0, 0);
      }
      schedule.push(sameDay);
      
      // Next day morning review
      const nextDay = new Date(now);
      nextDay.setDate(now.getDate() + 1);
      schedule.push(getOptimalReviewTime(nextDay, 'morning'));
      
      // Next day evening review
      const nextDayEvening = new Date(now);
      nextDayEvening.setDate(now.getDate() + 1);
      schedule.push(getOptimalReviewTime(nextDayEvening, 'evening'));
      
      // If we have a third day, add morning and evening reviews
      if (availableDays >= 3) {
        const thirdDay = new Date(now);
        thirdDay.setDate(now.getDate() + 2);
        schedule.push(getOptimalReviewTime(thirdDay, 'morning'));
        
        const thirdDayEvening = new Date(now);
        thirdDayEvening.setDate(now.getDate() + 2);
        schedule.push(getOptimalReviewTime(thirdDayEvening, 'evening'));
      }
      
      // Final review as close to deadline as possible
      const finalReview = new Date(now);
      finalReview.setHours(now.getHours() + (availableDays * 24) - 2); // 2 hours before deadline
      schedule.push(finalReview);
    }
    else if (availableDays <= 7) {
      // MEDIUM-SHORT TERM (4-7 days)
      // Focus on critical first 72 hours, then strategic distribution
      
      // First day - 3 reviews: morning, afternoon, evening
      if (now.getHours() < 12) {
        schedule.push(getOptimalReviewTime(now, 'afternoon'));
        
        const eveningReview = new Date(now);
        schedule.push(getOptimalReviewTime(eveningReview, 'evening'));
      } else if (now.getHours() < 18) {
        schedule.push(getOptimalReviewTime(now, 'evening'));
      }
      
      // Second day - morning and evening reviews
      const secondDay = new Date(now);
      secondDay.setDate(now.getDate() + 1);
      schedule.push(getOptimalReviewTime(secondDay, 'morning'));
      schedule.push(getOptimalReviewTime(secondDay, 'evening'));
      
      // Third day - one review
      const thirdDay = new Date(now);
      thirdDay.setDate(now.getDate() + 2);
      schedule.push(getOptimalReviewTime(thirdDay, 'afternoon'));
      
      // Calculate remaining days and distribute reviews
      const remainingDays = availableDays - 3;
      if (remainingDays > 0) {
        // Distribute reviews evenly in remaining days
        const interval = Math.max(1, Math.floor(remainingDays / 2));
        
        for (let i = 0; i < 2; i++) { 
          const reviewDay = new Date(now);
          reviewDay.setDate(now.getDate() + 3 + (i * interval));
          schedule.push(getOptimalReviewTime(reviewDay, i % 2 === 0 ? 'morning' : 'evening'));
        }
      }
      
      // Final day review
      const finalDay = new Date(now);
      finalDay.setDate(now.getDate() + availableDays - 1);
      schedule.push(getOptimalReviewTime(finalDay, 'morning'));
    }
    else if (availableDays <= 14) {
      // MEDIUM-TERM (8-14 days)
      
      // Intensive initial reviews
      // Same day if morning/afternoon
      if (now.getHours() < 15) {
        const eveningReview = new Date(now);
        schedule.push(getOptimalReviewTime(eveningReview, 'evening'));
      }
      
      // Day 1
      const firstDay = new Date(now);
      firstDay.setDate(now.getDate() + 1);
      schedule.push(getOptimalReviewTime(firstDay, 'morning'));
      
      // Day 2
      const secondDay = new Date(now);
      secondDay.setDate(now.getDate() + 2);
      schedule.push(getOptimalReviewTime(secondDay, 'afternoon'));
      
      // Day 4
      const fourthDay = new Date(now);
      fourthDay.setDate(now.getDate() + 4);
      schedule.push(getOptimalReviewTime(fourthDay, 'morning'));
      
      // Day 7
      const seventhDay = new Date(now);
      seventhDay.setDate(now.getDate() + 7);
      schedule.push(getOptimalReviewTime(seventhDay, 'afternoon'));
      
      // Day 10 if available
      if (availableDays >= 11) {
        const tenthDay = new Date(now);
        tenthDay.setDate(now.getDate() + 10);
        schedule.push(getOptimalReviewTime(tenthDay, 'evening'));
      }
      
      // Final review day before deadline
      const finalDay = new Date(now);
      finalDay.setDate(now.getDate() + availableDays - 1);
      schedule.push(getOptimalReviewTime(finalDay, 'morning'));
    }
    else {
      // LONGER-TERM (15+ days)
      // Scientific spacing based on optimal retention intervals
      
      // Day 1
      const firstDay = new Date(now);
      firstDay.setDate(now.getDate() + 1);
      schedule.push(getOptimalReviewTime(firstDay, 'morning'));
      
      // Day 3
      const thirdDay = new Date(now);
      thirdDay.setDate(now.getDate() + 3);
      schedule.push(getOptimalReviewTime(thirdDay, 'afternoon'));
      
      // Day 7
      const seventhDay = new Date(now);
      seventhDay.setDate(now.getDate() + 7);
      schedule.push(getOptimalReviewTime(seventhDay, 'evening'));
      
      // Day 14
      const fourteenthDay = new Date(now);
      fourteenthDay.setDate(now.getDate() + 14);
      schedule.push(getOptimalReviewTime(fourteenthDay, 'morning'));
      
      // If we have more than 20 days, add a 21-day review
      if (availableDays >= 22) {
        const twentyFirstDay = new Date(now);
        twentyFirstDay.setDate(now.getDate() + 21);
        schedule.push(getOptimalReviewTime(twentyFirstDay, 'afternoon'));
      }
      
      // Final review 1-2 days before deadline
      const finalDay = new Date(now);
      finalDay.setDate(now.getDate() + availableDays - 2);
      schedule.push(getOptimalReviewTime(finalDay, 'morning'));
      
      // Very last review the day before deadline
      const lastDay = new Date(now);
      lastDay.setDate(now.getDate() + availableDays - 1);
      schedule.push(getOptimalReviewTime(lastDay, 'evening'));
    }
    
    // Return the deadline-optimized schedule
    return this._deduplicateSchedule(schedule);
  },
  
  /**
   * Checks if there's a deadline and adjusts the schedule accordingly
   * @param {Date} now - Current date
   * @param {Array} schedule - Initial schedule array
   * @param {Number} deadline - Days until deadline
   * @returns {Array} Adjusted schedule based on deadline
   */
  _adjustScheduleForDeadline(now, schedule, deadline) {
    // Convert deadline from days to a date
    const deadlineDate = new Date(now);
    deadlineDate.setDate(deadlineDate.getDate() + deadline);
    
    // Calculate available days until deadline
    const availableDays = Math.max(1, Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24)));
    
    // If deadline is approaching, adjust the schedule
    if (availableDays < 30) {
      // Create a new deadline-optimized schedule
      // Pass only the necessary parameters
      return this._generateDeadlineBasedSchedule(now, availableDays);
    }
    
    // If deadline is not approaching, return original schedule
    return schedule;
  },
  
  /**
   * Calculate a stability factor that represents how well the material
   * is consolidated in memory based on past performance and recall patterns.
   * 
   * @param {Array} previousAttempts - Array of previous study attempts
   * @param {Number} currentPerformance - The current attempt's match percentage
   * @returns {Number} A factor to adjust the review interval
   */
  _calculateStabilityFactor(previousAttempts, currentPerformance) {
    // Default stability factor
    let stabilityFactor = 1.0;
    
    // If this is the first attempt, base it solely on current performance
    if (previousAttempts.length <= 1) {
      // First-time performance affects initial stability
      if (currentPerformance >= 90) return 1.2;      // Excellent recall
      if (currentPerformance >= 80) return 1.0;      // Good recall
      if (currentPerformance >= 70) return 0.8;      // Decent recall
      if (currentPerformance >= 50) return 0.6;      // Poor recall
      return 0.4;                                   // Very poor recall
    }
    
    // Extract just the performance values from previous attempts (excluding current)
    const performanceHistory = previousAttempts
      .slice(1) // Skip the current attempt
      .map(attempt => attempt.matchPercentage);
    
    // Calculate performance trend
    let trend = 0;
    if (performanceHistory.length >= 2) {
      // Simple linear trend calculation (positive = improving, negative = declining)
      let sum = 0;
      for (let i = 1; i < performanceHistory.length; i++) {
        sum += (performanceHistory[i-1] - performanceHistory[i]);
      }
      trend = sum / (performanceHistory.length - 1);
    }
    
    // Calculate consistency (lower variance = more consistent = higher stability)
    let variance = 0;
    if (performanceHistory.length >= 2) {
      const avg = performanceHistory.reduce((a, b) => a + b, 0) / performanceHistory.length;
      variance = performanceHistory.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / performanceHistory.length;
    }
    const consistency = Math.max(0, 1 - (variance / 1000)); // Normalize to 0-1 range
    
    // Calculate recency weight (more weight to recent performance)
    const recentPerformance = performanceHistory.length > 0 ? performanceHistory[0] : currentPerformance;
    
    // Integrate all factors
    stabilityFactor = (
      (currentPerformance * 0.4) +       // Current performance (40% weight)
      (recentPerformance * 0.3) +        // Recent performance (30% weight)
      (consistency * 20) +               // Consistency bonus (up to 0.2)
      (trend * 0.5)                      // Trend adjustment
    ) / 100;
    
    // Apply bounded adjustments to keep the factor in a reasonable range
    stabilityFactor = Math.max(0.3, Math.min(2.5, stabilityFactor));
    
    return stabilityFactor;
  },
  
  /**
   * Remove duplicate or too closely spaced review dates
   * @param {Array} schedule - Array of Date objects
   * @returns {Array} Deduplicated and sorted schedule
   */
  _deduplicateSchedule(schedule) {
    // First sort the schedule chronologically
    const sortedSchedule = [...schedule].sort((a, b) => a - b);
    
    // Deduplicate based on minimum time differences
    const result = [];
    let prevDate = null;
    
    for (const date of sortedSchedule) {
      if (!prevDate) {
        // First entry
        result.push(date);
        prevDate = date;
        continue;
      }
      
      // Calculate hours between this date and the previous one
      const hoursDiff = (date - prevDate) / (1000 * 60 * 60);
      
      // Only add if there's a meaningful gap
      // - At least 3 hours apart for same-day reviews
      // - At least 12 hours apart for different day reviews
      const isSameDay = date.getDate() === prevDate.getDate() && 
                        date.getMonth() === prevDate.getMonth() &&
                        date.getFullYear() === prevDate.getFullYear();
      
      const minHoursGap = isSameDay ? 3 : 12;
      
      if (hoursDiff >= minHoursGap) {
        result.push(date);
        prevDate = date;
      }
    }
    
    return result;
  },

  async updateStudyMaterial(materialId, title, content, category) {
    // First check if the user is authenticated
    if (!auth.currentUser) {
      throw new Error("You must be logged in to update materials");
    }
    
    try {
      const materialRef = doc(db, 'materials', materialId);
      
      // Get the material to verify ownership
      const materialSnap = await getDoc(materialRef);
      
      if (!materialSnap.exists()) {
        throw new Error("Material not found");
      }
      
      const materialData = materialSnap.data();
      
      // Verify the material belongs to the current user
      if (materialData.userId !== auth.currentUser.uid) {
        throw new Error("You do not have permission to edit this material");
      }
      
      // Update the material
      await updateDoc(materialRef, {
        title,
        content,
        category,
        updatedAt: serverTimestamp()
      });
      
      return materialId;
    } catch (error) {
      console.error("Error updating material:", error);
      throw new Error(`Failed to update material: ${error.message}`);
    }
  },

  async deleteStudyMaterial(materialId) {
    // First check if the user is authenticated
    if (!auth.currentUser) {
      throw new Error("You must be logged in to delete materials");
    }
    
    try {
      const materialRef = doc(db, 'materials', materialId);
      
      // Get the material to verify ownership
      const materialSnap = await getDoc(materialRef);
      
      if (!materialSnap.exists()) {
        throw new Error("Material not found");
      }
      
      const materialData = materialSnap.data();
      
      // Verify the material belongs to the current user
      if (materialData.userId !== auth.currentUser.uid) {
        throw new Error("You do not have permission to delete this material");
      }
      
      // Delete the material
      await deleteDoc(materialRef);
      
      // Also delete all attempts associated with this material
      let attemptSnapshot;
      
      try {
        // This might need an index
        const attemptsQuery = query(
          collection(db, 'attempts'),
          where('materialId', '==', materialId),
          where('userId', '==', auth.currentUser.uid)
        );
        
        attemptSnapshot = await getDocs(attemptsQuery);
      } catch (indexError) {
        console.warn("Index error when fetching attempts to delete:", indexError);
        
        // Fallback to a simpler query
        const fallbackQuery = query(
          collection(db, 'attempts'),
          where('materialId', '==', materialId)
        );
        
        attemptSnapshot = await getDocs(fallbackQuery);
        
        // Filter by userId manually
        attemptSnapshot = {
          docs: attemptSnapshot.docs.filter(doc => doc.data().userId === auth.currentUser.uid)
        };
      }
      
      // Delete each attempt one by one
      const deletePromises = [];
      attemptSnapshot.docs.forEach((doc) => {
        deletePromises.push(deleteDoc(doc.ref));
      });
      
      await Promise.all(deletePromises);
      
      return true;
    } catch (error) {
      console.error("Error deleting material:", error);
      throw new Error(`Failed to delete material: ${error.message}`);
    }
  },

  async getStudyMaterialsByCategory(category) {
    if (!auth.currentUser) {
      throw new Error("You must be logged in to view materials");
    }
    
    try {
      const q = query(
        collection(db, 'materials'),
        where('userId', '==', auth.currentUser.uid),
        where('category', '==', category)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error fetching materials by category:", error);
      throw new Error(`Failed to fetch materials by category: ${error.message}`);
    }
  },

  async getUserCategories() {
    // Implementation needed
  },

  async getStudySessionGoal() {
    if (!auth.currentUser) {
      throw new Error("You must be logged in to access study goals");
    }
    
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists() && userSnap.data().studySessionGoal) {
        return userSnap.data().studySessionGoal;
      }
      return 20; // Default goal
    } catch (error) {
      console.error("Error fetching study session goal:", error);
      return 20;
    }
  },

  async setStudySessionGoal(newGoal) {
    if (!auth.currentUser) {
      throw new Error("You must be logged in to set study goals");
    }
    
    if (newGoal < 1) {
      throw new Error("Goal must be at least 1 session");
    }
    
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        await updateDoc(userRef, { studySessionGoal: newGoal });
      } else {
        await setDoc(userRef, { studySessionGoal: newGoal });
      }
      return newGoal;
    } catch (error) {
      console.error("Error setting study session goal:", error);
      throw new Error(`Failed to set study session goal: ${error.message}`);
    }
  },

  async getMonthlyStudySessions() {
    if (!auth.currentUser) {
      throw new Error("You must be logged in to access study sessions");
    }
    
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists() && userSnap.data().studySessions) {
        const sessions = userSnap.data().studySessions;
        const now = new Date();
        if (sessions.currentMonth && 
            sessions.monthStart && 
            new Date(sessions.monthStart).getMonth() === now.getMonth()) {
          return sessions.currentMonth;
        }
      }
      return 0;
    } catch (error) {
      console.error("Error fetching monthly study sessions:", error);
      return 0;
    }
  },

  async incrementStudySessions() {
    if (!auth.currentUser) {
      throw new Error("You must be logged in to update study sessions");
    }
    
    try {
      const now = new Date();
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        let sessions = userData.studySessions || {};
        
        if (!sessions.monthStart || 
            new Date(sessions.monthStart).getMonth() !== now.getMonth()) {
          sessions = {
            currentMonth: 1,
            monthStart: now.toISOString(),
            total: (sessions.total || 0) + 1
          };
        } else {
          sessions.currentMonth = (sessions.currentMonth || 0) + 1;
          sessions.total = (sessions.total || 0) + 1;
        }
        
        await updateDoc(userRef, { studySessions: sessions });
        return sessions.currentMonth;
      } else {
        const sessions = {
          currentMonth: 1,
          monthStart: now.toISOString(),
          total: 1
        };
        await setDoc(userRef, { studySessions: sessions });
        return 1;
      }
    } catch (error) {
      console.error("Error incrementing study sessions:", error);
      return null;
    }
  },
  
  async getLatestRetentionScore(materialId) {
    if (!auth.currentUser) {
      throw new Error("You must be logged in to view retention scores");
    }
    
    try {
      const attempts = await this.getStudyAttempts(materialId);
      
      if (!attempts || attempts.length === 0) {
        return 0; // No attempts yet
      }
      
      // Sort the attempts by timestamp (newest first)
      const sortedAttempts = [...attempts].sort((a, b) => {
        const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
        const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
        return dateB - dateA;
      });
      
      // Return the most recent retention score
      return sortedAttempts[0].matchPercentage || 0;
    } catch (error) {
      console.error("Error getting latest retention score:", error);
      return 0;
    }
  }
};

export default StudyService;