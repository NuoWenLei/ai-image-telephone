import {
  initializeGame,
  saveImage,
  updateGameWithGuess,
} from "./firebase/firebaseWriteFunctions";
import { Game, GameType, Guess, GuessAndId } from "./types";
import { bs64image } from "./imageConst";

const getBase64FromUrl = async (
  url: string
): Promise<string | null | ArrayBuffer> => {
  const data = await fetch(url);
  const blob = await data.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    };
  });
};

export async function getRandomImage(): Promise<string> {
  const res = await fetch("https://random.imagecdn.app/512/512");
  return (await getBase64FromUrl(res.url)) as string;
}

export async function generateImage(
  prompt: string,
  base64_image: string,
  seed: number = 2
) {
  // TODO: use latent consistent image gen
  // source: https://docs.getimg.ai/reference/postlatentconsistencyimagetoimage
  const data = {
    model: "lcm-realistic-vision-v5-1",
    prompt: prompt,
    negative_prompt: "Disfigured, cartoon, blurry",
    // width: 640,
    // height: 640,
    strength: 0.95,
    steps: 6,
    image: bs64image,
    // guidance: 9,
    seed: seed,
    output_format: "jpeg",
  };

  console.log(prompt);

  const url = "https://api.getimg.ai/v1/latent-consistency/image-to-image";

  let headers = new Headers();

  headers.append(
    "Authorization",
    `Bearer ${process.env.NEXT_PUBLIC_IMG_API_KEY}`
  );
  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");

  const res = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  });

  const resJson = await res.json();

  return "data:image/jpeg;base64," + resJson.image;
}

export async function createNewDailyGame(): Promise<Guess | null> {
  const d = new Date();
  const dateString = d.toISOString().split("T")[0];
  const gameId = `daily_${dateString}`;
  return await createNewGame(gameId, "auto", "Public", true);
}

export async function createNewGame(
  gameId: string,
  userId: string,
  gameType: GameType,
  randomImage: boolean,
  invitedUsers?: string[],
  description?: string,
  allowReplay?: boolean
): Promise<Guess | null> {
  let imageString = "";

  const seed = Math.floor(Math.random() * 100);

  if (randomImage) {
    imageString = await getRandomImage();
  } else {
    imageString = await generateImage(description!, "", seed);
  }

  const imageFilename = firestoreAutoId() + ".jpeg";

  const res = await saveImage(imageString, imageFilename);

  const guessId = firestoreAutoId();

  if (res) {
    const initialGuess: Guess = {
      gameId: gameId,
      userId: userId,
      imagePath: res,
      description: randomImage ? "" : description!,
      parentGuess: "",
      childGuesses: [],
      seed: seed,
    };
    const newGame: Game = {
      gameName: gameId,
      gameCreator: userId,
      users: [],
      initialGuess: guessId,
      allGuesses: [],
      activeGuessThreads: [guessId],
      gameType: gameType,
      invitedUsers: invitedUsers == undefined ? [] : invitedUsers,
      allowReplay: allowReplay == undefined ? false : allowReplay,
    };
    const initializationRes = await initializeGame(
      newGame,
      gameId,
      initialGuess,
      guessId
    );
    if (initializationRes) {
      return initialGuess;
    }
  }
  return null;
}

export async function submitGuess(
  gameId: string,
  userId: string,
  imageString: string,
  description: string,
  prevGuess: GuessAndId
): Promise<boolean> {
  const imageFilename = firestoreAutoId() + ".jpeg";
  const res = await saveImage(imageString, imageFilename);

  if (res) {
    const guessId: string = firestoreAutoId();
    const guess: Guess = {
      gameId: gameId,
      userId: userId,
      imagePath: res,
      description: description,
      parentGuess: prevGuess.id,
      childGuesses: [],
      seed: prevGuess.guess.seed,
    };

    const status = await updateGameWithGuess(
      gameId,
      guess,
      guessId,
      prevGuess.id,
      userId
    );

    return status;
  }
  return false;
}

export const firestoreAutoId = (): string => {
  const CHARS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let autoId = "";

  for (let i = 0; i < 20; i++) {
    autoId += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return autoId;
};
