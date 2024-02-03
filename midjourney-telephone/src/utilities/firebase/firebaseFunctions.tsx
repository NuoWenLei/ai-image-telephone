
import { toast } from "react-toastify";
import { firestore } from "./firebaseConfig";
import { DocumentData, doc, getDoc, DocumentSnapshot } from "firebase/firestore";
import { AuthState } from "../types";

export async function checkRegisterWithSnapshot(email: string): Promise<DocumentSnapshot<DocumentData> | null> {
  // const q = query(collection(firestore, "users"), where("email", "==", email));
  const docRef = doc(firestore, "Users", email);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) {
    console.log("Need to register")
    return null
  } else {
    console.log("You are registered")
    return snapshot
  }
}

export async function onLogin(authState: AuthState): Promise<boolean> {
  const authResult = await authState.login();
  if (typeof authResult === 'string' || authResult instanceof String) {
    toast.info("You don't have an account yet, signing you up!");
    return true;
  } else if (typeof authResult === "boolean") {
    // Reject based on true or false
    if (authResult) {
      toast.error("Sorry, we currently do not allow emails from your domain.");
    } else {
      toast.error("Authentication error: Sign-in was not completed")
    }
    return false;
  } else {
    // Sign in
    toast.success("Welcome back, " + authResult.email);
    return true;
  }
}

