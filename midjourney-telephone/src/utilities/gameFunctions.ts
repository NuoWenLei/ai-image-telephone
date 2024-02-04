import {
  initializeGame,
  saveImage,
  updateGameWithGuess,
} from "./firebase/firebaseWriteFunctions";
import { DiffusionSettings, Game, GameType, Guess, GuessAndId } from "./types";

export const getBase64FromUrl = async (
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
  seed: number = 2,
  strength: number = 0.95,
  steps: number = 6,
  model: string = "stable-diffusion-v1-5",
  negative_prompt: string = "Disfigured, cartoon, blurry",
) {
  // TODO: use latent consistent image gen
  // source: https://docs.getimg.ai/reference/postlatentconsistencyimagetoimage
  const data = {
    model: model,
    prompt: prompt,
    negative_prompt: negative_prompt,
    // width: 640,
    // height: 640,
    strength: strength,
    steps: steps,
    image: base64_image,
    // guidance: 9,
    seed: seed,
    output_format: "jpeg",
  };

  console.log(prompt);

  const url = "https://api.getimg.ai/v1/stable-diffusion/image-to-image";

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

export async function createNewDailyGame(
  gameId: string,
  diffusionSettings?: DiffusionSettings
): Promise<Guess | null> {
  return await createNewGame(
    gameId,
    "auto",
    "Public",
    true,
    undefined,
    undefined,
    true,
    diffusionSettings
  );
}

export async function createNewGame(
  gameId: string,
  userId: string,
  gameType: GameType,
  randomImage: boolean,
  invitedUsers?: string[],
  description?: string,
  allowReplay?: boolean,
  diffusionSettings?: DiffusionSettings
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
      diffusionSettings: diffusionSettings
        ? diffusionSettings
        : {
            model: "stable-diffusion-v1-5",
            negative_prompt: "Disfigured, cartoon, blurry",
            strength: 0.95,
            steps: 6,
          },
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
): Promise<string | boolean> {
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

    if (status) {
      return guessId;
    }

    return false;
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
