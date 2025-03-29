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
  async saveStudyMaterial(userId, title, content, category = 'Other') {
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
        
        // Find the first document that has a reviewSchedule
        for (const doc of querySnapshot.docs) {
          const attemptData = doc.data();
          if (attemptData.reviewSchedule && attemptData.reviewSchedule.length > 0) {
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
        
        // Find the first document with a review schedule
        for (const attemptData of sortedDocs) {
          if (attemptData.reviewSchedule && attemptData.reviewSchedule.length > 0) {
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
   * Generate a scientifically-based spaced repetition schedule based on the SM-2 algorithm
   * and Ebbinghaus forgetting curve principles.
   * 
   * This implementation creates schedules at multiple time scales:
   * - Intrahour: For very difficult material or poor recall
   * - Intraday: For below average recall
   * - Intraweek: For average recall
   * - Intramonth and beyond: For good recall
   * 
   * References:
   * - Ebbinghaus Forgetting Curve: Memory retention decreases exponentially over time
   * - SM-2 algorithm: Used by SuperMemo and Anki for spaced repetition
   * - Bjork & Bjork (2011): Desirable difficulties in learning improve long-term retention
   */
  async generateSpacedRepetitionSchedule(attemptId, matchPercentage) {
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
      const previousAttemptCount = previousAttempts.length > 0 ? previousAttempts.length - 1 : 0;
      
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
      const schedule = [];
      
      // Add reviews at multiple time scales based on performance:

      // 1. INTRAHOUR - For very poor performance (matchPercentage < 40)
      if (matchPercentage < 40) {
        // Add reviews at 20 minutes and 60 minutes
        const review20min = new Date(now);
        review20min.setMinutes(now.getMinutes() + 20);
        schedule.push(review20min);
        
        const review60min = new Date(now);
        review60min.setMinutes(now.getMinutes() + 60);
        schedule.push(review60min);
      }
      
      // 2. INTRADAY - For below average performance (matchPercentage < 70)
      // or if this is one of the first few attempts
      if (matchPercentage < 70 || previousAttemptCount < 2) {
        // Add a review later today (4-8 hours depending on performance)
        const hoursToAdd = matchPercentage < 50 ? 4 : 8;
        const reviewSameDay = new Date(now);
        reviewSameDay.setHours(now.getHours() + hoursToAdd);
        schedule.push(reviewSameDay);
      }
      
      // 3. NEXT DAY - Almost always add a next-day review for early learning
      // (unless performance is excellent AND it's not one of the first few attempts)
      if (matchPercentage < 95 || previousAttemptCount < 3) {
        const reviewNextDay = new Date(now);
        reviewNextDay.setDate(now.getDate() + 1);
        schedule.push(reviewNextDay);
      }
      
      // 4. INTRAWEEK - Medium-term review based on baseInterval
      // If baseInterval is less than 7 days or performance is moderate
      if (baseInterval < 7 || (matchPercentage >= 70 && matchPercentage < 90)) {
        const daysToAdd = Math.min(baseInterval, 7); // Cap at 7 days
        const reviewIntraweek = new Date(now);
        reviewIntraweek.setDate(now.getDate() + daysToAdd);
        schedule.push(reviewIntraweek);
      }
      
      // 5. LONGER TERM - Based on performance and previous history
      if (matchPercentage >= 80) {
        // For good performance, add longer-term reviews
        
        // Main review based on the calculated interval
        const mainReview = new Date(now);
        mainReview.setDate(now.getDate() + baseInterval);
        schedule.push(mainReview);
        
        // For excellent performance, add an even longer review
        if (matchPercentage >= 90 && previousAttemptCount > 2) {
          const extendedReview = new Date(now);
          extendedReview.setDate(now.getDate() + Math.round(baseInterval * 1.5));
          schedule.push(extendedReview);
        }
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
  }
};

export default StudyService;