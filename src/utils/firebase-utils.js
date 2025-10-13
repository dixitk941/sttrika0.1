// Firebase Utility Functions
import { 
    auth, 
    db, 
    storage,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from '../config/firebase';

// Authentication Utilities
export const authUtils = {
    // Sign in user
    signIn: async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Sign up user
    signUp: async (email, password, userData = {}) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save additional user data to Firestore if provided
            if (Object.keys(userData).length > 0) {
                await setDoc(doc(db, "users", user.uid), {
                    ...userData,
                    email: user.email,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }

            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Sign out user
    signOut: async () => {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Update user profile
    updateUserProfile: async (updates) => {
        try {
            await updateProfile(auth.currentUser, updates);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Send password reset email
    resetPassword: async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get current user
    getCurrentUser: () => auth.currentUser,

    // Listen to auth state changes
    onAuthStateChange: (callback) => onAuthStateChanged(auth, callback)
};

// Firestore Utilities
export const firestoreUtils = {
    // Create document
    createDoc: async (collectionName, docId, data) => {
        try {
            await setDoc(doc(db, collectionName, docId), {
                ...data,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Add document (auto-generated ID)
    addDoc: async (collectionName, data) => {
        try {
            const docRef = await addDoc(collection(db, collectionName), {
                ...data,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get document
    getDoc: async (collectionName, docId) => {
        try {
            const docSnap = await getDoc(doc(db, collectionName, docId));
            if (docSnap.exists()) {
                return { success: true, data: docSnap.data(), id: docSnap.id };
            } else {
                return { success: false, error: "Document not found" };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Update document
    updateDoc: async (collectionName, docId, data) => {
        try {
            await updateDoc(doc(db, collectionName, docId), {
                ...data,
                updatedAt: new Date()
            });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Delete document
    deleteDoc: async (collectionName, docId) => {
        try {
            await deleteDoc(doc(db, collectionName, docId));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get collection with query
    getCollection: async (collectionName, queryConstraints = []) => {
        try {
            const q = query(collection(db, collectionName), ...queryConstraints);
            const querySnapshot = await getDocs(q);
            const docs = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            return { success: true, data: docs };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get user orders
    getUserOrders: async (userId) => {
        try {
            const q = query(
                collection(db, "orders"), 
                where("userId", "==", userId),
                orderBy("createdAt", "desc")
            );
            const querySnapshot = await getDocs(q);
            const orders = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            return { success: true, data: orders };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

// Storage Utilities
export const storageUtils = {
    // Upload file
    uploadFile: async (path, file) => {
        try {
            const storageRef = ref(storage, path);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return { success: true, url: downloadURL };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Delete file
    deleteFile: async (path) => {
        try {
            const storageRef = ref(storage, path);
            await deleteObject(storageRef);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Upload profile picture
    uploadProfilePicture: async (userId, file) => {
        const path = `profilePhotos/${userId}`;
        return await storageUtils.uploadFile(path, file);
    }
};

// Export the Firebase instances for direct use if needed
export { auth, db, storage };

// Export query constraints for convenience
export { where, orderBy, limit, serverTimestamp };