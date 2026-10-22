import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  db,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from '../config/firebase.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Load Firestore profile and studio records for a given user
  const loadUserData = async (firebaseUser) => {
    if (!firebaseUser) {
      setUserProfile(null);
      setStudio(null);
      return;
    }

    try {
      // 1. Fetch user document from users collection
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const uData = userSnap.data();
        setUserProfile(uData);

        // 2. Fetch studio document
        if (uData.studioId) {
          const studioRef = doc(db, 'studios', uData.studioId);
          const studioSnap = await getDoc(studioRef);
          if (studioSnap.exists()) {
            setStudio(studioSnap.data());
          }
        }
      } else {
        // Fallback: If no Firestore record exists yet for this existing Firebase Auth user,
        // create a standard studio owner record
        const defaultStudioId = `studio-${firebaseUser.uid.slice(0, 8)}`;
        const ownerName = firebaseUser.displayName || firebaseUser.email.split('@')[0] || 'Studio Owner';
        
        const newUserData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: ownerName,
          role: 'studio_owner',
          studioId: defaultStudioId,
          createdAt: new Date().toISOString()
        };

        const newStudioData = {
          id: defaultStudioId,
          studioId: defaultStudioId,
          studioName: `${ownerName}'s Studio`,
          name: `${ownerName}'s Studio`,
          ownerName: ownerName,
          email: firebaseUser.email,
          businessEmail: firebaseUser.email,
          ownerUid: firebaseUser.uid,
          status: 'pending_payment',
          modules: {
            bookings: false,
            photos: false,
            songs: false,
            invoices: false,
            expenses: false,
            guestFinder: false,
            gallery: false,
            photoSelection: false
          },
          storage: { quotaGb: 0, usedGb: 0 },
          subscription: {
            plan: 'Custom',
            status: 'pending_payment',
            billingCycle: 'Monthly',
            startedAt: new Date().toISOString()
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        try {
          await setDoc(userRef, newUserData);
          await setDoc(doc(db, 'studios', defaultStudioId), newStudioData);
          setUserProfile(newUserData);
          setStudio(newStudioData);
        } catch (writeErr) {
          console.warn('Could not auto-create profile doc:', writeErr.message);
          setUserProfile(newUserData);
          setStudio(newStudioData);
        }
      }
    } catch (err) {
      console.warn('[AuthContext] Load user data notice:', err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await loadUserData(user);
      } else {
        setUserProfile(null);
        setStudio(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password, fullName, studioName, phone = '') => {
    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const cleanStudio = studioName.trim();

    // 1. Create Firebase Auth user
    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    const user = cred.user;

    // 2. Set Firebase displayName
    try {
      await updateProfile(user, { displayName: cleanName });
    } catch (e) {
      console.warn('Could not update profile displayName:', e);
    }

    // 3. Generate deterministic studio slug
    const studioSlug = cleanStudio
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const studioId = studioSlug ? `${studioSlug}-${user.uid.slice(0, 8)}` : `studio-${user.uid.slice(0, 8)}`;

    const now = new Date().toISOString();

    const userRecord = {
      uid: user.uid,
      email: cleanEmail,
      displayName: cleanName,
      phone: phone.trim(),
      role: 'studio_owner',
      studioId: studioId,
      createdAt: now
    };

    const studioRecord = {
      id: studioId,
      studioId: studioId,
      studioName: cleanStudio,
      name: cleanStudio,
      ownerName: cleanName,
      email: cleanEmail,
      businessEmail: cleanEmail,
      phone: phone.trim(),
      ownerUid: user.uid,
      status: 'pending_payment',
      modules: {
        bookings: false,
        photos: false,
        songs: false,
        invoices: false,
        expenses: false,
        guestFinder: false,
        gallery: false,
        photoSelection: false
      },
      storage: {
        quotaGb: 0,
        usedGb: 0
      },
      subscription: {
        plan: 'Custom',
        status: 'pending_payment',
        billingCycle: 'Monthly',
        startedAt: now
      },
      createdAt: now,
      updatedAt: now
    };

    // 4. Save to Firestore
    try {
      await setDoc(doc(db, 'users', user.uid), userRecord);
      await setDoc(doc(db, 'studios', studioId), studioRecord);
      setUserProfile(userRecord);
      setStudio(studioRecord);
    } catch (err) {
      console.warn('Failed to write initial Firestore doc:', err.message);
      setUserProfile(userRecord);
      setStudio(studioRecord);
    }

    // 5. Send verification email
    try {
      await sendEmailVerification(user);
    } catch (verifyErr) {
      console.warn('Could not send verification email:', verifyErr.message);
    }

    return { user, studioId };
  };

  const login = async (email, password) => {
    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase();
    const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
    await loadUserData(cred.user);
    return cred.user;
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
    setStudio(null);
  };

  const resetPassword = async (email) => {
    const cleanEmail = email.trim().toLowerCase();
    await sendPasswordResetEmail(auth, cleanEmail);
  };

  const resendVerification = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  };

  const refreshStudioProfile = async () => {
    if (currentUser) {
      await loadUserData(currentUser);
    }
  };

  const getIdToken = async () => {
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken(false);
    }
    return null;
  };

  const value = {
    currentUser,
    userProfile,
    studio,
    loading,
    authError,
    signup,
    login,
    logout,
    resetPassword,
    resendVerification,
    refreshStudioProfile,
    getIdToken,
    isAuthenticated: Boolean(currentUser)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
