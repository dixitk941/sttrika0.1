# Firebase Configuration Guide

## Overview
This project now uses a centralized Firebase configuration system to avoid code duplication and ensure consistency across all components.

## File Structure

### Core Configuration
- **`src/config/firebase.js`** - Main Firebase configuration and initialization
- **`src/utils/firebase-utils.js`** - Utility functions for common Firebase operations

### Usage Examples

#### 1. Basic Firebase Services
```javascript
import { auth, db, storage } from '../config/firebase';
```

#### 2. Firebase Functions
```javascript
import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged,
  doc,
  getDoc 
} from '../config/firebase';
```

#### 3. Utility Functions
```javascript
import { authUtils, firestoreUtils, storageUtils } from '../utils/firebase-utils';

// Authentication
const result = await authUtils.signIn(email, password);
if (result.success) {
  console.log('User signed in:', result.user);
}

// Firestore
const userData = await firestoreUtils.getDoc('users', userId);
if (userData.success) {
  console.log('User data:', userData.data);
}

// Storage
const uploadResult = await storageUtils.uploadProfilePicture(userId, file);
```

## Migration Guide

### Updated Components
- ✅ `HeaderBottom.js` - Updated to use centralized config
- ✅ `Profile.js` - Updated to use centralized config
- ✅ `Cart.js` - Updated to use centralized config
- ✅ `SignIn.js` - Updated to use centralized config
- ✅ `SignUp.js` - Updated to use centralized config

### Old Files to Remove
These duplicate Firebase config files can now be safely deleted:
- `src/pages/Account/firebaseConfig.js`
- `src/pages/Cart/firebaseConfig.js`
- `src/components/Profile/firebaseConfig.js`

## Utility Functions Available

### Authentication Utils (`authUtils`)
- `signIn(email, password)` - Sign in user
- `signUp(email, password, userData)` - Sign up user with optional additional data
- `signOut()` - Sign out current user
- `updateUserProfile(updates)` - Update user profile
- `resetPassword(email)` - Send password reset email
- `getCurrentUser()` - Get current user
- `onAuthStateChange(callback)` - Listen to auth state changes

### Firestore Utils (`firestoreUtils`)
- `createDoc(collection, docId, data)` - Create document with specific ID
- `addDoc(collection, data)` - Add document with auto-generated ID
- `getDoc(collection, docId)` - Get single document
- `updateDoc(collection, docId, data)` - Update document
- `deleteDoc(collection, docId)` - Delete document
- `getCollection(collection, queryConstraints)` - Get collection with queries
- `getUserOrders(userId)` - Get user's orders

### Storage Utils (`storageUtils`)
- `uploadFile(path, file)` - Upload file to storage
- `deleteFile(path)` - Delete file from storage
- `uploadProfilePicture(userId, file)` - Upload profile picture

## Benefits

1. **Single Source of Truth** - One Firebase configuration for entire app
2. **Consistent Initialization** - All Firebase services initialized once
3. **Reusable Utilities** - Common operations abstracted into utility functions
4. **Better Error Handling** - Standardized error handling across utilities
5. **Easier Maintenance** - Configuration changes only need to be made in one place
6. **Type Safety** - Centralized imports reduce import errors

## Best Practices

1. **Use Utility Functions** - Prefer utility functions over direct Firebase calls
2. **Error Handling** - Always check `success` property in utility function responses
3. **Consistent Data Structure** - Utilities automatically add `createdAt` and `updatedAt` timestamps
4. **Import Strategy** - Import only what you need from the centralized config

## Example Implementation

```javascript
// ❌ Old way - Multiple Firebase configs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// ... duplicate config in every file

// ✅ New way - Centralized config
import { auth, authUtils } from '../config/firebase';

const handleLogin = async (email, password) => {
  const result = await authUtils.signIn(email, password);
  if (result.success) {
    // Handle successful login
  } else {
    // Handle error
    console.error(result.error);
  }
};
```

## Security Notes

- Firebase configuration is already public-safe
- Sensitive operations are controlled by Firestore security rules
- All utility functions include proper error handling
- Authentication state is properly managed