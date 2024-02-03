import { arrayRemove, arrayUnion, collection, doc, getDoc, setDoc, updateDoc, writeBatch } from "firebase/firestore";
import { initialUser } from "../constants";
import { firestore, storage } from "./firebaseConfig";
import { ref, uploadString } from "firebase/storage";
import { AuthUser, Game, Guess } from "../types";

export async function createUser(email: string): Promise<AuthUser> {

	const collectionRef = collection(firestore, "Users");
	const docRef = doc(collectionRef, email);
	const currDoc = await getDoc(docRef);

	if (currDoc.exists()) {
		return currDoc.data() as AuthUser;
	} else {
		const newAuthUser: AuthUser = {...initialUser, email: email};
		await setDoc(docRef, newAuthUser);
		return newAuthUser;
	}
}

export async function initializeGame(game: Game, gameId: string, initialGuess: Guess, guessId: string): Promise<boolean> {
	const newGameRef = doc(firestore, "Games", gameId);
	const initGuessRef = doc(firestore, "Guesses", guessId);
	try {
		await setDoc(newGameRef, game);
		await setDoc(initGuessRef, initialGuess);
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
}

export async function saveImage(imageString: string, filename: string): Promise<string | null> {
	const refString = `images/${encodeURIComponent(filename)}`;
	const imageRef = ref(storage, refString);

	try {
		await uploadString(imageRef, imageString, "data_url");
		return refString;
	} catch (e) {
		return null;
	}
}

export async function updateGameWithGuess(
	gameId: string, guess: Guess, guessId: string, prevGuessId: string, userId: string): Promise<boolean> {
		const gameRef = doc(firestore, "Games", gameId);
		const guessRef = doc(firestore, "Guesses", guessId);
		const prevGuessRef = doc(firestore, "Guesses", prevGuessId);

		try {
			const batch = writeBatch(firestore);
			batch.set(guessRef, guess);
			batch.update(prevGuessRef, {childGuesses: arrayUnion(guessId)});
			batch.update(gameRef, {activeGuessThreads: arrayRemove(prevGuessId)});
			batch.update(gameRef, {activeGuessThreads: arrayUnion(guessId), allGuesses: arrayUnion(guessId), users: arrayUnion(userId)});
			await batch.commit();
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
}