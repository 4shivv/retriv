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
  deleteDoc
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
      // Always use the current authenticated user's ID
      const q = query(
        collection(db, 'attempts'),
        where('materialId', '==', materialId),
        where('userId', '==', auth.currentUser.uid)
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error fetching attempts:", error);
      throw new Error(`Failed to fetch attempts: ${error.message}`);
    }
  },

  async generateSpacedRepetitionSchedule(attemptId, matchPercentage) {
    // First check if the user is authenticated
    if (!auth.currentUser) {
      throw new Error("You must be logged in to generate schedules");
    }
    
    try {
      // In a real implementation, this would have AI-based logic
      // For MVP, using a simple algorithm based on performance
      const now = new Date();
      const schedule = [];
      
      // Short-term reviews (same day)
      if (matchPercentage < 70) {
        // Poor recall - review in 1 hour
        const shortReview = new Date(now);
        shortReview.setHours(now.getHours() + 1);
        schedule.push(shortReview);
        
        // And again in 3 hours
        const mediumReview = new Date(now);
        mediumReview.setHours(now.getHours() + 3);
        schedule.push(mediumReview);
      } else if (matchPercentage < 90) {
        // Medium recall - review in 3 hours
        const mediumReview = new Date(now);
        mediumReview.setHours(now.getHours() + 3);
        schedule.push(mediumReview);
      }
      
      // Long-term reviews
      if (matchPercentage < 80) {
        // Tomorrow
        const tomorrowReview = new Date(now);
        tomorrowReview.setDate(now.getDate() + 1);
        schedule.push(tomorrowReview);
        
        // 3 days
        const threeDayReview = new Date(now);
        threeDayReview.setDate(now.getDate() + 3);
        schedule.push(threeDayReview);
      } else {
        // Good recall - review in 2 days and 5 days
        const twoDayReview = new Date(now);
        twoDayReview.setDate(now.getDate() + 2);
        schedule.push(twoDayReview);
        
        const fiveDayReview = new Date(now);
        fiveDayReview.setDate(now.getDate() + 5);
        schedule.push(fiveDayReview);
      }
      
      // Add debugging
      console.log("Updating document:", attemptId);
      console.log("With review schedule:", schedule);
      
      await updateDoc(doc(db, 'attempts', attemptId), {
        reviewSchedule: schedule.map(date => date.toISOString())
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
      const attemptsQuery = query(
        collection(db, 'attempts'),
        where('materialId', '==', materialId)
      );
      
      const attemptSnapshot = await getDocs(attemptsQuery);
      
      // Delete each attempt
      const deletePromises = attemptSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      return true;
    } catch (error) {
      console.error("Error deleting material:", error);
      throw new Error(`Failed to delete material: ${error.message}`);
    }
  }
};

export default StudyService;