import {
  DocumentData,
  DocumentSnapshot,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { firestore, storage } from "./firebaseConfig";
import { getDownloadURL, ref } from "firebase/storage";
import { Game, GameAndActiveThreads, Guess, GuessAndId } from "../types";

export async function getFirestoreDoc(
  collection: string,
  id: string
): Promise<DocumentSnapshot<DocumentData, DocumentData>> {
  const ref_ = doc(firestore, collection, id);
  const instance = await getDoc(ref_);
  return instance;
}

export async function getUserGuess(
  gameId: string,
  userId: string
): Promise<GuessAndId | null> {
  const guessCollectionRef = collection(firestore, "Guesses");
  const q = query(
    guessCollectionRef,
    where("gameId", "==", gameId),
    where("userId", "==", userId)
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const g = querySnapshot.docs[0];
  return {
    id: g.id,
    guess: g.data() as Guess,
  };
}

export async function getImageURL(path: string): Promise<string | null> {
  const imageRef = ref(storage, path);
  try {
    return await getDownloadURL(imageRef);
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function getGameAndActiveThreads(
  gameId: string
): Promise<GameAndActiveThreads | null> {
  const gameInstance = await getFirestoreDoc("Games", gameId);

  if (gameInstance.exists()) {
    const game = gameInstance.data() as Game;

    const activeThreads = await Promise.all(
      game.activeGuessThreads.map(async (guessId: string) => {
        const guessRef = doc(firestore, "Guesses", guessId);
        const guessInstance = await getDoc(guessRef);
        if (guessInstance.exists()) {
          return {
            guess: guessInstance.data() as Guess,
            id: guessId,
          };
        } else {
          return null;
        }
      })
    );

    return {
      game: game,
      threads: activeThreads.filter(
        (thread: GuessAndId | null) => thread != null
      ) as GuessAndId[],
    };
  }
  return null;
}

export async function slideshow(guessId: string): Promise<string[]> {
  // assume function called readGuess that takes in a guess id and then returns of type Guess which has parentGuess
  // and keeps going back until it reaches something where the parent guess is an empty string
  let slideshow: string[] = [];
  let currGuess: Guess = (
    await getFirestoreDoc("Guesses", guessId)
  ).data() as Guess;
  while (currGuess.parentGuess != "") {
    slideshow.push(currGuess.imagePath);
    currGuess = (
      await getFirestoreDoc("Guesses", currGuess.parentGuess)
    ).data() as Guess;
  }
  return slideshow;
}
