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
  orderBy
} from 'firebase/firestore';
import { auth, db } from './firebase';

const FolderService = {
  async createFolder(name) {
    // First check if the user is authenticated
    if (!auth.currentUser) {
      throw new Error("You must be logged in to create folders");
    }
    
    try {
      // Create a new folder document
      const docRef = await addDoc(collection(db, 'folders'), {
        userId: auth.currentUser.uid,
        name,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return {
        id: docRef.id,
        name,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error("Error creating folder:", error);
      throw new Error(`Failed to create folder: ${error.message}`);
    }
  },
  
  async getFolders() {
    // First check if the user is authenticated
    if (!auth.currentUser) {
      throw new Error("You must be logged in to view folders");
    }
    
    try {
      // Query folders for this user ordered by name (alphabetically)
      try {
        const q = query(
          collection(db, 'folders'),
          where('userId', '==', auth.currentUser.uid),
          orderBy('name', 'asc')
        );
        
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (indexError) {
        // If index error occurs, use a simpler query and sort manually
        console.warn("Index not found error in getFolders, using fallback query:", indexError);
        
        const fallbackQuery = query(
          collection(db, 'folders'),
          where('userId', '==', auth.currentUser.uid)
        );
        
        const fallbackSnapshot = await getDocs(fallbackQuery);
        
        // Sort manually by name (alphabetically)
        return fallbackSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
      }
    } catch (error) {
      console.error("Error fetching folders:", error);
      throw new Error(`Failed to fetch folders: ${error.message}`);
    }
  },
  
  async getFolder(folderId) {
    // First check if the user is authenticated
    if (!auth.currentUser) {
      throw new Error("You must be logged in to view folders");
    }
    
    try {
      const folderRef = doc(db, 'folders', folderId);
      const folderSnap = await getDoc(folderRef);
      
      if (!folderSnap.exists()) {
        throw new Error("Folder not found");
      }
      
      const folderData = folderSnap.data();
      
      // Verify the folder belongs to the current user
      if (folderData.userId !== auth.currentUser.uid) {
        throw new Error("You do not have permission to view this folder");
      }
      
      return {
        id: folderId,
        ...folderData
      };
    } catch (error) {
      console.error("Error fetching folder:", error);
      throw new Error(`Failed to fetch folder: ${error.message}`);
    }
  },
  
  async updateFolder(folderId, name) {
    // First check if the user is authenticated
    if (!auth.currentUser) {
      throw new Error("You must be logged in to update folders");
    }
    
    try {
      const folderRef = doc(db, 'folders', folderId);
      
      // Get the folder to verify ownership
      const folderSnap = await getDoc(folderRef);
      
      if (!folderSnap.exists()) {
        throw new Error("Folder not found");
      }
      
      const folderData = folderSnap.data();
      
      // Verify the folder belongs to the current user
      if (folderData.userId !== auth.currentUser.uid) {
        throw new Error("You do not have permission to update this folder");
      }
      
      // Update the folder
      await updateDoc(folderRef, {
        name,
        updatedAt: serverTimestamp()
      });
      
      return {
        id: folderId,
        name,
        updatedAt: new Date()
      };
    } catch (error) {
      console.error("Error updating folder:", error);
      throw new Error(`Failed to update folder: ${error.message}`);
    }
  },
  
  async deleteFolder(folderId) {
    // First check if the user is authenticated
    if (!auth.currentUser) {
      throw new Error("You must be logged in to delete folders");
    }
    
    try {
      const folderRef = doc(db, 'folders', folderId);
      
      // Get the folder to verify ownership
      const folderSnap = await getDoc(folderRef);
      
      if (!folderSnap.exists()) {
        throw new Error("Folder not found");
      }
      
      const folderData = folderSnap.data();
      
      // Verify the folder belongs to the current user
      if (folderData.userId !== auth.currentUser.uid) {
        throw new Error("You do not have permission to delete this folder");
      }
      
      // Delete the folder
      await deleteDoc(folderRef);
      
      // Update any materials in this folder to have no folder
      const materialsQuery = query(
        collection(db, 'materials'),
        where('userId', '==', auth.currentUser.uid),
        where('folderId', '==', folderId)
      );
      
      const materialsSnapshot = await getDocs(materialsQuery);
      
      // Update each material to remove the folder reference
      const updatePromises = materialsSnapshot.docs.map(doc => 
        updateDoc(doc.ref, { folderId: null })
      );
      
      await Promise.all(updatePromises);
      
      return true;
    } catch (error) {
      console.error("Error deleting folder:", error);
      throw new Error(`Failed to delete folder: ${error.message}`);
    }
  },
  
  async getMaterialsInFolder(folderId) {
    // First check if the user is authenticated
    if (!auth.currentUser) {
      throw new Error("You must be logged in to view materials");
    }
    
    try {
      // Query for materials in this folder ordered by creation date (newest first)
      try {
        const q = query(
          collection(db, 'materials'),
          where('userId', '==', auth.currentUser.uid),
          where('folderId', '==', folderId),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (indexError) {
        // If index error occurs, use a simpler query and sort manually
        console.warn("Index not found error in getMaterialsInFolder, using fallback query:", indexError);
        
        const fallbackQuery = query(
          collection(db, 'materials'),
          where('userId', '==', auth.currentUser.uid),
          where('folderId', '==', folderId)
        );
        
        const fallbackSnapshot = await getDocs(fallbackQuery);
        
        // Sort manually by creation date (newest first)
        return fallbackSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .sort((a, b) => {
            // Sort by timestamp in descending order (newest first)
            if (!a.createdAt || !b.createdAt) return 0;
            const timeA = a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
            const timeB = b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
            return timeB - timeA;
          });
      }
    } catch (error) {
      console.error("Error fetching materials in folder:", error);
      throw new Error(`Failed to fetch materials in folder: ${error.message}`);
    }
  }
};

export default FolderService;