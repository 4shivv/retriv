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
  limit
} from 'firebase/firestore';
import { auth, db } from './firebase';

const StudyService = {
  async saveStudyMaterial(userId, title, content) {
    // First check if the user is authenticated
    if (!auth.currentUser) {
      throw new Error("You must be logged in to save materials");
    }
    
    try {
      console.log("Saving material with:", {
        userId: auth.currentUser.uid,
        title,
        contentLength: content ? content.length : 0
      });
      
      // Always use the current authenticated user's ID, not the passed userId
      const docRef = await addDoc(collection(db, 'materials'), {
        userId: auth.currentUser.uid,
        title,
        content,
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
      
      // Calculate average performance over the last 3 attempts (if available)
      let averagePerformance = matchPercentage;
      if (previousAttempts.length > 1) {
        const recentAttempts = previousAttempts.slice(0, Math.min(3, previousAttempts.length));
        const sum = recentAttempts.reduce((acc, attempt) => acc + attempt.matchPercentage, 0);
        averagePerformance = sum / recentAttempts.length;
      }
      
      // Implement a more sophisticated spaced repetition algorithm
      const now = new Date();
      const schedule = [];
      
      // Base intervals (in days) - will be adjusted based on performance
      const intervals = [1, 3, 7, 14, 30, 60, 90, 180];
      
      // Get the appropriate interval based on previous attempts
      const intervalIndex = Math.min(previousAttemptCount, intervals.length - 1);
      let nextInterval = intervals[intervalIndex];
      
      // Adjust interval based on performance - better performance = longer interval
      if (averagePerformance >= 90) {
        nextInterval = nextInterval * 1.5; // Extend the interval for excellent recall
      } else if (averagePerformance >= 80) {
        nextInterval = nextInterval * 1.2; // Slightly extend for good recall
      } else if (averagePerformance >= 70) {
        // Keep as is for decent recall
      } else if (averagePerformance >= 50) {
        nextInterval = nextInterval * 0.7; // Shorten for mediocre recall
      } else {
        nextInterval = nextInterval * 0.5; // Significantly shorten for poor recall
      }
      
      // Always round to at least 1 day
      nextInterval = Math.max(1, Math.round(nextInterval));
      
      // Short-term reviews if performance is poor (same day)
      if (matchPercentage < 50) {
        // Poor recall - review in 2 hours
        const shortReview = new Date(now);
        shortReview.setHours(now.getHours() + 2);
        schedule.push(shortReview);
      }
      
      // Add the main next review based on calculated interval
      const nextReview = new Date(now);
      nextReview.setDate(now.getDate() + nextInterval);
      schedule.push(nextReview);
      
      // Add a follow-up review
      const followUpReview = new Date(now);
      followUpReview.setDate(now.getDate() + nextInterval * 2);
      schedule.push(followUpReview);
      
      // Add debugging
      console.log("Updating document:", attemptId);
      console.log("With review schedule:", schedule);
      console.log("Performance data - current:", matchPercentage, "average:", averagePerformance);
      
      await updateDoc(doc(db, 'attempts', attemptId), {
        reviewSchedule: schedule.map(date => date.toISOString()),
        averagePerformance: averagePerformance,
        attemptNumber: previousAttemptCount + 1
      });
      
      return schedule;
    } catch (error) {
      console.error("Error generating schedule:", error);
      throw new Error(`Failed to generate schedule: ${error.message}`);
    }
  },

  async updateStudyMaterial(materialId, title, content) {
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
  }
};

export default StudyService;