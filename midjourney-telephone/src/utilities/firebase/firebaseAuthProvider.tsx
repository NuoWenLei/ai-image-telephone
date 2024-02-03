"use client";

import React, {createContext, useContext, useEffect, useState} from 'react';

import {signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider} from 'firebase/auth';
import {DocumentData, DocumentSnapshot} from 'firebase/firestore';
import { firebaseAuth } from './firebaseConfig';
import { AuthUser } from '../types';
import { checkRegisterWithSnapshot } from './firebaseFunctions';
import { initialAuthState } from '../constants';
import { createUser } from './firebaseWriteFunctions';

export const AuthContext = createContext(initialAuthState);

export const AuthProvider = ({ children }: { children: any }) => {

	const [user, setUser] = useState<AuthUser | null>(null);
	const [authLoading, setAuthLoading] = useState(false);
	
	/** Opens a Google sign-in popup and authenticates the user. */
	/** Should have 3 possible results:
	 * 1. Authenticated and logged in -> returns User with snapshot data
	 * 2. Unauthenticated due to not completing or failing authentication -> returns false
	 * 3. Authenticated by Google but not whitelisted email domain -> return true 
	 * 4. Authenticated by Google but no account -> returns email
	 */
	async function signInWithGoogle(): Promise<AuthUser | string | boolean> {
		setAuthLoading(true);
		const provider = new GoogleAuthProvider();
		provider.setCustomParameters({ prompt: 'select_account' });
		try {
			const result = await signInWithPopup(firebaseAuth, provider);
			const email = result.user.email;
			if (email == null) {
				setAuthLoading(false);
				return false;
			}
			const userSnapshot: DocumentSnapshot<DocumentData> | null = await checkRegisterWithSnapshot(email);
			if ((userSnapshot instanceof DocumentSnapshot) && userSnapshot.exists()) {
				const snapshotData: AuthUser = userSnapshot.data() as AuthUser;
				setUser(snapshotData);
				setAuthLoading(false);
				return snapshotData;
			} else {
				if (email.length == 0) {
					setAuthLoading(false);
					return false;
				}
				const newUserData: AuthUser = await createUser(email);
				setUser(newUserData);
				setAuthLoading(false);
				return newUserData;
			}
		} catch (e) {
			setAuthLoading(false);
			return false;
		}
	}

  const logoutFunction = async () => {
	setAuthLoading(true);
    try {
      setUser(null); // shut down the listeners
      await signOut(firebaseAuth);
    } catch (ex) {
      console.error(ex);
    }
	setAuthLoading(false);
  };

//   // hook into Firebase Authentication
//   useEffect(() => {
//     let unsubscribe = onAuthStateChanged(auth, (user) => {
//       // if user is null, then we force them to login
//       if (user) {
//         setUser(user);
//       }
//       setAuthLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   // listen to the user profile (FS User doc)
//   useEffect(() => {
//     let unsubscribe = null;
//     const listenToUserDoc = async (uid) => {
//       try {
//         let docRef = doc(myFirestore, `users/${uid}`);
//         unsubscribe = await onSnapshot(docRef, docSnap => setProfile(docSnap.data()));
//       } catch(ex) {
//         console.error(`useEffect() failed with: ${ex.message}`);
//       }
//     };

//     if (user?.uid) {
//       listenToUserDoc(user.uid)

//       return () => {
//         unsubscribe && unsubscribe();
//       };
//     } else if (!user) {
//       setAuthLoading(true);
//     }
//   }, [user, setProfile]);

// 	if (authLoading) {
// 		return <h1>Loading</h1>;
// 	}

	const theValues = {
		authLoading,
		user,
		login: signInWithGoogle,
		logout: logoutFunction,
	};

	return (
		<AuthContext.Provider value={theValues}>
			{children}
		</AuthContext.Provider>
	);
};